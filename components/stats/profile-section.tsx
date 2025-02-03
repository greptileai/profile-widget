'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import GitHubCalendar from 'react-github-calendar'
import { fadeInUp } from './animation-variants'
import { GitHubStats } from '@/types/github'

interface ProfileSectionProps {
  stats: GitHubStats
  username: string
  tags: string[]
}

export default function ProfileSection({ stats, username, tags }: ProfileSectionProps) {
  return (
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
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-100 pl-27 hidden sm:block">
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
  )
} 