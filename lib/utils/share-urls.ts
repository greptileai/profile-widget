export function generateShareUrls(username: string, pngUrl?: string) {
  const text = `Check out my GitHub stats powered by Greptile!`
  const encodedText = encodeURIComponent(text)
  const shareUrl = pngUrl || `${process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL}/${username}/share/combined`
  const encodedUrl = encodeURIComponent(shareUrl)

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?title=${encodedText}&url=${encodedUrl}`
  }
} 