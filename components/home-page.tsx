'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import SignIn from '@/components/sign-in'

export default function HomePage() {
  const [username, setUsername] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username) {
      router.push(`/${username}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-12 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
            {/* Placeholder tooth/stats logo */}
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-5xl font-normal text-center mb-4 text-white"
        >
          Create Stats Widget from Github Profile
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-center text-gray-400 mb-12 text-lg"
        >
          Just enter your github username and let AI do the rest.
        </motion.p>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          onSubmit={handleSubmit} 
          className="flex items-center justify-center gap-4 w-full max-w-xl mx-auto mb-24"
        >
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#111111] border border-gray-800 focus:outline-none focus:border-gray-700 text-gray-300 placeholder:text-gray-600"
              placeholder="githubusername"
            />
          </div>
          <motion.button 
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          >
            Get your own →
          </motion.button>
        </motion.form>

        {/* Preview Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-4xl mx-auto rounded-lg border border-gray-800 bg-[#111111] p-8"
        >
          {/* Placeholder for the stats preview image */}
          <div className="aspect-[16/9] w-full bg-[#0d1117] rounded-lg"></div>
        </motion.div>

        {/* Powered by Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-gray-500 flex items-center gap-2"
        >
          Powered by Greptile
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            {/* Placeholder tooth logo */}
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
