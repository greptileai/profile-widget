'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

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
          <img src="/assets/greptile-logo.png" alt="Greptile Logo" width={56} height={56} />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-4xl font-normal text-center mb-4 text-white"
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

        {/* Powered by Footer */}
        <Link href="https://greptile.com">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-gray-500 flex items-center gap-2"
          >
            Powered by Greptile
            <img src="/assets/greptile-logo.png" alt="Greptile Logo" width={24} height={24} />
          </motion.div>
        </Link>
      </div>
    </div>
  )
}
