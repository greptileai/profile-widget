import StatsPage from "@/components/stats-page"
import { fetchGitHubStats } from "@/lib/github-actions"
import { GitHubStats } from "@/types/github"

interface Props {
  params: {
    username: string
    stats: GitHubStats
  }
}

export default async function UserPage({ params }: Props) {
  const stats = await fetchGitHubStats(params.username)
  return <StatsPage username={params.username} stats={stats} />
}
