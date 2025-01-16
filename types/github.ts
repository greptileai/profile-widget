export interface GitHubStats {
    totalCommits: number;
    totalAdditions: number;
    totalDeletions: number;
    topContributions: Array<{
      repoName: string;
      description: string;
      timestamp: string;
    }>;
  }