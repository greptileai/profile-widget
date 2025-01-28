import StatsPage from "@/components/stats-page"
import { fetchGitHubStats } from "@/lib/actions/github-actions"
import { 
  generateTags, 
  generateTopContributions, 
  generateHighlights, 
  generateProgrammerArchtype,
  generateNextProject,
  generateAchillesHeel
} from "@/lib/actions/ai-actions"
import { GitHubStats } from "@/types/github"
import { auth } from "@/lib/auth"

interface Props {
  params: {
    username: string
  }
}

export default async function UserPage({ params }: Props) {
  const session = await auth()
  const isAuthenticated = !!session
  
  const stats = await fetchGitHubStats(params.username, isAuthenticated)
  
  // Fetch all AI-generated content in parallel
  const [tags, topContributions, highlights, archetype, nextProject, achillesHeel] = await Promise.all([
    generateTags(stats.bio, stats.topRepositories),
    generateTopContributions(stats.topRepositories),
    generateHighlights(stats, stats.topRepositories),
    generateProgrammerArchtype(stats, stats.topRepositories),
    generateNextProject(stats, stats.topRepositories),
    generateAchillesHeel(stats, stats.topRepositories)
  ])

  return <StatsPage 
    username={params.username} 
    stats={stats} 
    tags={tags}
    topContributions={topContributions}
    highlights={highlights}
    archetype={archetype}
    nextProject={nextProject}
    achillesHeel={achillesHeel}
    isAuthenticated={isAuthenticated}
  />
}
