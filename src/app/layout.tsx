import type { Metadata, Viewport } from 'next'
import '@/app/styles/globals.css'

export const metadata: Metadata = {
  title: 'bastidores - Psychological Horror',
  description: 'A web-based psychological horror game exploring the agoraphobia of empty corridors.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

// A assinatura formatada com CSS para o console do navegador
const easterEggScript = `
  console.log(
    '%c BASTIDORES \\n%c Desenvolvido por Breno Santana \\n%c Texturas por methodical pixel (OpenGameArt)',
    'color: #ca8a04; font-size: 24px; font-weight: bold; font-family: "Courier Prime", monospace;',
    'color: #a3a3a3; font-size: 14px; font-family: "Courier Prime", monospace;',
    'color: #52525b; font-size: 12px; font-family: "Courier Prime", monospace;'
  );
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="overflow-hidden">
        {children}
        {/* Injeta o script diretamente no cliente para aparecer no console (F12) */}
        <script dangerouslySetInnerHTML={{ __html: easterEggScript }} />
      </body>
    </html>
  )
}