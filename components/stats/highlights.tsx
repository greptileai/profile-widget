'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { fadeInUp } from './animation-variants'

interface HighlightsProps {
  highlights: Array<{
    type: string
    title: string
    description: string
    icon: string
  }>
}

export default function Highlights({ highlights }: HighlightsProps) {
  return (
    <motion.div 
      className="pb-8"
      variants={fadeInUp}
    >
      <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">
        Highlights
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {highlights.map((highlight, i) => (
          <Card 
            key={i}
            className={`${
              highlight.type === 'achievement' ? 'bg-[#1C1917]/50' : 'bg-[#0C1B2A]/50'
            } border-gray-800/50 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-8`}
          >
            <div>
              <h3 className="text-lg text-white font-medium mb-2">
                {highlight.title}
              </h3>
              <p className="text-sm text-gray-400">
                {highlight.description}
              </p>
            </div>
            <div className="text-4xl flex-shrink-0">
              {highlight.icon}
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
} 