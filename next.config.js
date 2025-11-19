/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HACKATHON_API_URL: process.env.HACKATHON_API_URL,
    HACKATHON_API_TOKEN: process.env.HACKATHON_API_TOKEN,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig