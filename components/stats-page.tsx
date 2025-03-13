'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GitHubStats } from '@/types/github'
import { ScoreMetrics } from '@/lib/calculate-scores'
import { ProjectIdea } from '@/lib/actions/ai-actions'
import LoadingSkeleton from '@/components/loading-skeleton'

// Import all the new components
import ProfileSection from './stats/profile-section'
import StatsGrid from './stats/stats-grid'
import TopContributions from './stats/top-contributions'
import Highlights from './stats/highlights'
import ArchetypeCard from './stats/archetype-card'
import AchillesHeel from './stats/achilles-heel'
import NextProject from './stats/next-project'
import SearchSection from './stats/search-section'
import ShareSection from './stats/share-section'
import Footer from './stats/footer'
import WidgetDialog from './stats/widget-dialog'

interface StatsPageProps {
  stats: GitHubStats
  username: string
  scores: ScoreMetrics
  tags: string[]
  topContributions: any
  highlights: any
  archetype: {
    title: string
    icon: string
    description: string
    color: {
      from: string
      to: string
    }
    powerMove: string
  }
  nextProject: ProjectIdea
  achillesHeel: {
    title: string
    icon: string
    color: {
      from: string
      to: string
    }
    description: string
    quickTip: string
  }
  roast: {
    title: string
    description: string
  }
}

export default function StatsPage({ 
  stats, 
  username,
  scores,
  tags,
  topContributions,
  highlights,
  archetype,
  nextProject,
  achillesHeel,
  roast
}: StatsPageProps) {
  const [isWidgetDialogOpen, setIsWidgetDialogOpen] = useState(false)

  return (
    <div className="bg-black w-full">
      <motion.div 
        className="relative z-10 max-w-3xl mx-auto px-4 pt-8 pb-32 sm:pb-28"
        initial="initial"
        animate="animate"
        variants={{
          animate: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <ProfileSection 
          stats={stats}
          username={username}
          tags={tags}
        />

        <StatsGrid 
          stats={stats}
          scores={scores}
        />

        <TopContributions 
          topContributions={topContributions}
        />

        <Highlights 
          highlights={highlights}
        />

        <ArchetypeCard 
          archetype={archetype}
        />

        <AchillesHeel 
          achillesHeel={achillesHeel} 
          roast={roast}
          stats={stats}
        />

        <NextProject 
          nextProject={nextProject}
        />

        <SearchSection />

        <ShareSection />

        <Footer 
          setIsWidgetDialogOpen={setIsWidgetDialogOpen}
        />

        <WidgetDialog 
          username={username}
          isOpen={isWidgetDialogOpen}
          onOpenChange={setIsWidgetDialogOpen}
        />
      </motion.div>
    </div>
  )
}

