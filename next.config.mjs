/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Webpack override removed: audio is lazy-loaded on client-side
  // and does not require forcing `howler` as external. Keeping
  // bundling defaults avoids SWC/webpack optimization crashes.
  webpack: (config) => config,

  eslint: {
    ignoreDuringBuilds: false,
  },

  images: {
    domains: [],
    unoptimized: true,
  },

  async headers() {
    return [
      {
        source: '/audio/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    }
  },

  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'bastidores',
  },

  compress: true,

  experimental: {
    outputFileTracingIncludes: undefined,
  },
}

export default nextConfig
