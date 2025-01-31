'use client'

import { useSession } from "next-auth/react"
import { githubSignIn } from "@/lib/actions/auth-actions"
import { Github } from "lucide-react"
import { signOut } from "next-auth/react"
import { motion } from "framer-motion"

export default function SignIn({ className }: { className?: string }) {
  const { status } = useSession()

  if (status === "authenticated") {
    return (
      <div className={className}>
        <motion.button 
          onClick={() => signOut()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 transition-all duration-300 text-white text-sm border border-gray-700/50 shadow-lg hover:shadow-gray-900/20 flex items-center gap-2 group"
        >
          Sign out
        </motion.button>
      </div>
    )
  }

  return (
    <div className={className}>
      <form action={githubSignIn}>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 transition-all duration-300 text-white text-sm border border-gray-700/50 shadow-lg hover:shadow-gray-900/20 flex items-center gap-2 group"
        >
          Sign in to see full stats 
          <Github className="w-4 h-4" />
        </motion.button>
      </form>
    </div>
  )
} 