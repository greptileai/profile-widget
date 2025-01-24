interface GitHubStats {
  totalCommits?: number;
  additions?: number;
  deletions?: number;
  // Add other stats as needed
}

interface ScoreMetrics {
  score: number;
  commitScore: number;
  additionsScore: number;
  deletionsScore: number;
  topPercentages: {
    overall: number;
    commits: number;
    additions: number;
    deletions: number;
  };
  icons: {
    overall: string;
    commits: string;
    additions: string;
    deletions: string;
  };
}

function getIconForScore(score: number): string {
  if (score >= 90) return '👑';
  if (score >= 80) return '🏆';
  if (score >= 70) return '🌟';
  if (score >= 60) return '💫';
  return '🎯';
}

export function calculateScores(stats: GitHubStats): ScoreMetrics {
  // These thresholds can be adjusted based on your scoring criteria
  const COMMIT_THRESHOLDS = [100, 500, 1000, 5000];
  const ADDITIONS_THRESHOLDS = [1000, 10000, 50000, 100000];
  const DELETIONS_THRESHOLDS = [500, 5000, 25000, 50000];

  // Calculate individual scores (0-100)
  const commitScore = calculateMetricScore(stats.totalCommits || 0, COMMIT_THRESHOLDS);
  const additionsScore = calculateMetricScore(stats.additions || 0, ADDITIONS_THRESHOLDS);
  const deletionsScore = calculateMetricScore(stats.deletions || 0, DELETIONS_THRESHOLDS);

  // Calculate overall score (weighted average)
  const score = Math.round(
    (commitScore * 0.4) + 
    (additionsScore * 0.35) + 
    (deletionsScore * 0.25)
  );

  // Calculate top percentages (inverse of score percentile)
  const topPercentages = {
    overall: calculateTopPercentage(score),
    commits: calculateTopPercentage(commitScore),
    additions: calculateTopPercentage(additionsScore),
    deletions: calculateTopPercentage(deletionsScore)
  };

  const icons = {
    overall: getIconForScore(score),
    commits: getIconForScore(commitScore),
    additions: getIconForScore(additionsScore),
    deletions: getIconForScore(deletionsScore)
  };

  return {
    score,
    commitScore,
    additionsScore,
    deletionsScore,
    topPercentages,
    icons
  };
}

function calculateMetricScore(value: number, thresholds: number[]): number {
  const baseScore = 60; // Starting score
  const remainingPoints = 40; // Points to distribute across thresholds
  let score = baseScore;

  for (let i = 0; i < thresholds.length; i++) {
    if (value >= thresholds[i]) {
      score += remainingPoints / thresholds.length;
    }
  }

  return Math.round(Math.min(score, 100));
}

function calculateTopPercentage(score: number): number {
  // Convert score to top percentage (e.g., 95 score → top 5%)
  return Number((100 - score).toFixed(2));
}
