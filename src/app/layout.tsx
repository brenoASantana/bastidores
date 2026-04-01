import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BACKROOMS - Psychological Horror',
  description: 'A web-based psychological horror game exploring the agoraphobia of empty corridors.',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="overflow-hidden">{children}</body>
    </html>
  )
}
