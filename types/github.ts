export interface GitHubStats {
    avatarUrl: string;
    name: string;
    login: string;
    totalCommits: number;
    topRepositories: Array<{
      name: string;
      description: string;
      commits: number;
    }>;
  }