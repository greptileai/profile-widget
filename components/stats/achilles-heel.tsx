'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { fadeInUp } from './animation-variants'
import { useState } from 'react'
import Image from 'next/image'

interface AchillesHeelProps {
  achillesHeel: {
    title: string
    icon: string
    description: string
    color: {
      from: string
      to: string
    }
    quickTip: string
  }
  roast: {
    title: string
    description: string
  }
}

const purpleFlameUrl = '/assets/purple-flame.gif'
const orangeFlameUrl = '/assets/orange-flame.gif'

export default function AchillesHeel({ achillesHeel, roast }: AchillesHeelProps) {
  const [isOrange, setIsOrange] = useState(true)
  const [showRoast, setShowRoast] = useState(false)

  const handleClick = () => {
    setIsOrange(!isOrange)
    setShowRoast(!showRoast)
  }

  return (
    <motion.div
      className="pb-8"
      variants={fadeInUp}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-px bg-gray-800/50 mb-6" />
      <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">
        <div>{showRoast ? "Get Roasted 🔥" : "Developer Quirk"}</div>
      </h2>

      <Card className="bg-gray-900/40 border-gray-800/50 p-4 sm:p-8 overflow-hidden relative min-h-[200px] transition-all duration-500">
        <AnimatePresence mode="wait">
          <motion.div
            key={showRoast ? 'roast' : 'achillesHeel'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <CardContent className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${achillesHeel.color.from}20, ${achillesHeel.color.to}20)`
                }}
              >
                <span className="text-3xl sm:text-4xl">
                {showRoast ? "😧" : achillesHeel.icon}

                </span>
              </motion.div>

              <div className="flex-grow">
                <motion.h3
                  className="text-lg sm:text-xl font-semibold"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    background: showRoast 
                    ? `linear-gradient(to right, #FF8307, #FF8308)` 
                    : `linear-gradient(to right, ${achillesHeel.color.from}, ${achillesHeel.color.to})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                  }}
                >
                  {showRoast ? roast.title : achillesHeel.title}
                </motion.h3>

                <motion.p
                  className={`text-sm sm:text-base text-gray-400 mt-2 ${showRoast ? 'text-xs sm:text-sm' : ''}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {showRoast ? roast.description : achillesHeel.description}
                </motion.p>
              </div>
            </CardContent>

            <motion.div
              className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 pt-4 border-t border-gray-800/30"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-sm">
                <span className="text-gray-500">{showRoast ? " " : "Quick Tip: "}</span>
                <span className="text-gray-400">{showRoast ? "" : achillesHeel.quickTip}</span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        <div>"GET ROASTED"</div>
        <Image
          className="cursor-pointer absolute bottom-6 right-6"
          src={isOrange ? orangeFlameUrl : purpleFlameUrl}
          height={30}
          width={30}
          onClick={handleClick}
          alt="flames"
        />
      </Card>
    </motion.div>
  )
}
