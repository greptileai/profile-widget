import { NextResponse } from 'next/server'
import { fetchGitHubStats } from "@/lib/actions/github-actions"
import { batchCheckCache } from '@/lib/redis'
import { generateHighlights } from '@/lib/actions/ai-actions'

// Simple loading SVG
const loadingSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="150" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="150" fill="#1a1b1e"/>
  <text x="400" y="85" 
    font-family="system-ui, -apple-system, sans-serif"
    fill="white" 
    font-size="24px" 
    text-anchor="middle">
    Loading GitHub Highlights...
  </text>
</svg>`.trim()

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const { username } = params

  try {
    const cachedData = await batchCheckCache(username, false)
    const stats = cachedData['github:stats'] || 
      await fetchGitHubStats(username, false)

    if (!stats) {
      return new NextResponse(loadingSvg.replace('Loading GitHub Highlights...', 'GitHub Profile Not Found'), {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'max-age=0, s-maxage=3600',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    // Get highlights from AI
    const highlights = await generateHighlights(
      stats,
      stats.topRepositories,
      username,
      false,
      false
    )

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="800" height="300" xmlns="http://www.w3.org/2000/svg">
      <style>
        text { font-family: system-ui, -apple-system, sans-serif; }
        .title { fill: white; font-size: 24px; font-weight: 500; }
        .highlight-title { fill: white; font-size: 16px; }
        .highlight-desc { fill: #888; font-size: 14px; }
        .highlight-icon { font-size: 56px; fill: #888; }
        .card-gold { fill: #1a1814; }
        .card-silver { fill: #14171a; }
      </style>
      
      <rect width="800" height="400" fill="#1a1b1e"/>
      
      <!-- Title -->
      <text x="30" y="45" class="title">Highlights</text>
      
      <!-- Highlights List - Two Column Layout -->
      ${highlights.map((highlight, index) => {
        const isRightColumn = index % 2 === 1;
        const x = isRightColumn ? 413 : 43;
        const y = 80 + Math.floor(index / 2) * 220;
        const cardClass = isRightColumn ? 'card-silver' : 'card-gold';

        // Split title into lines
        const titleWords = highlight.title.split(' ');
        let titleLines = [];
        let currentTitleLine = [] as any;
        const maxTitleLineLength = 35; // Slightly longer than description lines
        
        titleWords.forEach(word => {
          if ((currentTitleLine.concat([word])).join(' ').length > maxTitleLineLength) {
            titleLines.push(currentTitleLine.join(' '));
            currentTitleLine = [word];
          } else {
            currentTitleLine.push(word);
          }
        });
        if (currentTitleLine.length > 0) {
          titleLines.push(currentTitleLine.join(' '));
        }
        
        // Limit title to 2 lines and add ellipsis if needed
        if (titleLines.length > 2) {
          titleLines = titleLines.slice(0, 2);
          const lastLine = titleLines[1];
          if (lastLine.length > maxTitleLineLength - 3) {
            titleLines[1] = lastLine.slice(0, maxTitleLineLength - 3) + '...';
          } else {
            titleLines[1] = lastLine + '...';
          }
        }

        // Split description into words and create lines
        const words = highlight.description.split(' ');
        let lines = [];
        let currentLine = [] as any;
        const maxLineLength = 30;
        const maxLines = 6;
        
        words.forEach(word => {
          if ((currentLine.concat([word])).join(' ').length > maxLineLength) {
            lines.push(currentLine.join(' '));
            currentLine = [word];
          } else {
            currentLine.push(word);
          }
        });
        if (currentLine.length > 0) {
          lines.push(currentLine.join(' '));
        }

        if (lines.length > maxLines) {
          lines = lines.slice(0, maxLines);
          const lastLine = lines[maxLines - 1];
          if (lastLine.length > maxLineLength - 3) {
            lines[maxLines - 1] = lastLine.slice(0, maxLineLength - 3) + '...';
          } else {
            lines[maxLines - 1] = lastLine + '...';
          }
        }

        // Calculate description starting y position based on number of title lines
        const descStartY = 65 + (titleLines.length - 1) * 24;

        return `
        <g transform="translate(${x}, ${y})">
          <rect class="${cardClass}" width="340" height="200" rx="8"/>
          ${titleLines.map((line, i) => 
            `<text x="20" y="${35 + i * 24}" class="highlight-title">${line}</text>`
          ).join('')}
          ${lines.map((line, i) => 
            `<text x="20" y="${descStartY + i * 24}" class="highlight-desc">${line}</text>`
          ).join('')}
          <text x="310" y="120" class="highlight-icon" text-anchor="end" font-size="120px">${highlight.icon}</text>
        </g>`;
      }).join('')}

    </svg>`.trim()

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Error generating GitHub highlights widget:', error)
    return new NextResponse(loadingSvg.replace('Loading GitHub Highlights...', 'Error Loading Highlights'), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }
}
