'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { fadeInUp } from './animation-variants'

interface ArchetypeCardProps {
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
}

export default function ArchetypeCard({ archetype }: ArchetypeCardProps) {
  return (
    <motion.div 
      className="pb-8"
      variants={fadeInUp}
    >
      <div className="h-px bg-gray-800/50 mb-6" />
      <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">
        Developer Archetype
      </h2>
      <Card className="bg-gray-900/40 border-gray-800/50 p-4 sm:p-8 overflow-hidden relative min-h-[200px] sm:h-[160px]">
        <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${archetype.color.from}20, ${archetype.color.to}20)`
            }}
          >
            <span className="text-3xl sm:text-4xl">
              {archetype.icon}
            </span>
          </motion.div>

          <div className="flex-grow">
            <motion.h3 
              className="text-lg sm:text-xl font-semibold"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                background: `linear-gradient(to right, ${archetype.color.from}, ${archetype.color.to})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {archetype.title}
            </motion.h3>
            <motion.p 
              className="text-sm sm:text-base text-gray-400 mt-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {archetype.description}
            </motion.p>
          </div>
        </div>

        <motion.div 
          className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 pt-4 border-t border-gray-800/30"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-sm">
            <span className="text-gray-500">Power Move: </span>
            <span className="text-gray-400">{archetype.powerMove}</span>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  )
} 