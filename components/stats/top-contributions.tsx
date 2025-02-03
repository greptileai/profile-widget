'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { fadeInUp } from './animation-variants'

interface TopContributionsProps {
  topContributions: Array<{
    impact: string
    repo: string
  }>
}

export default function TopContributions({ topContributions }: TopContributionsProps) {
  return (
    <motion.div 
      className="mb-6"
      variants={fadeInUp}
    >
      <div className="h-px bg-gray-800/50 mb-6" />
      <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">
        Top Contributions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {topContributions.slice(0, 6).map((contribution, i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            className="h-auto sm:h-40"
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
                  className="opacity-50 pb-0.5"
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
  )
} 