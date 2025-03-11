'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import LoadingSkeleton from '@/components/loading-skeleton'
import ErrorProfile from '@/components/error-profile'


export default function HomePage() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const extractUser = (user :string) =>{
    const urlPattern = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w-]+)(?:\/.*)?$/i;
    if (urlPattern.test(user)){
      const matches = user.match(urlPattern)
      return matches?.[1] || ''}
    else {
      return user
    }
    }
    
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username) {
      const usernamePattern = /^(?!-)(?!.*[^a-z\d-])(?!.*--)[a-z\d-]{1,39}(?<!-)$/i;
      const extractedUser = extractUser(username);
      if (!usernamePattern.test(extractedUser)) {
        setError("Invalid username format. Please enter a valid GitHub username.");
        return; 
      }

      startTransition(() => {
        router.push(`/${extractedUser}`)
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
      {/* Hero Section */}
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-6xl font-bold text-center mb-6 text-white tracking-tight"
        >
          Stats for Git 📈
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-center text-gray-400 mb-12 text-lg sm:text-xl max-w-2xl"
        >
          Generate beautiful customized stat widgets for your Github profile in seconds. 
          Show off your achievements and contributions with style.
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 sm:py-3.5 rounded-xl bg-[#111111] border border-gray-800 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 text-gray-300 placeholder:text-gray-600 transition-colors"
                placeholder="Enter your Github username"
              />
              {error && (
              <p className="text-red-500 text-sm absolute mt-4">{error}</p>
            )}
            </div>
          </div>
          <motion.button 
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-colors"
          >
            Generate Widget
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.form>


        {/* Powered by Footer */}
        <Link href="https://greptile.com">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-500 flex items-center gap-2.5 transition-colors pl-12"
          >
            <span>Powered by</span>
            <Image src="/assets/greptile-logo.svg" alt="Greptile Logo" width={120} height={120} />
          </motion.div>
        </Link>
      </div>
    </div>
  )
}
