import Link from "next/link"
import StatsPage from "@/components/stats-page"
import ErrorDisplay from '@/components/error-display'
import ErrorProfile from '@/components/error-profile'
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
import HomePage from "@/components/home-page"

interface Props {
  params: {
    username: string
  }
}

export default async function UserPage({ params }: Props) {
  try {
    const session = await auth()
    const isAuthenticated = !!session && session.login === params.username
    
    const cachedData = await batchCheckCache(params.username, isAuthenticated)
    const { shouldRegenerate } = cachedData

    // Get GitHub stats (from cache or fetch)
    const stats = cachedData['github:stats'] || 
      await fetchGitHubStats(params.username, isAuthenticated)
    
    if (!stats) {
      return <ErrorProfile />
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
