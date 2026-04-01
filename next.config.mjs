/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Modo output recomendado para Vercel
  output: 'standalone',

  // ✅ Configuração Webpack para Howler.js (SSR incompatível)
  webpack: (config, { isServer }) => {
    config.externals.push('howler')
    return config
  },

  // ✅ Performance: Desabilitar linting em build
  eslint: {
    ignoreDuringBuilds: false,
  },

  // ✅ Otimizações de imagem
  images: {
    domains: [],
    unoptimized: true, // Desabilitar porque jogo usa Three.js, não imagens Next
  },

  // ✅ Headers de segurança (complementa vercel.json)
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

  // ✅ Rewrite para public/audio se não encontrar
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    }
  },

  // ✅ Variáveis de ambiente públicas
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'BACKROOMS Horror',
  },

  // ✅ Compressão
  compress: true,

  // ✅ Suporte a módulos modernos
  swcMinify: true,

  // ✅ Detecção automática de rota de API (desabilitar se não usar)
  experimental: {
    outputFileTracingIncludes: undefined,
  },
}

export default nextConfig
