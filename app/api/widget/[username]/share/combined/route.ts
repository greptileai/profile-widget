import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const { username } = params
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format')
  const baseUrl = process.env.NEXT_PUBLIC_GITHUB_WIDGET_URL

  try {
    // Fetch all SVGs
    const responses = await Promise.all([
      fetch(`${baseUrl}/${username}/share/stats`),
      fetch(`${baseUrl}/${username}/share/contributions`)
    ]);
    
    if (!responses.every(r => r.ok)) {
      throw new Error('Failed to fetch widget data');
    }

    const svgs = await Promise.all(responses.map(r => r.text()))

    // Extract the inner content of each SVG
    const innerContents = svgs.map(svg => {
      const match = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
      return match ? match[1] : ''
    })

    // Create combined SVG with both stats and contributions stacked
    const combinedSvg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <style>
        text { font-family: system-ui, -apple-system, sans-serif; }
      </style>
      <rect width="800" height="400" fill="#1a1b1e"/>

      <!-- Stats Widget -->
      <g transform="translate(0, 0)">
        ${innerContents[0]}
      </g>

      <!-- Contributions Widget -->
      <g transform="translate(0, 200)">
        ${innerContents[1]}
      </g>
    </svg>`

    if (format === 'png') {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setViewport({ width: 800, height: 400 });
      await page.setContent(`
        <style>body { margin: 0; background: #1a1b1e; }</style>
        ${combinedSvg}
      `);
      const screenshot = await page.screenshot({ 
        type: 'png',
        clip: { x: 0, y: 0, width: 800, height: 400 }
      });
      await browser.close();

      return new NextResponse(screenshot, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'max-age=0, s-maxage=3600',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new NextResponse(combinedSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error generating combined widget:', error)
    return new NextResponse('Error generating combined image', { status: 500 })
  }
} 
