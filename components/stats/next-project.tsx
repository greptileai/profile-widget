'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { fadeInUp } from './animation-variants'
import { ProjectIdea } from '@/lib/actions/ai-actions'

interface NextProjectProps {
  nextProject: ProjectIdea
}

export default function NextProject({ nextProject }: NextProjectProps) {
  return (
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
  )
} 