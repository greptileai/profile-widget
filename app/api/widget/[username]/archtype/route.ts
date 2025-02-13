import { NextResponse } from 'next/server'
import { fetchGitHubStats } from "@/lib/actions/github-actions"
import { batchCheckCache } from '@/lib/redis'
import { generateProgrammerArchtype } from '@/lib/actions/ai-actions'

// Simple loading SVG
const loadingSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="150" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="150" fill="#1a1b1e"/>
  <text x="400" y="85" 
    font-family="system-ui, -apple-system, sans-serif"
    fill="white" 
    font-size="24px" 
    text-anchor="middle">
    Loading Developer Archetype...
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
      return new NextResponse(loadingSvg.replace('Loading Developer Archetype...', 'GitHub Profile Not Found'), {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'max-age=0, s-maxage=3600',
        },
      })
    }

    // Get archetype from AI
    const archetype = await generateProgrammerArchtype(
      stats,
      stats.topRepositories,
      username,
      false,
      false
    )

    // Create gradient definition for the background
    const gradientId = 'archetypeGradient'
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${archetype.color.from}" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="${archetype.color.to}" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      
      <style>
        text { font-family: system-ui, -apple-system, sans-serif; }
        .title { fill: #888; font-size: 18px; font-weight: 400; }
        .archetype { fill: white; font-size: 24px; font-weight: 500; }
        .description { fill: #888; font-size: 16px; }
        .power-move { fill: #10B981; font-size: 14px; }
      </style>
      
      <rect width="800" height="200" fill="#1a1b1e"/>
      <rect width="800" height="200" fill="url(#${gradientId})"/>
      
      <!-- Title -->
      <text x="40" y="60" class="title">Developer Archetype</text>
      
      <!-- Archetype Info -->
      <text x="40" y="100" class="archetype">
        ${archetype.icon} ${archetype.title}
      </text>
      <text x="40" y="130" class="description">${archetype.description}</text>
      <text x="40" y="160" class="power-move">⚡ Power Move: ${archetype.powerMove}</text>
      
      <g transform="translate(705, 12) scale(0.065)">
        <path d="M0 0 C2.625 1.8125 2.625 1.8125 4.875 4.25 C13.70387039 12.47690195 25.22478988 11.3538091 36.5 11.3125 C39.83130079 11.30044845 43.16102566 11.31409486 46.4921875 11.34375 C47.62815872 11.32677063 47.62815872 11.32677063 48.78707886 11.30944824 C52.2892169 11.34311451 54.256509 11.53799291 57.10229492 13.65795898 C59.19401956 16.61763029 59.20148591 18.2582601 58.625 21.8125 C56.91015625 24.33984375 56.91015625 24.33984375 54.6875 26.75 C51.19187992 30.90528736 49.625 33.2308614 49.625 38.8125 C49.61339844 39.90820312 49.60179688 41.00390625 49.58984375 42.1328125 C49.56544171 45.36085368 49.58131641 48.58476773 49.625 51.8125 C49.04492188 52.06644531 48.46484375 52.32039063 47.8671875 52.58203125 C46.24515106 53.29669087 44.62681217 54.01978508 43.01171875 54.75 C41.13151758 55.58701263 39.22587094 56.36687189 37.3125 57.125 C32.46873995 60.16643073 30.86414688 65.02168004 29 70.1875 C27.625 73.8125 27.625 73.8125 25.625 74.8125 C22.08139769 74.80509435 18.55037941 74.73579725 15.00976562 74.59765625 C9.2771903 74.48808487 6.14970097 75.5222745 1.81640625 79.453125 C1.01009766 80.24976562 1.01009766 80.24976562 0.1875 81.0625 C-2.45446765 83.38213608 -2.95671828 83.80445612 -6.625 83.875 C-10.83136911 82.24981194 -10.83136911 82.24981194 -12.375 79.8125 C-13.19830192 75.15497362 -13.50504091 70.64172844 -13.55078125 65.91796875 C-13.57462891 64.63212891 -13.59847656 63.34628906 -13.62304688 62.02148438 C-13.66952904 59.35184785 -13.69717281 56.68385365 -13.71679688 54.01367188 C-13.93796915 43.72144576 -15.16725226 35.4781116 -22.625 27.9375 C-26.59014463 23.22379535 -27.41629787 19.75654732 -26.9609375 13.6484375 C-25.77038758 7.88617591 -23.10044799 3.67859402 -18.25 0.3125 C-12.51843105 -2.50938843 -5.88474687 -2.07055908 0 0 Z " fill="#F8FDFA" transform="translate(39.375,14.1875)"/>
        <path d="M0 0 C0.49628906 0.99257812 0.99257812 1.98515625 1.50390625 3.0078125 C1.99213867 3.9836731 1.99213867 3.9836731 2.49023438 4.97924805 C3.21028453 6.42016808 3.92901643 7.86174756 4.64648438 9.30395508 C6.43109857 12.88695363 8.23087661 16.4588373 10.08984375 20.00390625 C10.41202881 20.62571777 10.73421387 21.2475293 11.06616211 21.88818359 C11.95428336 23.5994133 12.85188983 25.30571037 13.75 27.01171875 C14.99377734 29.98512395 15.3663787 31.8228097 15 35 C14 36 14 36 11.90234375 36.28515625 C7.99232268 35.90099536 4.97607853 34.252706 1.5625 32.4375 C0.14611889 31.70257441 -1.27055404 30.96821097 -2.6875 30.234375 C-3.40164062 29.86119141 -4.11578125 29.48800781 -4.8515625 29.10351562 C-6.92700605 28.03749234 -9.0183366 27.01831575 -11.125 26.015625 C-11.76767822 25.7069751 -12.41035645 25.3983252 -13.07250977 25.08032227 C-14.84728372 24.23068902 -16.62474532 23.38667668 -18.40234375 22.54296875 C-21 21 -21 21 -22 18 C-19.73559287 10.78220229 -15.27164301 5.13658319 -8.9375 1 C-5.7675215 -0.07914162 -3.32236173 -0.07372786 0 0 Z " fill="#F8FDFA" transform="translate(93,72)"/>
        <path d="M0 0 C4.49759141 1.33143218 8.36017127 3.70416498 12.4152832 6.02050781 C13.74076172 6.73787109 13.74076172 6.73787109 15.09301758 7.46972656 C15.92768555 7.94539063 16.76235352 8.42105469 17.62231445 8.91113281 C18.38648682 9.33942383 19.15065918 9.76771484 19.93798828 10.20898438 C21.6027832 11.77050781 21.6027832 11.77050781 21.9140625 14.38671875 C21.6027832 16.77050781 21.6027832 16.77050781 20.6027832 17.77050781 C16.29630684 18.02393017 11.97833266 17.9557342 7.6652832 17.95800781 C6.44647461 17.97025391 5.22766602 17.9825 3.97192383 17.99511719 C2.22878906 17.99801758 2.22878906 17.99801758 0.45043945 18.00097656 C-1.1581897 18.00713989 -1.1581897 18.00713989 -2.79931641 18.01342773 C-5.3972168 17.77050781 -5.3972168 17.77050781 -7.3972168 15.77050781 C-7.6628418 13.52832031 -7.6628418 13.52832031 -7.6472168 10.89550781 C-7.65237305 10.03183594 -7.6575293 9.16816406 -7.6628418 8.27832031 C-7.3790836 5.59930914 -6.85919554 4.02195508 -5.3972168 1.77050781 C-2.3972168 -0.22949219 -2.3972168 -0.22949219 0 0 Z " fill="#F8FCFA" transform="translate(105.397216796875,40.2294921875)"/>
        <path d="M0 0 C2 2 2 2 2.24291992 4.49023438 C2.23675659 6.02647461 2.23675659 6.02647461 2.23046875 7.59375 C2.22853516 8.70621094 2.22660156 9.81867188 2.22460938 10.96484375 C2.20624023 12.71474609 2.20624023 12.71474609 2.1875 14.5 C2.18685547 15.66660156 2.18621094 16.83320312 2.18554688 18.03515625 C2.14026365 26.7194727 2.14026365 26.7194727 1 29 C-0.65 29 -2.3 29 -4 29 C-9.859375 18.74609375 -9.859375 18.74609375 -10.92016602 16.8815918 C-11.6562023 15.59906146 -12.40191595 14.322048 -13.15600586 13.05004883 C-15.99341725 8.23039641 -15.99341725 8.23039641 -16.0625 5.8125 C-12.33245526 -0.55051749 -6.78918008 -1.03339732 0 0 Z " fill="#F8FDFA" transform="translate(56,98)"/>
      </g>
      <text x="720" y="20" fill="#777" font-size="10px">statsforgit.com</text>
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
    console.error('Error generating GitHub archetype widget:', error)
    return new NextResponse(loadingSvg.replace('Loading Developer Archetype...', 'Error Loading Archetype'), {
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
