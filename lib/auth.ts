import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { invalidateCache } from '@/lib/redis'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'read:user repo user:email read:org'
        }
      }
    })
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user }: any) {
      session.accessToken = token.accessToken as string
      
      // Invalidate cache when session is created/refreshed
      if (user?.login) {
        await invalidateCache({
          username: user.login,
          isAuthenticated: true
        })
      }
      
      return session
    }
  }
})