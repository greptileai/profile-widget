'use client'

import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import { Download } from 'lucide-react';
import Skeleton from '@/components/ui/skeleton';
import ShareCard from './share-card';
import { GitHubStats } from '@/types/github';
import { toPng } from 'html-to-image';

interface ShareModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  stats: GitHubStats;
  archetype: {
    title: string;
    icon: string;
    description: string;
    color: {
      from: string;
      to: string;
    };
    powerMove: string;
  };
  achillesHeel: {
    title: string;
    icon: string;
    color: {
      from: string;
      to: string;
    };
    description: string;
    quickTip: string;
  };
  scores: {
    score: number;
    topPercentages: {
      overall: number;
      commits: number;
      additions: number;
      deletions: number;
    };
    icons: {
      overall: string;
      commits: string;
      additions: string;
      deletions: string;
    };
  };
}

export default function ShareModal({ isOpen, onOpenChange, username, stats, archetype, achillesHeel, scores }: ShareModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(false);
  }, [username]);

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${username}-share-card.png`;
        link.click();
        
        // setShareUrls(generateShareUrls(username, dataUrl));
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-900/40 border border-gray-800/50 max-w-md p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg text-white">Share Your Stats</h2>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-sm transition-all duration-200"
            >
              Download
              <Download className="w-4 h-4" />
            </button>
          </div>


          {/* Combined Preview Image */}
          <div className="mt-4 bg-gray-900" ref={cardRef}>
            {isLoading && <Skeleton />}
            <ShareCard 
              key={username}
              stats={stats} 
              username={username} 
              archetype={archetype}
              achillesHeel={achillesHeel}
              scores={scores}
            />
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
