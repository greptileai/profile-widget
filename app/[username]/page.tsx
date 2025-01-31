import Link from "next/link"
import StatsPage from "@/components/stats-page"
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
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Unable to Load Profile</h1>
            <p className="text-gray-400 mb-6">
              There was an error loading this profile. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      )
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
    // Handle authentication and other errors gracefully
    console.error('Error in UserPage:', error)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-400 mb-6">
            {error instanceof Error ? error.message : 'Unable to load GitHub stats'}
          </p>
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm transition-all duration-200"
          >
            Return Home
          </a>
        </div>
      </div>
    )
  }
}
