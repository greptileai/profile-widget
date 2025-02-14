'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { fadeInUp } from './animation-variants'

export default function SearchSection() {
  const router = useRouter()
  const [searchUsername, setSearchUsername] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchUsername.trim()) {
      startTransition(() => {
        router.push(`/${searchUsername.trim()}`, { scroll: true })
      })
    }
  }

  return (
    <motion.div 
      className="pb-8"
      variants={fadeInUp}
    >
      <div className="h-px bg-gray-800/50 mb-8" />
      <div className="max-w-2xl mx-auto">
        <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-4">
          Look Up Your Friends
        </h2>
        <div className="text-gray-400 text-base mb-8 leading-relaxed">
          Curious how your Github activity compares to your friends? Look them up and share your results to start a friendly competition! 🚀
        </div>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            placeholder="Enter your friend's GitHub username..."
            className="w-full px-8 py-5 rounded-2xl bg-gray-900/30 border border-gray-800/50 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-md sm:text-lg"
          />
          <button 
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors group"
          >
            <Search className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
        </form>
      </div>
    </motion.div>
  )
} 