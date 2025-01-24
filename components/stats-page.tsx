'use client'

import Image from 'next/image'
import { Github } from 'lucide-react'
import { Card } from '@/components/ui/card'
// import { fetchGitHubStats } from '@/lib/github-actions'
import { motion } from 'framer-motion'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function StatsPage({ stats, username }: { stats: any, username: string }) {
  // const stats = await fetchGitHubStats(username)
  const topContributions = [
    {
      repo: 'greptile/greptile',
      description: 'Implemented auth and cured bugs that no one else could see',
      date: '2 days ago'
    },
    {
      repo: 'greptile/greptile',
      description: 'Implemented auth and cured bugs that no one else could see',
      date: '1 week ago'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Decorative dots pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#1c8a5c_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
      </div>

      <motion.div 
        className="relative z-10 max-w-2xl mx-auto p-4"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        {/* Profile Section */}
        <motion.div 
          className="text-center mb-12"
          variants={fadeInUp}
        >
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={stats.avatarUrl || '/placeholder-avatar.png'}
              alt={`${username}'s profile picture`}
              width={96}
              height={96}
              className="rounded-full border-2 border-emerald-500/20"
            />
          </div>
          <h1 className="text-2xl font-medium mb-1">{stats.name}</h1>
          <p className="text-gray-400 mb-4">@{stats.login}</p>
          <div className="flex justify-center gap-3 text-[13px] text-gray-300">
            <span>❤️ TypeScript Wizard</span>
            <span>⚛️ Reactjs Magician</span>
            <span>🦅 Design Systems</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-4 gap-6 mb-16"
          variants={staggerChildren}
        >
          {[
            { value: '97', label: 'score', topPercent: '0.01', icon: '🏆' },
            { value: stats.totalCommits, label: 'commits', topPercent: '0.01', icon: '🏆' },
            { value: '99.1k', label: 'additions', topPercent: '1.3', icon: '🔥' },
            { value: '9k', label: 'deletions', topPercent: '4.1', icon: '📈' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={fadeInUp}
            >
              <Card className="bg-gray-900/50 border-gray-800 p-8 text-center backdrop-blur-sm">
                <div className="text-3xl text-white font-semibold mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
                <div className="text-xs font-medium" style={{ color: i === 3 ? '#10B981' : '#EAB308' }}>
                  {stat.icon} TOP {stat.topPercent}%
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Top Contributions */}
        <motion.div 
          className="mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-6">
            Top Contributions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topContributions.map((contribution, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
              >
                <Card className="bg-gray-900/50 border-gray-800 p-6 hover:bg-gray-900/70 transition-colors backdrop-blur-sm">
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
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div 
          className="pb-24"
          variants={fadeInUp}
        >
          <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-8">
            Highlights
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-[#1C1917] border-gray-800 p-8 flex items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-3">Overview screen</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  changes were deployed to production along with the new E2E cases.
                </p>
              </div>
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src="/trophy-placeholder.png"
                  alt="Trophy"
                  width={64}
                  height={64}
                  className="opacity-80"
                />
              </div>
            </Card>
            <Card className="bg-[#0C1B2A] border-blue-900 p-8 flex items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-3">
                  Wrote <span className="text-white">9,000</span> lines
                </h3>
                <p className="text-sm text-gray-400">of PHP</p>
              </div>
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src="/shield-placeholder.png"
                  alt="Shield"
                  width={64}
                  height={64}
                  className="opacity-80"
                />
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-t border-gray-800"
          variants={fadeInUp}
        >
          <div className="max-w-2xl mx-auto py-4 px-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              Powered by Greptile
              <span className="text-lg">🦎</span>
            </div>
            <button className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors text-white text-sm">
              Get your own →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

