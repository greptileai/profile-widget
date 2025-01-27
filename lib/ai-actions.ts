"use server"

import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from 'zod'

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

export async function generateTags(bio: string, repositories: Array<{ description: string, name: string }>): Promise<string[]> {
  const prompt = `Based on this GitHub profile:
    Bio: ${bio}
    Top Repositories:
    ${repositories.map(repo => `- ${repo.name}: ${repo.description}`).join('\n')}

    Generate exactly 3 short, emoji-prefixed tags that best describe this developer's expertise and interests. 
    Format each tag like "emoji Technology/Skill". Example format: "⚛️ React Expert"
    Keep each tag under 20 characters.`

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: prompt
  })

  return text.split('\n')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .slice(0, 3)
}

export async function generateTopContributions(
  repositories: Array<{
    name: string;
    description: string;
    commits: number;
    stars: number;
    primaryLanguage: string | null;
    languages: Array<{ name: string; color: string }>;
    recentCommits: Array<{
      message: string;
      date: string;
      additions: number;
      deletions: number;
    }>;
  }>
): Promise<Contribution[]> {
  const prompt = `Analyze these GitHub repositories and their commit history:
    ${repositories.map(repo => `
    Repository: ${repo.name}
    Description: ${repo.description}
    Commits: ${repo.commits}
    Stars: ${repo.stars}
    Primary Language: ${repo.primaryLanguage}
    Recent commits: ${repo.recentCommits?.map(commit => 
      `- ${commit.message} (${commit.additions} additions, ${commit.deletions} deletions)`
    ).join('\n')}`).join('\n')}

    Generate 6 significant contributions that highlight the developer's best work. For each contribution:
    Summarize the impact in one clear sentence. When describing impact focus on the actions, improvements, and impact rather than referencing "the developer". Add a relevant emoji to the impact.
    - For example 'Implemented auth and cured bugs that no one else could see' like be creative.
    Focus on the most meaningful changes`

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      contributions: z.array(ContributionSchema)
    }),
    prompt
  });
  
  // Map the AI response to include the original repository's languages
  return object.contributions.map(contribution => {
    const repo = repositories.find(r => r.name === contribution.repo);
    return {
      ...contribution,
      languages: repo?.languages || []
    };
  });
}

const HighlightSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.enum(['achievement', 'impact']),
  icon: z.string()
});

export async function generateHighlights(
  stats: {
    totalCommits: number;
    totalAdditions: number;
    totalDeletions: number;
  },
  repositories: Array<{
    name: string;
    description: string;
    commits: number;
    stars: number;
    primaryLanguage: string | null;
    languages: Array<{ name: string; color: string }>;
    recentCommits: Array<{
      message: string;
      date: string;
      additions: number;
      deletions: number;
    }>;
  }>
): Promise<Highlight[]> {
  const prompt = `Based on these GitHub statistics, repositories, and commit history:
    - Total Commits: ${stats.totalCommits}
    - Lines Added: ${stats.totalAdditions}
    - Lines Deleted: ${stats.totalDeletions}
    - Top Languages: ${repositories.flatMap(repo => 
        repo.languages?.map(lang => lang.name)
      ).filter(Boolean).join(', ')}
    - Most Starred Repo: ${repositories[0]?.stars || 0} stars
      ${repositories.map(repo => `
      Repository: ${repo.name}
      Description: ${repo.description}
      Commits: ${repo.commits}
      Stars: ${repo.stars}
      Primary Language: ${repo.primaryLanguage}
      Recent commits: ${repo.recentCommits?.map(commit => 
        `- ${commit.message} (${commit.additions} additions, ${commit.deletions} deletions)`
      ).join('\n')}
      Languages: ${repo.languages?.map(lang => lang.name).join(', ')}
      `).join('\n')}

    Generate 2 significant highlights that showcase the developer's achievements.
    - Focus on the most meaningful changes and make them very unique and fun. More concise and less wordy.`

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      highlights: z.array(HighlightSchema)
    }),
    prompt
  });

  return object.highlights;
}