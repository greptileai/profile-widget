"use server"

import { auth } from "@/lib/auth"
import { GitHubStats } from "@/types/github";
import { headers } from 'next/headers'
import { getCachedData, setCachedData } from '@/lib/redis'

export async function fetchGitHubStats(username: string, isAuthenticated: boolean = false): Promise<GitHubStats | null> {
    const cachedStats = await getCachedData<GitHubStats>('github:stats', { username, isAuthenticated })
    if (cachedStats) return cachedStats

    // Verify authentication state server-side
    const session = await auth()
    const isActuallyAuthenticated = !!session?.accessToken
    
    // Don't trust the client's isAuthenticated flag
    if (isAuthenticated && !isActuallyAuthenticated) {
        throw new Error('Unauthorized: Invalid authentication state')
    }

    const headersList = headers()
    const userAgent = headersList.get('user-agent')
    
    const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': isActuallyAuthenticated 
            ? `Bearer ${session.accessToken}`
            : `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        'User-Agent': userAgent || 'GitHub-Stats-App',
    };
  
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const query = `
      query GetUserStats($username: String!) {
        user(login: $username) {
          avatarUrl
          name
          login
          bio
          contributionsCollection(from: "${oneYearAgo.toISOString()}") {
            totalCommitContributions
            commitContributionsByRepository(maxRepositories: 12) {
              repository {
                nameWithOwner
                description
                stargazerCount
                forkCount
                primaryLanguage {
                  name
                }
                pushedAt
                issues {
                  totalCount
                }
                pullRequests {
                  totalCount
                }
                languages(first: 3, orderBy: {field: SIZE, direction: DESC}) {
                  nodes {
                    name
                    color
                  }
                }
                defaultBranchRef {
                  target {
                    ... on Commit {
                      history(first: 70) {
                        nodes {
                          message
                          committedDate
                          additions
                          deletions
                          changedFiles
                        }
                      }
                    }
                  }
                }
              }
              contributions {
                totalCount
              }
            }
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({ 
          query,
          variables: { username }
        }),
        next: { revalidate: 3600 } // Cache for 1 hour
      });
    
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
    
      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL Error: ${data.errors[0].message}`);
      }

      const { contributionsCollection } = data.data.user;
      
      const results = {
        avatarUrl: data.data.user.avatarUrl,
        name: data.data.user.name || data.data.user.login,
        login: data.data.user.login,
        bio: data.data.user.bio || '',
        totalCommits: contributionsCollection.totalCommitContributions,
        totalAdditions: contributionsCollection.commitContributionsByRepository.reduce((sum: number, repo: any) => 
          sum + (repo.repository.defaultBranchRef?.target?.history?.nodes?.reduce((commitSum: number, commit: any) => 
            commitSum + (commit?.additions || 0), 0) || 0), 0),
        totalDeletions: contributionsCollection.commitContributionsByRepository.reduce((sum: number, repo: any) => 
          sum + (repo.repository.defaultBranchRef?.target?.history?.nodes?.reduce((commitSum: number, commit: any) => 
            commitSum + (commit?.deletions || 0), 0) || 0), 0),
        topRepositories: contributionsCollection.commitContributionsByRepository.map(
          (repo: any) => ({
            name: repo.repository.nameWithOwner,
            description: repo.repository.description || '',
            commits: repo.contributions.totalCount,
            stars: repo.repository.stargazerCount,
            forks: repo.repository.forkCount,
            primaryLanguage: repo.repository.primaryLanguage?.name || null,
            languages: repo.repository.languages?.nodes || [],
            recentCommits: repo.repository.defaultBranchRef?.target?.history?.nodes?.map((commit: any) => ({
              message: commit.message,
              date: commit.committedDate,
              additions: commit.additions,
              deletions: commit.deletions,
              changedFiles: commit.changedFiles
            })) || [],
            issues: repo.repository.issues?.totalCount || 0,
            pullRequests: repo.repository.pullRequests?.totalCount || 0,
            pushedAt: repo.repository.pushedAt
          })
        ),
      };
      
      await Promise.all([
        setCachedData('github:stats', results, { username, isAuthenticated }),
        setCachedData('github:fresh', false, { username, isAuthenticated }) // Changed to false
      ])
      
      return results;
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      // Return nullif the API fails
      return null;
    }
}