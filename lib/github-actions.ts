"use server"

import { GitHubStats } from "@/types/github";

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    };
  
    // GraphQL query to fetch all required data at once
    const query = `
      query GetUserStats($username: String!) {
        user(login: $username) {
          avatarUrl
          name
          login
          contributionsCollection {
            totalCommitContributions
            commitContributionsByRepository(maxRepositories: 3) {
              repository {
                nameWithOwner
                description
              }
              contributions {
                totalCount
              }
            }
          }
        }
      }
    `;
  
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        query,
        variables: { username }
      }),
    });
  
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
  
    const data = await response.json();
    
    // Add logging to see the raw API response
    console.log('GitHub API Response:', data);
    
    if (data.errors) {
      throw new Error(`GraphQL Error: ${data.errors[0].message}`);
    }

    const { contributionsCollection } = data.data.user;
    
    // Add logging to see the processed results
    const results = {
      avatarUrl: data.data.user.avatarUrl,
      name: data.data.user.name || data.data.user.login,
      login: data.data.user.login,
      totalCommits: contributionsCollection.totalCommitContributions,
      topRepositories: contributionsCollection.commitContributionsByRepository.map(
        (repo: any) => ({
          name: repo.repository.nameWithOwner,
          description: repo.repository.description || '',
          commits: repo.contributions.totalCount,
        })
      ),
    };
    
    console.log('Processed GitHub Stats:', results);
    
    return results;
  }