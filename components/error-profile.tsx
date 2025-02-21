'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import LoadingSkeleton from '@/components/loading-skeleton'

interface ErrorProfileProps {
  username: string;
}

export default function ErrorProfile({ username }: ErrorProfileProps) {
  const [inputUsername, setInputUsername] = useState(username)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputUsername) {
      startTransition(() => {
        router.push(`/${inputUsername}`)
      })
    }
  }

  if (isPending) {
    return (
      <div className="bg-black w-full">
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl sm:text-6xl font-bold text-center mb-6 text-white tracking-tight"
      >
        Profile Not Found
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        className="text-center text-gray-400 mb-12 text-lg sm:text-xl max-w-2xl"
      >
        The username you entered does not exist. Please try again.
      </motion.p>
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        onSubmit={handleSubmit} 
        className="flex items-center justify-center gap-4 w-full max-w-xl mx-auto mb-16"
      >
        <div className="relative flex-1">
          <div className="relative">
            <Image 
              src="/assets/github-mark-white.png"
              alt="GitHub"
              width={20}
              height={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50"
            />
            <input
              type="text"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#111111] border border-gray-800 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 text-gray-300 placeholder:text-gray-600 transition-colors"
              placeholder="Enter your Github username"
            />
          </div>
        </div>
        <motion.button 
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-colors"
        >
          Try Again
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.form>
    </div>
  )
} 