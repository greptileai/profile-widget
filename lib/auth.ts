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
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.login = profile?.login
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken as string
      session.login = token.login
      // Invalidate cache when session is created/refreshed
      if (session.login) {
        await invalidateCache({
          username: session.login,
          isAuthenticated: true
        })
      }
      return session
    }
  }
})