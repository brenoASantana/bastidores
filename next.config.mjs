/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.externals.push('howler')
    return config
  },
}

export default nextConfig
