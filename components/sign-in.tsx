'use client'

import { githubSignIn } from "@/lib/actions/auth-actions"
 
export default function SignIn() {
  return (
    <div>
      <form action={githubSignIn}>
        <button type="submit">Sign in to see full stats 🔥</button>
      </form>
    </div>
  )
} 