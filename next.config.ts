import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.externals.push('howler')
    return config
  },
}

export default nextConfig
