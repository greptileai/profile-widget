'use server'

import { signIn } from "@/lib/auth"

export async function githubSignIn() {
  await signIn("github")
}