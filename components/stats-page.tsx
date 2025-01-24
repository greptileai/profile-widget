'use client'

import Image from 'next/image'
import { Github } from 'lucide-react'
import { Card } from '@/components/ui/card'
// import { fetchGitHubStats } from '@/lib/github-actions'
import { motion } from 'framer-motion'
import GitHubCalendar from 'react-github-calendar'
import { calculateScores } from '@/lib/calculate-scores'
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

export default function StatsPage({ 
  stats, 
  username,
  tags 
}: { 
  stats: any, 
  username: string,
  tags: string[]
}) {
  // Static test data
  const testStats = {
    additions: 100,
    deletions: 50
  }

  const scores = calculateScores({
    totalCommits: stats.totalCommits,
    additions: stats.totalAdditions,
    deletions: stats.totalDeletions
  });

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
    <div className="bg-black w-full">
      {/* Removing the decorative dots pattern div */}

      <motion.div 
        className="relative z-10 max-w-3xl mx-auto px-4 pt-8"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        {/* Profile Section */}
        <motion.div 
          className="mb-8 mt-16"
          variants={fadeInUp}
        >
          <div className="relative h-[160px]">
            <div className="absolute top-2 left-0 right-0 z-20">
              <div className="relative w-24 h-24 mb-1">
                <Image
                  src={stats.avatarUrl || '/placeholder-avatar.png'}
                  alt={`${username}'s profile picture`}
                  width={96}
                  height={96}
                  className="rounded-full border-2 border-emerald-500/20"
                />
              </div>
              <h1 className="text-2xl text-white font-medium mb-0.5">
                {stats.name}
              </h1>
              <p className="text-gray-400">@{stats.login}</p>
            </div>
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-100 pl-27">
              <GitHubCalendar username={username} hideTotalCount={true} hideColorLegend={true} hideMonthLabels={true} blockSize={8} blockRadius={10} blockMargin={10}/>
            </div>
          </div>
          <div className="flex gap-3 text-[13px] text-gray-300 mt-6">
            {tags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-4 gap-6 mb-6"
          variants={staggerChildren}
        >
          {[
            { value: scores.score, label: 'Score', topPercent: scores.topPercentages.overall, icon: scores.icons.overall },
            { value: stats.totalCommits, label: 'Commits', topPercent: scores.topPercentages.commits, icon: scores.icons.commits },
            { value: `${(stats.totalAdditions / 1000).toFixed(1)}k`, label: 'Additions', topPercent: scores.topPercentages.additions, icon: scores.icons.additions },
            { value: `${(stats.totalDeletions / 1000).toFixed(1)}k`, label: 'Deletions', topPercent: scores.topPercentages.deletions, icon: scores.icons.deletions }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={fadeInUp}
            >
              <div className="flex flex-col">
                <div className="text-3xl text-white font-semibold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                <div className="text-xs font-medium" style={{ color: i === 3 ? '#10B981' : '#EAB308' }}>
                  {stat.icon} TOP {stat.topPercent}%
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Top Contributions */}
        <motion.div 
          className="mb-6"
          variants={fadeInUp}
        >
          <div className="h-px bg-gray-800/50 mb-6" />
          <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">
            Top Contributions
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {topContributions.map((contribution, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
              >
                <Card className="bg-gray-900/30 border-gray-800/50 p-4 hover:bg-gray-900/40 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Github className="w-4 h-4 text-gray-500" />
                    <div className="text-sm">
                      <span className="text-gray-300">greptile</span>
                      <span className="text-gray-600">/</span>
                      <span className="text-gray-300">greptile</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {contribution.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="h-px bg-gray-800/50 mt-6" />
        </motion.div>

        {/* Highlights */}
        <motion.div 
          className="pb-16"
          variants={fadeInUp}
        >
          <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">
            Highlights
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-[#1C1917]/50 border-gray-800/50 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg text-white font-medium mb-2">Overview screen</h3>
                <p className="text-sm text-gray-400">
                  changes were deployed to production along with the new E2E cases.
                </p>
              </div>
              <div className="relative w-16 h-16">
                <Image
                  src="/trophy-placeholder.png"
                  alt="Trophy"
                  width={64}
                  height={64}
                  className="opacity-80"
                />
              </div>
            </Card>
            <Card className="bg-[#0C1B2A]/50 border-blue-900/50 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg text-white font-medium mb-2">
                  Wrote <span className="text-white">9,000</span> lines
                </h3>
                <p className="text-sm text-gray-400">of PHP</p>
              </div>
              <div className="relative w-16 h-16">
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
          className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800/50"
          variants={fadeInUp}
        >
          <div className="max-w-3xl mx-auto py-4 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              Powered by Greptile
              <span className="text-lg">🦎</span>
            </div>
            <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 transition-all duration-300 text-white text-sm border border-gray-700/50 shadow-lg hover:shadow-gray-900/20 flex items-center gap-2 group"
              >
                <span>Sign in to see full stats 🔥</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors text-white text-sm"
              >
                Get your own →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

