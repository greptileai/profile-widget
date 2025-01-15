import { GitHubStats } from "@/types/github";

export async function fetchGitHubStats(): Promise<GitHubStats> {
    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    };
  
    // GraphQL query to fetch all required data at once
    const query = `
      query {
        viewer {
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
      body: JSON.stringify({ query }),
    });
  
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
  
    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL Error: ${data.errors[0].message}`);
    }

    const { contributionsCollection } = data.data.viewer;
    
    return {
      totalCommits: contributionsCollection.totalCommitContributions,
      topRepositories: contributionsCollection.commitContributionsByRepository.map(
        (repo: any) => ({
          name: repo.repository.nameWithOwner,
          description: repo.repository.description || '',
          commits: repo.contributions.totalCount,
        })
      ),
    };
  }