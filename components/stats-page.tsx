'use client'

import Image from 'next/image'
import { Star, GitCommit, Plus, Minus, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import SignIn from '@/components/sign-in'
import { motion } from 'framer-motion'
import GitHubCalendar from 'react-github-calendar'
import { calculateScores } from '@/lib/calculate-scores'
import { GitHubStats } from '@/types/github'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SessionProvider } from "next-auth/react"

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

const rainbowText = {
  initial: { color: '#FFFFFF' },
  animate: {
    color: ['#FFFFFF', '#FEF08A', '#86EFAC', '#93C5FD', '#F9A8D4', '#FFFFFF'],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

export default function StatsPage({ 
  stats, 
  username,
  tags,
  topContributions,
  highlights
}: { 
  stats: GitHubStats, 
  username: string,
  tags: string[],
  topContributions: any,
  highlights: any
}) {
  const router = useRouter();
  const [searchUsername, setSearchUsername] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      router.push(`/${searchUsername.trim()}`);
    }
  };

  const scores = calculateScores({
    totalCommits: stats.totalCommits,
    additions: stats.totalAdditions,
    deletions: stats.totalDeletions
  });

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
              <GitHubCalendar 
                username={username} 
                hideTotalCount={true} 
                hideColorLegend={true} 
                hideMonthLabels={true} 
                blockSize={8} 
                blockRadius={10} 
                blockMargin={10}
              />
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
            { value: scores.score, label: 'Score', topPercent: scores.topPercentages.overall, icon: scores.icons.overall, lucideIcon: Star, textVariants: rainbowText },
            { value: stats.totalCommits, label: 'Commits', topPercent: scores.topPercentages.commits, icon: scores.icons.commits, lucideIcon: GitCommit },
            { value: `${(stats.totalAdditions / 1000).toFixed(1)}k`, label: 'Additions', topPercent: scores.topPercentages.additions, icon: scores.icons.additions, lucideIcon: Plus },
            { value: `${(stats.totalDeletions / 1000).toFixed(1)}k`, label: 'Deletions', topPercent: scores.topPercentages.deletions, icon: scores.icons.deletions, lucideIcon: Minus }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={fadeInUp}
            >
              <div className="flex flex-col">
                <stat.lucideIcon className="w-8 h-8 text-gray-400 mb-2" />
                <motion.div 
                  className="text-3xl text-white font-semibold"
                  variants={stat.textVariants}
                  initial="initial"
                  animate="animate"
                >{stat.value}</motion.div>
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
          <div className="grid grid-cols-3 gap-3">
            {topContributions.slice(0, 6).map((contribution: any, i: any) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="h-40"
              >
                <Card className="bg-gray-900/30 border-gray-800/50 p-4 hover:bg-gray-900/40 transition-colors h-full flex flex-col">
                  <p className="text-gray-300 text-sm flex-grow">
                    {contribution.impact}
                  </p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-800/50">
                    <Image 
                      src="/assets/github-mark-white.png"
                      alt="GitHub"
                      width={16}
                      height={16}
                      className="opacity-50"
                    />
                    <div className="text-sm text-gray-400 truncate">
                      {contribution.repo}
                    </div>
                  </div>
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
            {highlights.map((highlight: any, i: any) => (
              <Card 
                key={i}
                className={`${
                  highlight.type === 'achievement' ? 'bg-[#1C1917]/50' : 'bg-[#0C1B2A]/50'
                } border-gray-800/50 p-6 flex items-center justify-between`}
              >
                <div>
                  <h3 className="text-lg text-white font-medium mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {highlight.description}
                  </p>
                </div>
                <div className="text-4xl">
                  {highlight.icon}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Search Friends */}
        <motion.div 
          className="pb-24"
          variants={fadeInUp}
        >
          <div className="h-px bg-gray-800/50 mb-6" />
          <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">
            Search Friends
          </h2>
          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
            <input
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Enter GitHub username..."
              className="w-full px-6 py-4 rounded-xl bg-gray-900/30 border border-gray-800/50 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent"
            />
            <button 
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </form>
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
              <SessionProvider>
                <SignIn />
              </SessionProvider>
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

