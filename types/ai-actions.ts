export type Repository = {
  name: string
  description: string
  commits: number
  stars: number
  primaryLanguage: string | null
  languages: {
    name: string
    color: string
  }[]
  recentCommits: {
    message: string
    date: string
    additions: number
    deletions: number
  }[]
}

