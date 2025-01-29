import { Redis } from '@upstash/redis'

// Initialize Redis client
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!
})

// Cache durations in seconds
const CACHE_DURATION = {
  authenticated: 1800,   // 30 minutes - when user is logged in with GitHub
  public: 3600          // 1 hour - for non-authenticated users
} as const

interface CacheOptions {
  isAuthenticated: boolean
  username: string
}

export async function getCachedData<T>(key: string, { isAuthenticated, username }: CacheOptions): Promise<T | null> {
  const cacheKey = `${key}:${username}:${isAuthenticated ? 'auth' : 'public'}`
  return redis.get<T>(cacheKey)
}

export async function setCachedData<T>(
  key: string, 
  data: T, 
  { isAuthenticated, username }: CacheOptions
): Promise<void> {
  const cacheKey = `${key}:${username}:${isAuthenticated ? 'auth' : 'public'}`
  const duration = isAuthenticated ? CACHE_DURATION.authenticated : CACHE_DURATION.public
  
  await redis.set(cacheKey, data, { ex: duration })
}

export async function invalidateCache({ username, isAuthenticated }: CacheOptions): Promise<void> {
  const pattern = `*:${username}:${isAuthenticated ? 'auth' : 'public'}`
  const keys = await redis.keys(pattern)
  if (keys.length) {
    await redis.del(keys[0]) // Pass single key instead of array
  }
}