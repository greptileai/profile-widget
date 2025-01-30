'use client'

import Image from 'next/image'
import { Copy, Star, GitCommit, Plus, Minus, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import SignIn from '@/components/sign-in'
import { motion } from 'framer-motion'
import GitHubCalendar from 'react-github-calendar'
import { GitHubStats } from '@/types/github'
import { ScoreMetrics } from '@/lib/calculate-scores'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SessionProvider } from "next-auth/react"
import { ProjectIdea } from '@/lib/actions/ai-actions'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

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

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      router.push(`/${searchUsername.trim()}`, { scroll: true });
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
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-100 pl-27">
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
          className="grid grid-cols-4 gap-6 mb-6"
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
          <div className="grid grid-cols-3 gap-3">
            {topContributions.slice(0, 6).map((contribution: any, i: any) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="h-40"
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
                      className="opacity-50"
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
          <div className="grid grid-cols-2 gap-3">
            {highlights.map((highlight: any, i: any) => (
              <Card 
                key={i}
                className={`${
                  highlight.type === 'achievement' ? 'bg-[#1C1917]/50' : 'bg-[#0C1B2A]/50'
                } border-gray-800/50 p-6 flex items-center justify-between gap-8`}
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
          <Card className="bg-gray-900/40 border-gray-800/50 p-8 overflow-hidden relative h-[200px]">
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                background: `linear-gradient(135deg, ${archetype.color.from}, ${archetype.color.to})`
              }}
            />
            
            <div className="relative flex items-start gap-6 h-full">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${archetype.color.from}20, ${archetype.color.to}20)`
                }}
              >
                <span className="text-4xl">
                  {archetype.icon}
                </span>
              </motion.div>

              <div className="flex-grow">
                <motion.h3 
                  className="text-xl font-semibold"
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
                  className="text-gray-400 mt-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {archetype.description}
                </motion.p>
              </div>
            </div>

            <motion.div 
              className="absolute bottom-8 left-8 right-8 pt-4 border-t border-gray-800/30"
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
          <Card className="bg-gray-900/40 border-gray-800/50 p-8 overflow-hidden relative h-[200px]">
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                background: `linear-gradient(135deg, ${achillesHeel.color.from}, ${achillesHeel.color.to})`
              }}
            />
            
            <div className="relative flex items-start gap-6 h-full">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${achillesHeel.color.from}20, ${achillesHeel.color.to}20)`                }}
              >
                <span className="text-4xl">
                  {achillesHeel.icon}
                </span>
              </motion.div>

              <div className="flex-grow">
                <motion.h3 
                  className="text-xl font-semibold"
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
                  className="text-gray-400 mt-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {achillesHeel.description}
                </motion.p>
              </div>
            </div>

            <motion.div 
              className="absolute bottom-8 left-8 right-8 pt-4 border-t border-gray-800/30"
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
              Curious how your GitHub activity compares to your friends? Look them up and share your results to start a friendly competition! 🚀
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
                Share your GitHub story with others
              </motion.p>
              <motion.div 
                className="flex items-center justify-center gap-4"
                variants={fadeInUp}
              >
                <div className="relative">
                  <motion.button 
                    onClick={() => {
                      navigator.clipboard.writeText(currentUrl);
                      alert('Copied to clipboard! ✨');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 text-emerald-400 hover:text-emerald-300 text-sm transition-all duration-200 group"
                  >
                    Copy your profile link
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </motion.button>
                </div>

                <motion.a
                  href={`https://twitter.com/intent/tweet?text=Check out my Github stats!&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] text-sm transition-all duration-200 group"
                >
                  Share on X
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        

        {/* Widget Dialog */}
        <Dialog open={isWidgetDialogOpen} onOpenChange={setIsWidgetDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader className="top-0 bg-gray-900 z-10 pb-4">
              <DialogTitle className="text-lg font-medium text-white">Get Your Github Widgets</DialogTitle>
            </DialogHeader>
            <div className="text-gray-400 space-y-2">
              <p className="text-sm mb-4">Add these beautiful widgets to your Github profile README or website!</p>
              
              {/* Stats Widget */}
              <div className="space-y-5">
                <Image 
                  src={`${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/stats`}
                  alt="GitHub Stats Widget Preview"
                  width={800}
                  height={200}
                  className="rounded-md object-contain mt-5"
                />
                <div className="bg-gray-800/50 p-2 rounded-md flex justify-between items-center gap-2">
                  <code className="text-xs text-emerald-400 break-all flex-grow">
                    {`![Github Stats](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/stats)`}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`![Github Stats](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/stats)`);
                      alert('Stats widget code copied to clipboard! ✨');
                    }}
                    className="p-1.5 hover:bg-gray-700/50 rounded-md transition-colors group"
                  >
                    <Copy className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                  </button>
                </div>
                <div className="h-px bg-gray-800/50 my-8" />
              </div>

              {/* Contributions Widget */}
              <div className="space-y-5">
                <Image 
                  src={`${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/contributions`}
                  alt="GitHub Contributions Widget Preview"
                  width={800}
                  height={260}
                  className="rounded-md object-contain mt-5"
                />
                <div className="bg-gray-800/50 p-2 rounded-md flex justify-between items-center gap-2">
                  <code className="text-xs text-emerald-400 break-all flex-grow">
                    {`![Github Contributions](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/contributions)`}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`![Github Contributions](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/contributions)`);
                      alert('Contributions widget code copied to clipboard! ✨');
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
                />
                <div className="bg-gray-800/50 p-2 rounded-md flex justify-between items-center gap-2">
                  <code className="text-xs text-emerald-400 break-all flex-grow">
                    {`![Github Highlights](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/highlights)`}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`![Github Highlights](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/highlights)`);
                      alert('Highlights widget code copied to clipboard! ✨');
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
                />
                <div className="bg-gray-800/50 p-2 rounded-md flex justify-between items-center gap-2">
                  <code className="text-xs text-emerald-400 break-all flex-grow">
                    {`![Developer Archetype](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/archtype)`}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`![Developer Archetype](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/archtype)`);
                      alert('Archetype widget code copied to clipboard! ✨');
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
                />
                <div className="bg-gray-800/50 p-2 rounded-md flex justify-between items-center gap-2">
                  <code className="text-xs text-emerald-400 break-all flex-grow">
                    {`![Development Quirk](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/quirk)`}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`![Development Quirk](${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/quirk)`);
                      alert('Quirk widget code copied to clipboard! ✨');
                    }}
                    className="p-1.5 hover:bg-gray-700/50 rounded-md transition-colors group"
                  >
                    <Copy className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800/50"
          variants={fadeInUp}
        >
          <div className="max-w-3xl mx-auto py-4 px-4 flex items-center justify-between">
            <Link href="https://greptile.com">
              <div className="flex items-center gap-2 text-gray-400">
                Powered by Greptile
                <img src="/assets/greptile-logo.png" alt="Greptile Logo" width={24} height={24} />
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
                Get your widget ✨
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}


