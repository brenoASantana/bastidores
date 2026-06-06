import type { Metadata, Viewport } from 'next'
import '@/app/styles/globals.css'
import { CREATOR } from '@/data/constants'

export const metadata: Metadata = {
  title: 'bastidores - Psychological Horror',
  description: 'A web-based psychological horror game exploring the agoraphobia of empty corridors.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

const currentYear = new Date().getFullYear();

const easterEggScript = `
  console.log(
    '%c BASTIDORES \\n%c © ${currentYear} Desenvolvido por ${CREATOR} \\n%c Texturas por methodical pixel (OpenGameArt)',
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