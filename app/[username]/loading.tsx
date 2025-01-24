import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="bg-black w-full">
      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-8">
        {/* Profile Section Skeleton */}
        <div className="mb-8 mt-16">
          <div className="relative h-[160px]">
            <div className="absolute top-2 left-0 right-0 z-20">
              {/* Avatar Skeleton */}
              <div className="relative w-24 h-24 mb-1">
                <div className="w-24 h-24 rounded-full bg-gray-800/50 animate-pulse" />
              </div>
              {/* Name Skeleton */}
              <div className="h-8 w-48 bg-gray-800/50 rounded-md animate-pulse mb-2" />
              {/* Username Skeleton */}
              <div className="h-5 w-32 bg-gray-800/50 rounded-md animate-pulse" />
            </div>
          </div>
          {/* Tags Skeleton */}
          <div className="flex gap-3 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-24 bg-gray-800/50 rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-9 w-16 bg-gray-800/50 rounded-md animate-pulse" />
              <div className="h-5 w-24 bg-gray-800/50 rounded-md animate-pulse" />
              <div className="h-4 w-20 bg-gray-800/50 rounded-md animate-pulse" />
            </div>
          ))}
        </div>

        {/* Top Contributions Skeleton */}
        <div className="mb-6">
          <div className="h-px bg-gray-800/50 mb-6" />
          <div className="h-5 w-32 bg-gray-800/50 rounded-md animate-pulse mb-3" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Card key={i} className="bg-gray-900/30 border-gray-800/50 p-4">
                <div className="flex flex-col gap-2">
                  <div className="h-5 w-48 bg-gray-800/50 rounded-md animate-pulse" />
                  <div className="h-4 w-full bg-gray-800/50 rounded-md animate-pulse" />
                </div>
              </Card>
            ))}
          </div>
          <div className="h-px bg-gray-800/50 mt-6" />
        </div>

        {/* Highlights Skeleton */}
        <div className="pb-16">
          <div className="h-5 w-24 bg-gray-800/50 rounded-md animate-pulse mb-3" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <Card key={i} className="bg-gray-900/30 border-gray-800/50 p-6">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-6 w-32 bg-gray-800/50 rounded-md animate-pulse" />
                    <div className="h-4 w-48 bg-gray-800/50 rounded-md animate-pulse" />
                  </div>
                  <div className="w-16 h-16 bg-gray-800/50 rounded-md animate-pulse" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800/50">
          <div className="max-w-3xl mx-auto py-4 px-4 flex items-center justify-between">
            <div className="h-6 w-32 bg-gray-800/50 rounded-md animate-pulse" />
            <div className="flex gap-4">
              <div className="h-10 w-40 bg-gray-800/50 rounded-lg animate-pulse" />
              <div className="h-10 w-32 bg-emerald-800/50 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
