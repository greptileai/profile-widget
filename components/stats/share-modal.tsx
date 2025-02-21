'use client'

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import { generateShareUrls } from '@/lib/utils/share-urls';
import { Download } from 'lucide-react';
import Skeleton from '@/components/ui/skeleton';

interface ShareModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
}

export default function ShareModal({ isOpen, onOpenChange, username }: ShareModalProps) {
  const [shareUrls, setShareUrls] = useState({ twitter: '', linkedin: '', reddit: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setShareUrls(generateShareUrls(username));
  }, [username]);

  const handleDownload = async () => {
    try {
      const imageUrl = `${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/share/combined?format=png`;
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to download image');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${username}-github-stats.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
      // TODO: Show error message to user via toast/alert
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-900/40 border border-gray-800/50 max-w-4xl p-4 rounded-lg">
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
          
          {/* Share Buttons */}
          <div className="flex gap-4 mb-6">
            <a 
              href={shareUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] text-sm transition-all duration-200"
            >
              Share on X
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            
            <a 
              href={shareUrls.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] text-sm transition-all duration-200"
            >
              Share on LinkedIn
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            
            <a 
              href={shareUrls.reddit}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF4500]/10 hover:bg-[#FF4500]/20 text-[#FF4500] text-sm transition-all duration-200"
            >
              Share on Reddit
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.61a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
            </a>
          </div>

          {/* Combined Preview Image */}
          <div className="space-y-2">
            {isLoading && <Skeleton />}
            <img
              src={`${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/share/combined`}
              alt="GitHub Stats Combined Preview"
              className="rounded-md object-contain w-full"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setErrorMessage('Failed to load image.');
              }}
              style={{ display: isLoading ? 'none' : 'block' }}
            />
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
