'use client'

import Image from 'next/image'
import { Copy } from 'lucide-react'
import { SessionProvider } from "next-auth/react"
import { Dialog, DialogContent, DialogPortal, DialogOverlay } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import PrivateStatsDialog from '@/components/private-stats-dialog'

interface WidgetDialogProps {
  username: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function WidgetDialog({ username, isOpen, onOpenChange }: WidgetDialogProps) {
  const widgets = [
    {
      name: 'Stats',
      path: 'stats',
      height: 200,
    },
    {
      name: 'Contributions',
      path: 'contributions',
      height: 260,
    },
    {
      name: 'Highlights',
      path: 'highlights',
      height: 300,
    },
    {
      name: 'Archetype',
      path: 'archtype',
      height: 200,
    },
    {
      name: 'Quirk',
      path: 'quirk',
      height: 200,
    }
  ]

  const handleCopyCode = (code: string, widgetName: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: `${widgetName} widget code copied to clipboard! ✨`,
      description: "You can now paste it into your README.md file.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <DialogContent 
          className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-900/40 border border-gray-800/50 max-w-4xl max-h-[80vh] overflow-y-auto rounded-lg"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="text-gray-400 space-y-2">
            <p className="text-m mb-4">✨ Add these beautiful widgets to your Github profile README or website!</p>
            
            {/* Regular Widgets */}
            {widgets.map((widget, index) => (
              <div key={index} className="space-y-5">
                <Image 
                  src={`${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/${widget.path}`}
                  alt={`GitHub ${widget.name} Widget Preview`}
                  width={800}
                  height={widget.height}
                  className="rounded-md object-contain mt-5"
                  unoptimized={true}
                />
                <div className="bg-gray-800/50 p-2 rounded-md flex justify-between items-center gap-2">
                  <code className="text-xs text-emerald-400 break-all flex-grow">
                    {`![Github ${widget.name}](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/${widget.path})`}
                  </code>
                  <button
                    onClick={() => handleCopyCode(
                      `![Github ${widget.name}](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/${widget.path})`,
                      widget.name
                    )}
                    className="p-1.5 hover:bg-gray-700/50 rounded-md transition-colors group"
                  >
                    <Copy className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                  </button>
                </div>
                {index < widgets.length - 1 && (
                  <div className="h-px bg-gray-800/50 my-8" />
                )}
              </div>
            ))}

            {/* Private Stats Widget */}
            <div className="h-px bg-gray-800/50 my-8" />
            <SessionProvider>
              <PrivateStatsDialog username={username} />
            </SessionProvider>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
} 