'use client'

import { useSession } from "next-auth/react"
import { githubSignIn } from "@/lib/actions/auth-actions"
import { signOut } from "next-auth/react"
import { motion } from "framer-motion"
import Image from "next/image"
export default function SignIn({ className }: { className?: string }) {
  const { status } = useSession()

  if (status === "authenticated") {
    return (
      <div className={className}>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = 'https://github.com/settings/connections/applications/Ov23liB2HNHJOK4SjyfH'}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 transition-all duration-300 text-white text-sm border border-gray-700/50 shadow-lg hover:shadow-gray-900/20 flex items-center gap-2 group"
        >
          Edit Permissions
          <Image src="/assets/github-mark-white.png" alt="GitHub" width={16} height={16} />
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
          <Image src="/assets/github-mark-white.png" alt="GitHub" width={16} height={16} />
        </motion.button>
      </form>
    </div>
  )
} 