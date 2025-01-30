'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, ArrowRight, Zap, PartyPopper, Code } from 'lucide-react'

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Hero Section */}
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-12 flex flex-col items-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <img src="/assets/greptile-logo.png" alt="Greptile Logo" width={80} height={80} />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-6xl font-bold text-center mb-6 text-white tracking-tight"
        >
          Github Stats 📈
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
            <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#111111] border border-gray-800 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 text-gray-300 placeholder:text-gray-600 transition-colors"
              placeholder="Enter your Github username"
            />
          </div>
          <motion.button 
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#238636] hover:bg-[#2ea043] text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-colors"
          >
            Generate Widget
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.form>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto mb-24"
        >
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#111111] border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-[#238636]/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-[#238636]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Stats</h3>
            <p className="text-gray-400">Always up-to-date Github statistics and metrics</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#111111] border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-[#238636]/10 flex items-center justify-center mb-4">
              <PartyPopper className="w-6 h-6 text-[#238636]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fun to Use</h3>
            <p className="text-gray-400">Enjoy creating and sharing your Github story with others</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#111111] border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-[#238636]/10 flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-[#238636]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Integration</h3>
            <p className="text-gray-400">Simple copy and paste into your GitHub README</p>
          </div>
        </motion.div>

        {/* Powered by Footer */}
        <Link href="https://greptile.com">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-500 hover:text-gray-400 flex items-center gap-2.5 transition-colors"
          >
            Powered by Greptile
            <img src="/assets/greptile-logo.png" alt="Greptile Logo" width={20} height={20} />
          </motion.div>
        </Link>
      </div>
    </div>
  )
}
