'use client'

import Image from "next/image"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { Copy } from "lucide-react"

export default function PrivateStatsDialog({ username }: { username: string }) {
  
  const { status, data: session } = useSession() as any
  const { toast } = useToast()
 
  if (status === "authenticated" && session?.login  === username) {
    return (
      <div className="space-y-5">
        <Image 
          src={`${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/private-stats`}
          alt="GitHub Stats Widget Preview"
          width={800}
          height={200}
          className="rounded-md object-contain mt-5"
          unoptimized={true}
        />
        <div className="bg-gray-800/50 p-2 rounded-md flex justify-between items-center gap-2">
          <code className="text-xs text-emerald-400 break-all flex-grow">
            {`![Github Stats](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/private-stats)`}
          </code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `![Github Stats](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/private-stats)`
              );
              toast({
                title: "Stats widget code copied to clipboard! ✨",
                description: "You can now paste it into your README.md file.",
              });
            }}
            className="p-1.5 hover:bg-gray-700/50 rounded-md transition-colors group"
          >
            <Copy className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
          </button>
        </div>
        <div className="h-px bg-gray-800/50 my-8" />
      </div>
    )
  }

  return null
} 