"use server"

import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from 'zod'
import { getCachedData, setCachedData } from '../redis'

interface Contribution {
  repo: string;
  description: string;
  impact: string;
}

interface Highlight {
  title: string;
  description: string;
  type: 'achievement' | 'impact';
  icon: string;
}

const ContributionSchema = z.object({
  repo: z.string(),
  description: z.string(),
  impact: z.string()
});

async function shouldRegenerateAI(username: string, isAuthenticated: boolean): Promise<boolean> {
  const isFresh = await getCachedData<boolean>('github:fresh', { username, isAuthenticated })
  return !isFresh // Only regenerate if NOT fresh
}

export async function generateTags(
  bio: string, 
  repositories: any,
  username: string,
  isAuthenticated: boolean,
  shouldRegenerate: boolean = false
): Promise<string[]> {
  if (!shouldRegenerate) {
    const cached = await getCachedData<string[]>('ai:tags', { username, isAuthenticated })
    if (cached) return cached
  }
  
  const prompt = `Based on this GitHub profile:
    Bio: ${bio}
    Top Repositories:
    ${repositories.map((repo: any) => `- ${repo.name}: ${repo.description}`).join('\n')}

    Generate exactly 3 short, emoji-prefixed tags that best describe this developer's expertise and interests. 
    Format each tag like "emoji Technology/Skill". Example format: "⚛️ React Expert"
    Keep each tag under 20 characters. Make sure to not have - in the tag.`

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt
  })

  const results = text.split('\n')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .slice(0, 3)

  await setCachedData('ai:tags', results, { username, isAuthenticated })
  return results
}

export async function generateTopContributions(
  repositories: any,
  username: string,
  isAuthenticated: boolean,
  shouldRegenerate: boolean = false
): Promise<Contribution[]> {
  if (!shouldRegenerate) {
    const cached = await getCachedData<Contribution[]>('ai:contributions', { username, isAuthenticated })
    if (cached) return cached
  }

  const prompt = `Analyze these GitHub repositories and their commit history:
    ${repositories.map((repo: any) => `
    Repository: ${repo.name}
    Description: ${repo.description}
    Commits: ${repo.commits}
    Stars: ${repo.stars}
    Primary Language: ${repo.primaryLanguage}
    Recent commits: ${repo.recentCommits?.map((commit: any) => 
      `- ${commit.message} (${commit.additions} additions, ${commit.deletions} deletions)`
    ).join('\n')}`).join('\n')}

    Generate 6 significant contributions that highlight the developer's best work. For each contribution:
    Summarize the impact in one clear sentence. When describing impact focus on the actions, improvements, and impact rather than referencing "the developer". Add a relevant emoji to the impact.
    - For example 'Implemented auth and cured bugs that no one else could see' like be creative.
    Focus on the most meaningful changes. Keep the impact under 130 characters.`

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      contributions: z.array(ContributionSchema)
    }),
    prompt
  });
  
  const results = object.contributions.map((contribution: any) => {
    const repo = repositories.find((r: any) => r.name === contribution.repo);
    return {
      ...contribution,
      languages: repo?.languages || []
    };
  });

  await setCachedData('ai:contributions', results, { username, isAuthenticated })
  return results
}

const HighlightSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.enum(['achievement', 'impact']),
  icon: z.string()
});

export async function generateHighlights(
  stats: any, 
  repositories: any,
  username: string,
  isAuthenticated: boolean,
  shouldRegenerate: boolean = false
): Promise<Highlight[]> {
  if (!shouldRegenerate) {
    const cached = await getCachedData<Highlight[]>('ai:highlights', { username, isAuthenticated })
    if (cached) return cached
  }

  const prompt = `Based on these GitHub statistics, repositories, and commit history:
    - Total Commits: ${stats.totalCommits}
    - Lines Added: ${stats.totalAdditions}
    - Lines Deleted: ${stats.totalDeletions}
    - Top Languages: ${repositories.flatMap((repo: any) => 
        repo.languages?.map((lang: any) => lang.name)
      ).filter(Boolean).join(', ')}
    - Most Starred Repo: ${repositories[0]?.stars || 0} stars
      ${repositories.map((repo: any) => `
      Repository: ${repo.name}
      Description: ${repo.description}
      Commits: ${repo.commits}
      Stars: ${repo.stars}
      Primary Language: ${repo.primaryLanguage}
      Recent commits: ${repo.recentCommits?.map((commit: any) => 
        `- ${commit.message} (${commit.additions} additions, ${commit.deletions} deletions)`
      ).join('\n')}
      Languages: ${repo.languages?.map((lang: any) => lang.name).join(', ')}
      `).join('\n')}

    Generate 2 significant highlights that showcase the developer's achievements.
    - Focus on the high level highlight of the developer hollistically and make them very unique and fun. Do not mention explicit numbers, focus on a qualitative description. More concise and less wordy (under 200 characters).`

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      highlights: z.array(HighlightSchema)
    }),
    prompt
  });

  const results = object.highlights
  await setCachedData('ai:highlights', results, { username, isAuthenticated })
  return results
}

const ARCHETYPES = {
  wizard: {
    title: 'Code Wizard',
    icon: '🧙‍♂️',
    color: { from: '#4F46E5', to: '#9333EA' }
  },
  architect: {
    title: 'System Architect',
    icon: '🏛️',
    color: { from: '#0EA5E9', to: '#2DD4BF' }
  },
  explorer: {
    title: 'Tech Explorer',
    icon: '🗺️',
    color: { from: '#F59E0B', to: '#EF4444' }
  },
  guardian: {
    title: 'Code Guardian',
    icon: '🛡️',
    color: { from: '#10B981', to: '#059669' }
  },
  innovator: {
    title: 'Tech Innovator',
    icon: '💡',
    color: { from: '#8B5CF6', to: '#EC4899' }
  },
  mentor: {
    title: 'Code Mentor',
    icon: '🎓',
    color: { from: '#F97316', to: '#DC2626' }
  }
} as const;

const ArchetypeSchema = z.object({
  type: z.enum(['wizard', 'architect', 'explorer', 'guardian', 'innovator', 'mentor']),
  description: z.string(),
  powerMove: z.string()
});

export async function generateProgrammerArchtype(
  stats: any, 
  repositories: any,
  username: string,
  isAuthenticated: boolean,
  shouldRegenerate: boolean = false
): Promise<typeof ARCHETYPES[keyof typeof ARCHETYPES] & { description: string, powerMove: string }> {
  if (!shouldRegenerate) {
    const cached = await getCachedData('ai:archetype', { username, isAuthenticated })
    if (cached) return cached as any
  }

  const prompt = `Based on these GitHub statistics and repositories:
    - Total Commits: ${stats.totalCommits}
    - Lines Added: ${stats.totalAdditions}
    - Lines Deleted: ${stats.totalDeletions}
    - Languages Used: ${repositories.flatMap((repo: any) => 
        repo.languages?.map((lang: any) => lang.name)
      ).filter(Boolean).join(', ')}
    - Most Starred Repo: ${repositories[0]?.stars || 0} stars
    ${repositories.map((repo: any) => `
    Repository: ${repo.name}
    Description: ${repo.description}
    Primary Language: ${repo.primaryLanguage}
    `).join('\n')}

    Analyze their coding style and select the most fitting archetype:
    - wizard: Masters of complex code and elegant solutions
    - architect: Designers of scalable systems and infrastructure
    - explorer: Experimenters with diverse technologies
    - guardian: Focused on security and code quality
    - innovator: Creates novel solutions and pushes boundaries
    - mentor: Contributes to open source and helps others
    
    Generate:
    1. The most fitting archetype type from the list above
    2. A witty one-line description (under 100 chars) that's specific to their tech stack and coding patterns
    3. A power move tip (under 70 chars) that leverages their archetype's strengths`  

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: ArchetypeSchema,
    prompt
  });

  const results = {
    ...ARCHETYPES[object.type],
    description: object.description,
    powerMove: object.powerMove
  }

  await setCachedData('ai:archetype', results, { username, isAuthenticated })
  return results
}

const ProjectIdeaSchema = z.object({
  name: z.string(),
  techStack: z.array(z.string()),
  description: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  mainFeatures: z.array(z.string()).min(2).max(4)
});

export async function generateNextProject(
  stats: any, 
  repositories: any,
  username: string,
  isAuthenticated: boolean,
  shouldRegenerate: boolean = false
): Promise<z.infer<typeof ProjectIdeaSchema>> {
  if (!shouldRegenerate) {
    const cached = await getCachedData<z.infer<typeof ProjectIdeaSchema>>('ai:project', { username, isAuthenticated })
    if (cached) return cached
  }

  const prompt = `Based on these GitHub statistics and tech stack:
    - Languages: ${repositories.flatMap((repo: any) => 
        repo.languages?.map((lang: any) => lang.name)
      ).filter(Boolean).join(', ')}
    - Most Used Language: ${repositories[0]?.primaryLanguage}
    - Current Projects: ${repositories.map((repo: any) => 
      `${repo.name} (${repo.description})`
    ).join(', ')}

    Generate a creative and achievable project idea that builds upon their skills.
    The project should be:
    1. Realistic to complete in 2-4 weeks
    2. Have a fun or unique angle
    3. Solve a real developer pain point
    4. Use their existing tech stack
    
    Format requirements:
    - Project name should be catchy and memorable
    - Tech stack should list 2-4 main technologies
    - Description should be clear and concise (max 100 chars)
    - Main features should be specific and achievable
    - Difficulty should reflect the complexity and required expertise`

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    temperature: 0.8,
    schema: z.object({
      project: ProjectIdeaSchema
    }),
    prompt
  });

  const results = object.project
  await setCachedData('ai:project', results, { username, isAuthenticated })
  return results
}

// Add type export for use in components
export type ProjectIdea = z.infer<typeof ProjectIdeaSchema>;

const WEAKNESSES = {
  perfectionist: {
    title: 'The Perfectionist',
    icon: '🎯',
    color: { from: '#4F46E5', to: '#9333EA' }
  },
  speedster: {
    title: 'The Speedster',
    icon: '⚡',
    color: { from: '#0EA5E9', to: '#2DD4BF' }
  },
  soloist: {
    title: 'The Soloist',
    icon: '🎸',
    color: { from: '#F59E0B', to: '#EF4444' }
  },
  minimalist: {
    title: 'The Minimalist',
    icon: '🎈',
    color: { from: '#10B981', to: '#059669' }
  },
  dreamer: {
    title: 'The Dreamer',
    icon: '🌠',
    color: { from: '#8B5CF6', to: '#EC4899' }
  }
} as const;

const WeaknessSchema = z.object({
  type: z.enum(['perfectionist', 'speedster', 'soloist', 'minimalist', 'dreamer']),
  description: z.string(),
  quickTip: z.string()
});

export async function generateAchillesHeel(
  stats: any, 
  repositories: any,
  username: string,
  isAuthenticated: boolean,
  shouldRegenerate: boolean = false
): Promise<typeof WEAKNESSES[keyof typeof WEAKNESSES] & { description: string, quickTip: string }> {
  if (!shouldRegenerate) {
    const cached = await getCachedData('ai:weakness', { username, isAuthenticated })
    if (cached) return cached as any
  }
  
  const prompt = `Based on these GitHub statistics and repositories:
    - Total Commits: ${stats.totalCommits}
    - Lines Added: ${stats.totalAdditions}
    - Lines Deleted: ${stats.totalDeletions}
    - Languages Used: ${repositories.flatMap((repo: any) => 
        repo.languages?.map((lang: any) => lang.name)
      ).filter(Boolean).join(', ')}
    ${repositories.map((repo: any) => `
    Repository: ${repo.name}
    Description: ${repo.description}
    Primary Language: ${repo.primaryLanguage}
    Recent commits: ${repo.recentCommits?.map((commit: any) => 
      `- ${commit.message}`
    ).join('\n')}
    `).join('\n')}

    Analyze their coding style and select their development quirk:
    - perfectionist: Over-engineers solutions and gets stuck in details
    - speedster: Moves fast but might skip testing or documentation
    - soloist: Prefers working alone, could improve collaboration
    - minimalist: Keeps code too simple, might miss robust solutions
    - dreamer: Starts many projects but struggles to finish them
    
    Generate:
    1. The most fitting quirk type from the list above
    2. A witty one-line description (under 100 chars) about their quirk
    3. A short, actionable quick-tip to improve (under 50 chars)`

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: WeaknessSchema,
    prompt
  });

  const results = {
    ...WEAKNESSES[object.type],
    description: object.description,
    quickTip: object.quickTip
  }

  await setCachedData('ai:weakness', results, { username, isAuthenticated })
  return results
}

// Update type export for use in components
export type AchillesHeel = ReturnType<typeof generateAchillesHeel>; 


