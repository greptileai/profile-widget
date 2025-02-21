import Link from "next/link"
import StatsPage from "@/components/stats-page"
import ErrorDisplay from '@/components/error-display'
import { fetchGitHubStats } from "@/lib/actions/github-actions"
import { calculateScores } from '@/lib/calculate-scores'
import { 
  generateTags, 
  generateTopContributions, 
  generateHighlights, 
  generateProgrammerArchtype,
  generateNextProject,
  generateAchillesHeel
} from "@/lib/actions/ai-actions"
import { auth } from "@/lib/auth"
import { batchCheckCache } from '@/lib/redis'

interface Props {
  params: {
    username: string
  }
}

const MAX_RETRIES = 3;

async function fetchWithRetry(username: string, isAuthenticated: boolean, retries: number = MAX_RETRIES) {
  try {
    console.log(`Retrying... Attempts left: ${retries}`);
    return await fetchGitHubStats(username, isAuthenticated);
  } catch (error) {
    if (retries > 0 && error instanceof Error && error.message.includes("502 Bad Gateway")) {
      return fetchWithRetry(username, isAuthenticated, retries - 1);
    }
    throw error;
  }
}

export default async function UserPage({ params }: Props) {
  try {
    const session = await auth()
    const isAuthenticated = !!session && session.login === params.username
    
    const cachedData = await batchCheckCache(params.username, isAuthenticated)
    const { shouldRegenerate } = cachedData
    const stats = cachedData['github:stats'] || 
      await fetchWithRetry(params.username, isAuthenticated);
    
    if (!stats) {
      return <ErrorDisplay 
        title="Unable to Load Profile"
        message="There was an error loading this profile. Please try again."
        buttonText="Try Again"
      />
    }
    
    // Calculate scores (from cache or compute)
    const scores = cachedData['scores'] ||
      await calculateScores({
        totalCommits: stats.totalCommits,
        additions: stats.totalAdditions,
        deletions: stats.totalDeletions
      }, {
        username: params.username,
        isAuthenticated
      })

    // Generate AI content only if needed
    const [tags, topContributions, highlights, archetype, nextProject, achillesHeel] = await Promise.all([
      generateTags(stats.bio, stats.topRepositories, params.username, isAuthenticated, shouldRegenerate),
      generateTopContributions(stats.topRepositories, params.username, isAuthenticated, shouldRegenerate),
      generateHighlights(stats, stats.topRepositories, params.username, isAuthenticated, shouldRegenerate),
      generateProgrammerArchtype(stats, stats.topRepositories, params.username, isAuthenticated, shouldRegenerate),
      generateNextProject(stats, stats.topRepositories, params.username, isAuthenticated, shouldRegenerate),
      generateAchillesHeel(stats, stats.topRepositories, params.username, isAuthenticated, shouldRegenerate)
    ])

    return <StatsPage 
      username={params.username}
      stats={stats}
      scores={scores}
      tags={tags}
      topContributions={topContributions}
      highlights={highlights}
      archetype={archetype}
      nextProject={nextProject}
      achillesHeel={achillesHeel}
    />
  } catch (error) {
    return <ErrorDisplay 
      title="Oops! Something went wrong"
      message={error instanceof Error ? error.message : 'Unable to load GitHub stats'}
      buttonText="Return Home"
      href="/"
    />
  }
}
