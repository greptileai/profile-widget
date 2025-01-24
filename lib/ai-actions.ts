"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateTags(bio: string, repositories: Array<{ description: string, name: string }>): Promise<string[]> {
  const prompt = `Based on this GitHub profile:
Bio: ${bio}
Top Repositories:
${repositories.map(repo => `- ${repo.name}: ${repo.description}`).join('\n')}

Generate exactly 3 short, emoji-prefixed tags that best describe this developer's expertise and interests. 
Format each tag like "emoji Technology/Skill". Example format: "⚛️ React Expert"
Keep each tag under 20 characters.`

  const { text } = await generateText({
    model: openai("gpt-4"),
    prompt: prompt
  })

  // Split the response into individual tags and clean them up
  return text.split('\n')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .slice(0, 3)
}