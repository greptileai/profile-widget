import { erf } from 'mathjs';

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
  // Define means (previously median values)
  const COMMIT_MEAN = 150;
  const ADDITIONS_MEAN = 10000;
  const DELETIONS_MEAN = 5000;

  // Calculate individual scores (0-100)
  const commitScore = calculateMetricScore(stats.totalCommits || 0, COMMIT_MEAN);
  const additionsScore = calculateMetricScore(stats.additions || 0, ADDITIONS_MEAN);
  const deletionsScore = calculateMetricScore(stats.deletions || 0, DELETIONS_MEAN);

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

function calculateMetricScore(value: number, mean: number): number {
  const stdDev = mean * 0.6;  // Standard deviation as 60% of mean
  const zScore = (value - mean) / stdDev;
  
  // Convert to probability using error function (erf)
  const probability = ((1 + erf(zScore / Math.sqrt(2))) / 2) * 1.25;
  const score = Math.round(probability * 100);
  
  return Math.min(score, 100);
}

function calculateTopPercentage(score: number): number {
  // Make the top percentage even more favorable by applying a bigger reduction
  const topPercentage = (100 - score) * 0.7; // Reduced by 30% (previously 0.8)
  return Math.max(1, Math.round(topPercentage));
}
