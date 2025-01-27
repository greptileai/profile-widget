import StatsPage from "@/components/stats-page"
import { fetchGitHubStats } from "@/lib/actions/github-actions"
import { generateTags, generateTopContributions, generateHighlights } from "@/lib/actions/ai-actions"
import { GitHubStats } from "@/types/github"

interface Props {
  params: {
    username: string
  }
}

export default async function UserPage({ params }: Props) {
  const stats = await fetchGitHubStats(params.username)
  
  // Fetch all AI-generated content in parallel
  const [tags, topContributions, highlights] = await Promise.all([
    generateTags(stats.bio, stats.topRepositories),
    generateTopContributions(stats.topRepositories),
    generateHighlights(stats, stats.topRepositories)
  ])

  return <StatsPage 
    username={params.username} 
    stats={stats} 
    tags={tags}
    topContributions={topContributions}
    highlights={highlights}
  />
}
