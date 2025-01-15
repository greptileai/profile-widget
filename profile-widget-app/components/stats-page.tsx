import Image from 'next/image'
import { Github } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { fetchGitHubStats } from '@/lib/github'

export default async function StatsPage() {
  const stats = await fetchGitHubStats()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 p-4">
      {/* Profile Section */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Image
            src="/assets/anime.jpg"
            alt="Profile"
            width={96}
            height={96}
            className="rounded-full"
          />
          <span className="absolute -bottom-1 right-0 bg-emerald-500 text-[11px] px-1.5 py-0.5 rounded-md font-medium">
            A+
          </span>
        </div>
        <h1 className="text-2xl font-medium mb-1">Jonathan Cook</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">@chefjon</p>
        <div className="flex justify-center gap-3 text-[13px]">
          <span>❤️ TypeScript Wizard</span>
          <span>⚛️ Reactjs Magician</span>
          <span>🦅 Design Systems</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 max-w-2xl mx-auto mb-16 gap-6">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-8 text-center">
          <div className="text-3xl font-semibold mb-2">{stats.totalCommits}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">commits</div>
          <div className="font-bold text-xs text-yellow-500 font-medium">
            🏆 TOP 0.01%
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-8 text-center">
          <div className="text-3xl font-semibold mb-2">99.1k</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">additions</div>
          <div className="font-bold text-xs text-yellow-500 font-medium">
            🔥 TOP 1.3%
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-8 text-center">
          <div className="text-3xl font-semibold mb-2">9k</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">deletions</div>
          <div className="font-bold text-xs text-emerald-500 font-medium">
            📈 TOP 4.1%
          </div>
        </Card>
      </div>

      {/* Top Contributions */}
      <div className="max-w-2xl mx-auto mb-16">
        <h2 className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-medium mb-6">
          Top Contributions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.topContributions.map((contribution, i) => (
            <Card 
              key={i} 
              className="flex flex-col p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <span className="text-gray-700 dark:text-gray-300">greptile</span>
                    <span className="text-gray-400 dark:text-gray-500">/</span>
                    <span className="text-gray-700 dark:text-gray-300">greptile</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {i === 0 ? "2 days ago" : i === 1 ? "1 week ago" : "2 weeks ago"}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Implemented auth and cured bugs that no one else could see
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="max-w-2xl mx-auto pb-24">
        <h2 className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-medium mb-8">
          Highlights
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-8 flex items-center gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-3">Overview screen</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Changes were deployed to production along with the new E2E cases.
              </p>
            </div>
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Trophy"
                width={64}
                height={64}
                className="opacity-80"
              />
            </div>
          </Card>
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900 p-8 flex items-center gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-3">Wrote 9,000 lines</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                of PHP
              </p>
            </div>
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Shield"
                width={64}
                height={64}
                className="opacity-80"
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto py-4 px-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            Powered by Greptile
            <span className="text-lg">🦎</span>
          </div>
          <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 text-sm">
            Get your own →
          </button>
        </div>
      </div>
    </div>
  )
}

