'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import GitHubCalendar from 'react-github-calendar';
import { GitHubStats } from '@/types/github';
import { GitCommit, Plus, Minus } from 'lucide-react';

interface ShareCardProps {
  stats: GitHubStats;
  username: string;
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

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export default function ShareCard({ stats, username, archetype, achillesHeel, scores }: ShareCardProps) {
  return (
    <motion.div 
      id="share-card"
      key={username}
      className="relative bg-black p-10 rounded-lg shadow-lg border border-gray-800 max-w-md mx-auto overflow-visible min-h-[480px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0">
      <div
          onWheel={(e) => {
            e.preventDefault();
          }}
        >
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
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full border-4 border-emerald-500">
          <Image
            key={stats.avatarUrl}
            src={stats.avatarUrl}
            alt={`${username}'s profile picture`}
            width={128}
            height={128}
            className="object-cover w-full h-full"
            crossOrigin="anonymous"
          />
        </div>
        <h1 className="text-3xl text-white font-bold">{stats.name}</h1>
        <p className="text-gray-400 text-lg">@{stats.login}</p>
        <div className="mt-4 flex justify-around w-full text-gray-300">
          <div className="text-center border border-gray-600 p-4 rounded-lg flex flex-col items-center">
            <GitCommit className="w-8 h-8 text-emerald-500 mb-2" />
            <p className="text-2xl font-semibold">{formatNumber(stats.totalCommits)}</p>
            <p>Commits</p>
          </div>
          <div className="text-center border border-gray-600 p-4 rounded-lg flex flex-col items-center">
            <Plus className="w-8 h-8 text-emerald-500 mb-2" />
            <p className="text-2xl font-semibold">{formatNumber(stats.totalAdditions)}</p>
            <p>Additions</p>
          </div>
          <div className="text-center border border-gray-600 p-4 rounded-lg flex flex-col items-center">
            <Minus className="w-8 h-8 text-emerald-500 mb-2" />
            <p className="text-2xl font-semibold">{formatNumber(stats.totalDeletions)}</p>
            <p>Deletions</p>
          </div>
        </div>
        <div className="mt-6 w-full">
          <div className="flex items-center">
            <div className="w-32 h-32 rounded-full border-8 border-emerald-500 flex items-center justify-center bg-black mr-6">
              <span className="text-6xl text-white">{scores.score}</span>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-gray-400 text-lg">
                Developer Archetype <br/> <span className="text-white font-bold">{archetype.icon} {archetype.title}</span>
              </p>
              <br/>
              <p className="text-gray-400 text-lg">
                Developer Quirk <br/> <span className="text-white font-bold">{achillesHeel.icon} {achillesHeel.title}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}