'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { SessionProvider } from "next-auth/react"
import SignIn from '@/components/sign-in'
import { fadeInUp } from './animation-variants'

interface FooterProps {
  setIsWidgetDialogOpen: (open: boolean) => void
}

export default function Footer({ setIsWidgetDialogOpen }: FooterProps) {
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800/50"
      variants={fadeInUp}
    >
      <div className="max-w-3xl mx-auto py-4 px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="https://greptile.com">
          <div className="flex items-center gap-2 text-gray-400 h-8">
            Powered by 
            <div className="w-[100px] h-[100px] relative">
              <Image 
                src="/assets/greptile-logo.svg" 
                alt="Greptile Logo" 
                fill
                className="object-contain pt-1 pr-1"
              />
            </div>
          </div>
        </Link>
        <div className="flex gap-4">
          <SessionProvider>
            <SignIn />
          </SessionProvider>
          <motion.button 
            onClick={() => setIsWidgetDialogOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors text-white text-sm"
          >
            Embed your widget ✨
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
} 