/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Modo output recomendado para Vercel
  output: 'standalone',

  // Webpack override removed: audio is lazy-loaded on client-side
  // and does not require forcing `howler` as external. Keeping
  // bundling defaults avoids SWC/webpack optimization crashes.
  webpack: (config) => config,

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
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'bastidores Horror',
  },

  // ✅ Compressão
  compress: true,

  // Suaviza otimização: desabilita SWC minifier que tem causado
  // crashes em alguns ambientes de build (bus error).
  // Mantemos a opção desabilitada enquanto investigamos.
  swcMinify: false,

  // ✅ Detecção automática de rota de API (desabilitar se não usar)
  experimental: {
    outputFileTracingIncludes: undefined,
  },
}

export default nextConfig
