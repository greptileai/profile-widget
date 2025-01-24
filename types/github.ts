export interface GitHubStats {
    avatarUrl: string;
    name: string;
    login: string;
    bio: string;
    totalCommits: number;
    totalAdditions: number;
    totalDeletions: number;
    topRepositories: Array<{
      name: string;
      description: string;
      commits: number;
    }>;
  }