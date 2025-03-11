'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { fadeInUp } from './animation-variants'
import { useState } from 'react'
import Image from 'next/image'
import { GitHubStats } from '@/types/github'
import burningElmo from '../../app/images/burning-elmo.png'
import cryingPepe from '../../app/images/crying-pepe.png'
import OrangeFlame from '../../app/images/gifs/orange-flame.gif'
import PurpleFlame from '../../app/images/gifs/purple-flame.gif'


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
  stats: GitHubStats
  

}

interface RoastModalProps {
  roast: {
    title: string
    description: string
  }
  username: string
  avatar: string

  onClose: () => void
}

const RoastModal = ({ roast, username, avatar, onClose }: RoastModalProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg"
        >
          <div className="bg-black rounded-xl p-4 sm:p-6 border border-[#198879]">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-4 sm:mb-6"
            >
              <span className='text-xl sm:text-3xl font-extrabold text-[#198879]'>GIT ROASTED</span>
            </motion.div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-4 sm:mb-6"
            >
              <Image src={cryingPepe} alt="roasted" width={40} height={40} className="w-32"/>
              <Image src={avatar} alt="avatar" width={40} height={40} className="rounded-full w-24"/>
              <Image src={burningElmo} alt="roasted" width={40} height={40} className="w-32"/>
            </motion.div>
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl font-semibold px-4 text-center mb-3 sm:mb-4 text-white pb-2 border-b border-gray-400"
            >
              {roast.title}
            </motion.h3>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-white text-sm sm:text-base leading-relaxed mb-2 sm:mb-6"
            >
              {roast.description}
            </motion.p>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-400"
            >
              <div className='text-center text-white text-xs sm:text-sm leading-relaxed'>@{username}</div>
              <div className='flex items-center gap-2'>
                <span className="text-center text-[#198879] text-xs sm:text-sm sm:text-base leading-relaxed">get yours @ statsforgit.com</span>
                <Image src="/assets/greptile-logo.png" alt="Greptile Logo" width={10} height={10} />
              </div>
              <button 
                onClick={onClose}
                className="text-white text-xs sm:text-sm px-3 py-1 rounded-md hover:bg-[#198879]/10"
              >
                Close
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function AchillesHeel({ achillesHeel, roast, stats }: AchillesHeelProps) {
  const [isOrange, setIsOrange] = useState(true)
  const [showRoast, setShowRoast] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

      <Card className="bg-gray-900/40 border-gray-800/50 p-0 overflow-hidden relative min-h-[200px] transition-all duration-500">
        <AnimatePresence mode="wait">
          <motion.div
            key={showRoast ? 'roast' : 'achillesHeel'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <CardContent className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-8">
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

              <div className="flex-grow space-y-2">
                <motion.h3
                  className="text-lg sm:text-xl font-semibold"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    background:  
                    `linear-gradient(to right, ${achillesHeel.color.from}, ${achillesHeel.color.to})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {showRoast ? roast.title : achillesHeel.title}
                </motion.h3>

                <motion.p
                  className={`${showRoast ? 'text-sm' : 'text-sm sm:text-base'} text-gray-400`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {showRoast ? roast.description : achillesHeel.description}
                </motion.p>
              </div>
            </CardContent>

            <motion.div
              className="px-4 sm:px-6 py-3 border-t border-gray-800/30 flex justify-between items-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-sm max-w-[60%]">
                <span className="text-gray-500">{showRoast ? "" : "Quick Tip: "}</span>
                <span className="text-gray-400">
                  {showRoast ? (
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      Share
                    </button>
                  ) : (
                    achillesHeel.quickTip
                  )}
                </span>
              </div>
              
              <button 
                onClick={handleClick} 
                className="flex items-center gap-x-2 hover:opacity-80 transition-opacity duration-200"
              >
                <div className="text-sm text-gray-400 font-medium">{isOrange ? "Get roasted" : "Go back"}</div>
                <Image
                  className="cursor-pointer w-6 h-6 sm:w-7 sm:h-7"
                  src={isOrange ? OrangeFlame : PurpleFlame}
                  height={30}
                  width={30}
                  alt="flames"
                />
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        {isModalOpen && <RoastModal roast={roast} username={stats.name} avatar={stats.avatarUrl} onClose={() => setIsModalOpen(false)} />}
      </Card>
    </motion.div>
  )
}
