"use server"

import { GitHubStats } from "@/types/github";

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
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
            commitContributionsByRepository(maxRepositories: 3) {
              repository {
                nameWithOwner
                description
                stargazerCount
                forkCount
                primaryLanguage {
                  name
                }
              }
              contributions {
                totalCount
              }
            }
          }
          repositories(first: 25, orderBy: {field: PUSHED_AT, direction: DESC}) {
            nodes {
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(since: "${oneYearAgo.toISOString()}", first: 25) {
                      nodes {
                        additions
                        deletions
                      }
                    }
                  }
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
        headers,
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
        totalAdditions: data.data.user.repositories.nodes.reduce((sum: number, repo: any) => 
          sum + (repo.defaultBranchRef?.target?.history?.nodes?.reduce((commitSum: number, commit: any) => 
            commitSum + (commit?.additions || 0), 0) || 0), 0),
        totalDeletions: data.data.user.repositories.nodes.reduce((sum: number, repo: any) => 
          sum + (repo.defaultBranchRef?.target?.history?.nodes?.reduce((commitSum: number, commit: any) => 
            commitSum + (commit?.deletions || 0), 0) || 0), 0),
        topRepositories: contributionsCollection.commitContributionsByRepository.map(
          (repo: any) => ({
            name: repo.repository.nameWithOwner,
            description: repo.repository.description || '',
            commits: repo.contributions.totalCount,
            stars: repo.repository.stargazerCount,
            forks: repo.repository.forkCount,
            primaryLanguage: repo.repository.primaryLanguage?.name || null,
          })
        ),
      };
      
      console.log(results);
      return results;
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      // Return default values if the API fails
      return {
        avatarUrl: `https://github.com/${username}.png`,
        name: username,
        login: username,
        bio: '',
        totalCommits: 0,
        totalAdditions: 0,
        totalDeletions: 0,
        topRepositories: [],
      };
    }
}