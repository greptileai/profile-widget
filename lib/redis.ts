import { Redis } from '@upstash/redis'

// Initialize Redis client
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!
})

// Cache durations in seconds
const CACHE_DURATION = {
  authenticated: 3600 * 24, // 1 day - when user is logged in with GitHub
  public: 3600 * 24 * 7    // 1 week - for non-authenticated users
} as const

interface CacheOptions {
  isAuthenticated: boolean
  username: string
}

export type CacheKey = 
  | 'ai:tags'
  | 'ai:contributions'
  | 'ai:highlights'
  | 'ai:archetype'
  | 'ai:project'
  | 'ai:weakness'
  | 'github:stats'
  | 'github:fresh'
  | 'scores'

interface BatchCacheResult {
  [key: string]: any;
  shouldRegenerate: boolean;
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

export async function batchCheckCache(username: string, isAuthenticated: boolean): Promise<BatchCacheResult> {
  const keys: CacheKey[] = [
    'github:fresh',
    'github:stats',
    'scores',
    'ai:tags',
    'ai:contributions',
    'ai:highlights',
    'ai:archetype',
    'ai:project',
    'ai:weakness'
  ]
  
  // Create array of full cache keys
  const fullKeys = keys.map(key => 
    `${key}:${username}:${isAuthenticated ? 'auth' : 'public'}`
  )
  
  // Fetch all keys in a single Redis operation
  const results = await redis.mget<any[]>(...fullKeys)
  
  const cache = keys.reduce((acc, key, index) => {
    acc[key] = results[index]
    return acc
  }, {} as Record<string, any>)

  // Only regenerate if we have no stats OR if github:fresh is null/undefined
  // This way, even if github:fresh is false, we won't regenerate if we have stats
  const shouldRegenerate = !cache['github:stats'] || cache['github:fresh'] === null

  return {
    ...cache,
    shouldRegenerate
  }
}