'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import GitHubCalendar from 'react-github-calendar'
import { SessionProvider } from "next-auth/react"
import { Copy, Star, GitCommit, Plus, Minus, Search, Share } from 'lucide-react'
import { Card } from '@/components/ui/card'
import SignIn from '@/components/sign-in'
import PrivateStatsDialog from '@/components/private-stats-dialog'
import { Dialog, DialogContent, DialogPortal, DialogOverlay } from '@/components/ui/dialog'
import { GitHubStats } from '@/types/github'
import { ScoreMetrics } from '@/lib/calculate-scores'
import { ProjectIdea } from '@/lib/actions/ai-actions'
import { toast } from '@/hooks/use-toast'
import LoadingSkeleton from '@/components/loading-skeleton'

// TODO: Breakdown components into smaller components
// TODO: Add better imports for helper functions

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const rainbowText = {
  initial: { color: '#FFFFFF' },
  animate: {
    color: ['#FFFFFF', '#FEF08A', '#86EFAC', '#93C5FD', '#F9A8D4', '#FFFFFF'],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

export default function StatsPage({ 
  stats, 
  username,
  scores,
  tags,
  topContributions,
  highlights,
  archetype,
  nextProject,
  achillesHeel
}: { 
  stats: GitHubStats, 
  username: string,
  scores: ScoreMetrics,
  tags: string[],
  topContributions: any,
  highlights: any,
  archetype: {
    title: string;
    icon: string;
    description: string;
    color: {
      from: string;
      to: string;
    };
    powerMove: string;
  },
  nextProject: ProjectIdea,
  achillesHeel: {
    title: string;
    icon: string;
    color: {
      from: string;
      to: string;
    };
    description: string;
    quickTip: string;
  }
}) {
  const router = useRouter();
  const [searchUsername, setSearchUsername] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isWidgetDialogOpen, setIsWidgetDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      startTransition(() => {
        router.push(`/${searchUsername.trim()}`, { scroll: true });
      });
    }
  };

  const getStatColorClass = (topPercent: number) => {
    // Convert top percentage to a score (100 - topPercent)
    const score = 100 - topPercent;
    
    if (score >= 90) return 'text-emerald-500';  // 👑 Crown - best performers
    if (score >= 80) return 'text-yellow-500';   // 🏆 Trophy - excellent
    if (score >= 70) return 'text-orange-500';   // 🌟 Star - great
    if (score >= 60) return 'text-blue-500';     // 💫 Sparkle - good
    return 'text-gray-500';                      // 🎯 Target - baseline
  };

  if (isPending) {
    return (
      <div className="bg-black w-full">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-black w-full">
      {/* Removing the decorative dots pattern div */}

      <motion.div 
        className="relative z-10 max-w-3xl mx-auto px-4 pt-8"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        {/* Profile Section */}
        <motion.div 
          className="mb-8 mt-16"
          variants={fadeInUp}
        >
          <div className="relative h-[160px]">
            <div className="absolute top-2 left-0 right-0 z-20">
              <div className="relative w-24 h-24 mb-1">
                <Image
                  src={stats.avatarUrl || '/placeholder-avatar.png'}
                  alt={`${username}'s profile picture`}
                  width={96}
                  height={96}
                  className="rounded-full border-2 border-emerald-500/20"
                />
              </div>
              <h1 className="text-2xl text-white font-medium mb-0.5">
                {stats.name}
              </h1>
              <p className="text-gray-400">@{stats.login}</p>
            </div>
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-100 pl-27 hidden sm:block">
              <GitHubCalendar 
                username={username} 
                hideTotalCount={true} 
                hideColorLegend={true} 
                hideMonthLabels={true} 
                blockSize={8} 
                blockRadius={10} 
                blockMargin={10}
              />
            </div>
          </div>
          <div className="flex gap-3 text-[13px] text-gray-300 mt-6">
            {tags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6"
          variants={staggerChildren}
        >
          {[
            { value: scores.score, label: 'Score', topPercent: scores.topPercentages.overall, icon: scores.icons.overall, lucideIcon: Star, textVariants: rainbowText },
            { value: stats.totalCommits, label: 'Commits', topPercent: scores.topPercentages.commits, icon: scores.icons.commits, lucideIcon: GitCommit },
            { value: `${(stats.totalAdditions >= 1000000 ? (stats.totalAdditions / 1000000).toFixed(1) + 'M' : (stats.totalAdditions / 1000).toFixed(1) + 'k')}`, label: 'Additions', topPercent: scores.topPercentages.additions, icon: scores.icons.additions, lucideIcon: Plus },
            { value: `${(stats.totalDeletions >= 1000000 ? (stats.totalDeletions / 1000000).toFixed(1) + 'M' : (stats.totalDeletions / 1000).toFixed(1) + 'k')}`, label: 'Deletions', topPercent: scores.topPercentages.deletions, icon: scores.icons.deletions, lucideIcon: Minus }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={fadeInUp}
              onClick={(e) => e.preventDefault()}
              role="presentation"
              className="cursor-default"
            >
              <div className="flex flex-col">
                <stat.lucideIcon className="w-8 h-8 text-gray-400 mb-2" />
                <motion.div 
                  className="text-3xl text-white font-semibold"
                  variants={stat.textVariants}
                  initial="initial"
                  animate="animate"
                >{stat.value}</motion.div>
                <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                <div className={`text-xs font-medium ${getStatColorClass(stat.topPercent)}`}>
                  {stat.icon} TOP {stat.topPercent}%
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Top Contributions */}
        <motion.div 
          className="mb-6"
          variants={fadeInUp}
        >
          <div className="h-px bg-gray-800/50 mb-6" />
          <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">
            Top Contributions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {topContributions.slice(0, 6).map((contribution: any, i: any) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="h-auto sm:h-40"
              >
                <Card className="bg-gray-900/30 border-gray-800/50 p-4 hover:bg-gray-900/40 transition-colors h-full flex flex-col">
                  <p className="text-gray-300 text-sm flex-grow">
                    {contribution.impact}
                  </p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-800/50">
                    <Image 
                      src="/assets/github-mark-white.png"
                      alt="GitHub"
                      width={16}
                      height={16}
                      className="opacity-50 pb-0.5"
                    />
                    <div className="text-sm text-gray-400 truncate">
                      {contribution.repo}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="h-px bg-gray-800/50 mt-6" />
        </motion.div>

        {/* Highlights */}
        <motion.div 
          className="pb-8"
          variants={fadeInUp}
        >
          <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">
            Highlights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {highlights.map((highlight: any, i: any) => (
              <Card 
                key={i}
                className={`${
                  highlight.type === 'achievement' ? 'bg-[#1C1917]/50' : 'bg-[#0C1B2A]/50'
                } border-gray-800/50 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-8`}
              >
                <div>
                  <h3 className="text-lg text-white font-medium mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {highlight.description}
                  </p>
                </div>
                <div className="text-4xl flex-shrink-0">
                  {highlight.icon}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Developer Archetype */}
        <motion.div 
          className="pb-8"
          variants={fadeInUp}
        >
          <div className="h-px bg-gray-800/50 mb-6" />
          <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">
            Developer Archetype
          </h2>
          <Card className="bg-gray-900/40 border-gray-800/50 p-4 sm:p-8 overflow-hidden relative min-h-[200px] sm:h-[160px]">
            <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${archetype.color.from}20, ${archetype.color.to}20)`
                }}
              >
                <span className="text-3xl sm:text-4xl">
                  {archetype.icon}
                </span>
              </motion.div>

              <div className="flex-grow">
                <motion.h3 
                  className="text-lg sm:text-xl font-semibold"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    background: `linear-gradient(to right, ${archetype.color.from}, ${archetype.color.to})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {archetype.title}
                </motion.h3>
                <motion.p 
                  className="text-sm sm:text-base text-gray-400 mt-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {archetype.description}
                </motion.p>
              </div>
            </div>

            <motion.div 
              className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 pt-4 border-t border-gray-800/30"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-sm">
                <span className="text-gray-500">Power Move: </span>
                <span className="text-gray-400">{archetype.powerMove}</span>
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* Developer Quirk */}
        <motion.div 
          className="pb-8"
          variants={fadeInUp}
        >
          <div className="h-px bg-gray-800/50 mb-6" />
          <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">
            Developer Quirk
          </h2>
          <Card className="bg-gray-900/40 border-gray-800/50 p-4 sm:p-8 overflow-hidden relative min-h-[200px] sm:h-[160px]">
            <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${achillesHeel.color.from}20, ${achillesHeel.color.to}20)`
                }}
              >
                <span className="text-3xl sm:text-4xl">
                  {achillesHeel.icon}
                </span>
              </motion.div>

              <div className="flex-grow">
                <motion.h3 
                  className="text-lg sm:text-xl font-semibold"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    background: `linear-gradient(to right, ${achillesHeel.color.from}, ${achillesHeel.color.to})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {achillesHeel.title}
                </motion.h3>
                <motion.p 
                  className="text-sm sm:text-base text-gray-400 mt-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {achillesHeel.description}
                </motion.p>
              </div>
            </div>

            <motion.div 
              className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 pt-4 border-t border-gray-800/30"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-sm">
                <span className="text-gray-500">Quick Tip: </span>
                <span className="text-gray-400">{achillesHeel.quickTip}</span>
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* Next Project Idea */}
        <motion.div 
          className="pb-8"
          variants={fadeInUp}
        >
          <div className="h-px bg-gray-800/50 mb-6" />
          <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">
            Next Project Idea
          </h2>
          <Card className="bg-gray-900/40 border-gray-800/50 p-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  {nextProject.name}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                  nextProject.difficulty === 'Beginner' ? 'bg-emerald-600' :
                  nextProject.difficulty === 'Intermediate' ? 'bg-amber-600' :
                  'bg-red-600'
                }`}
                >
                  {nextProject.difficulty}
                </span>
              </div>
              
              <p className="text-gray-400">
                {nextProject.description}
              </p>

              <div className="flex gap-2">
                {nextProject.techStack.map((tech, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 rounded-md bg-gray-800/50 text-gray-300 text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Main Features:</h4>
                <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                  {nextProject.mainFeatures.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="pb-32"
          variants={fadeInUp}
        >
          <div className="h-px bg-gray-800/50 mb-8" />
          <div className="max-w-2xl mx-auto">
            <h2 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-4">
              Look Up Your Friends
            </h2>
            <div className="text-gray-400 text-base mb-8 leading-relaxed">
              Curious how your Github activity compares to your friends? Look them up and share your results to start a friendly competition! 🚀
            </div>
            <form onSubmit={handleSearch} className="relative mb-8">
              <input
                type="text"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Enter your friend's GitHub username..."
                className="w-full px-8 py-5 rounded-2xl bg-gray-900/30 border border-gray-800/50 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-lg"
              />
              <button 
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors group"
              >
                <Search className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </form>

            {/* New Share Section */}
            <motion.div 
              className="text-center border-t border-gray-800/50 pt-8"
              variants={fadeInUp}
            >
              <motion.p 
                className="text-gray-400 mb-4"
                variants={fadeInUp}
              >
                Share your Github stats with others
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                variants={fadeInUp}
              >
                <div className="relative">
                  <motion.button 
                    onClick={() => {
                      navigator.clipboard.writeText(currentUrl);
                      toast({
                        title: "Profile link copied to clipboard! ✨",
                        description: "You can now send it to your friends.",
                      });
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 text-emerald-400 hover:text-emerald-300 text-sm transition-all duration-200 group"
                  >
                    Copy your profile link
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-flex items-center">
                      <Share className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  </motion.button>
                </div>

                <motion.a
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] text-sm transition-all duration-200 group"
                >
                  Share
                  <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                    </svg>
                  </div>
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        

        {/* Widget Dialog */}
        <Dialog open={isWidgetDialogOpen} onOpenChange={setIsWidgetDialogOpen}>
          <DialogPortal>
            <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <DialogContent 
              className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-900/40 border border-gray-800/50 max-w-4xl max-h-[80vh] overflow-y-auto rounded-lg"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="text-gray-400 space-y-2">
                <p className="text-m mb-4">✨ Add these beautiful widgets to your Github profile README or website!</p>
                
                {/* Stats Widget */}
                <div className="space-y-5">
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/stats`}
                    alt="GitHub Stats Widget Preview"
                    width={800}
                    height={200}
                    className="rounded-md object-contain mt-5"
                    unoptimized={true}
                  />
                  <div className="bg-gray-800/50 p-2 rounded-md flex justify-between items-center gap-2">
                    <code className="text-xs text-emerald-400 break-all flex-grow">
                      {`![Github Stats](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/stats)`}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`![Github Stats](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/stats)`);
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

                {/* Private Stats Widget */}
                <SessionProvider>
                  <PrivateStatsDialog username={username} />
                </SessionProvider>

                {/* Contributions Widget */}
                <div className="space-y-5">
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/contributions`}
                    alt="GitHub Contributions Widget Preview"
                    width={800}
                    height={260}
                    className="rounded-md object-contain mt-5"
                    unoptimized={true}
                  />
                  <div className="bg-gray-800/50 p-2 rounded-md flex justify-between items-center gap-2">
                    <code className="text-xs text-emerald-400 break-all flex-grow">
                      {`![Github Contributions](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/contributions)`}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`![Github Contributions](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/contributions)`);
                        toast({
                          title: "Contributions widget code copied to clipboard! ✨",
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

                {/* Highlights Widget */}
                <div className="space-y-5">
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/highlights`}
                    alt="GitHub Highlights Widget Preview"
                    width={800}
                    height={300}
                    className="rounded-md object-contain mt-5"
                    unoptimized={true}
                  />
                  <div className="bg-gray-800/50 p-2 rounded-md flex justify-between items-center gap-2">
                    <code className="text-xs text-emerald-400 break-all flex-grow">
                      {`![Github Highlights](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/highlights)`}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`![Github Highlights](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/highlights)`);
                        toast({
                          title: "Highlights widget code copied to clipboard! ✨",
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

                {/* Archetype Widget */}
                <div className="space-y-5">
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/archtype`}
                    alt="Developer Archetype Widget Preview"
                    width={800}
                    height={200}
                    className="rounded-md object-contain mt-5"
                    unoptimized={true}
                  />
                  <div className="bg-gray-800/50 p-2 rounded-md flex justify-between items-center gap-2">
                    <code className="text-xs text-emerald-400 break-all flex-grow">
                      {`![Developer Archetype](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/archtype)`}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`![Developer Archetype](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/archtype)`);
                        toast({
                          title: "Archetype widget code copied to clipboard! ✨",
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

                {/* Quirk Widget */}
                <div className="space-y-5">
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/quirk`}
                    alt="Development Quirk Widget Preview"
                    width={800}
                    height={200}
                    className="rounded-md object-contain mt-5"
                    unoptimized={true}
                  />
                  <div className="bg-gray-800/50 p-2 rounded-md flex justify-between items-center gap-2">
                    <code className="text-xs text-emerald-400 break-all flex-grow">
                      {`![Development Quirk](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/quirk)`}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`![Development Quirk](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/quirk)`);
                        toast({
                          title: "Quirk widget code copied to clipboard! ✨",
                          description: "You can now paste it into your README.md file.",
                        });
                      }}
                      className="p-1.5 hover:bg-gray-700/50 rounded-md transition-colors group"
                    >
                      <Copy className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                    </button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </DialogPortal>
        </Dialog>

        {/* Footer */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800/50"
          variants={fadeInUp}
        >
          <div className="max-w-3xl mx-auto py-4 px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="https://greptile.com">
              <div className="flex items-center gap-2 text-gray-400 h-8">
                Powered by 
                <div className="w-[100px] h-[100px] relative">
                  <Image 
                    src="/assets/greptile-logo.svg" 
                    alt="Greptile Logo" 
                    fill
                    className="object-contain pt-1 pr-1"
                  />
                </div>
              </div>
            </Link>
            <div className="flex gap-4">
              <SessionProvider>
                <SignIn />
              </SessionProvider>
              <motion.button 
                onClick={() => setIsWidgetDialogOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors text-white text-sm"
              >
                Embed your widget ✨
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

