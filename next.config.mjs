/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['github.com', 'avatars.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'greptile-stats.vercel.app',
        pathname: '/**/*',
      },
    ],
  },
};

export default nextConfig;