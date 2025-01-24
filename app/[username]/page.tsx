import StatsPage from "@/components/stats-page"
import { fetchGitHubStats } from "@/lib/github-actions"
import { generateTags } from "@/lib/ai-actions"
import { GitHubStats } from "@/types/github"

interface Props {
  params: {
    username: string
  }
}

export default async function UserPage({ params }: Props) {
  const stats = await fetchGitHubStats(params.username)
  const tags = await generateTags(stats.bio, stats.topRepositories)

  return <StatsPage 
    username={params.username} 
    stats={stats} 
    tags={tags} 
  />
}
