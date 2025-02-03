'use client'

import { motion } from 'framer-motion'
import { Star, GitCommit, Plus, Minus } from 'lucide-react'
import { fadeInUp, rainbowText, staggerChildren } from './animation-variants'
import { GitHubStats } from '@/types/github'
import { ScoreMetrics } from '@/lib/calculate-scores'

interface StatsGridProps {
  stats: GitHubStats
  scores: ScoreMetrics
}

export default function StatsGrid({ stats, scores }: StatsGridProps) {
  const getStatColorClass = (topPercent: number) => {
    const score = 100 - topPercent
    if (score >= 90) return 'text-emerald-500'
    if (score >= 80) return 'text-yellow-500'
    if (score >= 70) return 'text-orange-500'
    if (score >= 60) return 'text-blue-500'
    return 'text-gray-500'
  }

  const statsData = [
    { value: scores.score, label: 'Score', topPercent: scores.topPercentages.overall, icon: scores.icons.overall, lucideIcon: Star, textVariants: rainbowText },
    { value: stats.totalCommits, label: 'Commits', topPercent: scores.topPercentages.commits, icon: scores.icons.commits, lucideIcon: GitCommit },
    { value: `${(stats.totalAdditions >= 1000000 ? (stats.totalAdditions / 1000000).toFixed(1) + 'M' : (stats.totalAdditions / 1000).toFixed(1) + 'k')}`, label: 'Additions', topPercent: scores.topPercentages.additions, icon: scores.icons.additions, lucideIcon: Plus },
    { value: `${(stats.totalDeletions >= 1000000 ? (stats.totalDeletions / 1000000).toFixed(1) + 'M' : (stats.totalDeletions / 1000).toFixed(1) + 'k')}`, label: 'Deletions', topPercent: scores.topPercentages.deletions, icon: scores.icons.deletions, lucideIcon: Minus }
  ]

  return (
    <motion.div 
      className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6"
      variants={staggerChildren}
    >
      {statsData.map((stat, i) => (
        <motion.div 
          key={i}
          variants={fadeInUp}
          onClick={(e) => e.preventDefault()}
          role="presentation"
          className="cursor-default"
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
            <div className={`text-xs font-medium ${getStatColorClass(stat.topPercent)}`}>
              {stat.icon} TOP {stat.topPercent}%
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
} 