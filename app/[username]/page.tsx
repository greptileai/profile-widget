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
import { Metadata } from 'next'

interface Props {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const stats = await fetchGitHubStats(params.username, false)
    
    return {
      title: `${params.username}'s GitHub Stats`,
      description: stats?.bio || `Check out ${params.username}'s GitHub statistics and developer profile`,
      openGraph: {
        title: `${params.username}'s GitHub Stats`,
        description: stats?.bio || `Check out ${params.username}'s GitHub statistics and developer profile`,
        images: [{
          url: `${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${params.username}/stats`,
          width: 800,
          height: 200,
          alt: `${params.username}'s GitHub Stats`
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${params.username}'s GitHub Stats`,
        description: stats?.bio || `Check out ${params.username}'s GitHub statistics and developer profile`,
        images: [`${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${params.username}/stats`],
      }
    }
  } catch (error) {
    return {
      title: 'GitHub Stats',
      description: 'View GitHub statistics and developer profiles'
    }
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
