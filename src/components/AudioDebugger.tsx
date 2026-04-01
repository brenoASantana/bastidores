/**
 * Componente de Teste de Áudio
 * Use este arquivo para debugar carregamento de áudio
 *
 * Para usar:
 * 1. Importe este componente em src/app/page.tsx
 * 2. Adicione <AudioDebugger /> no JSX
 * 3. Abra http://localhost:3000 e procure pelo painel de debug
 */

'use client'

import { AUDIO_FILES } from '@/config/audioFiles'
import { useEffect, useState } from 'react'

export function AudioDebugger() {
  const [audioStatus, setAudioStatus] = useState<{
    status: 'checking' | 'ready' | 'error'
    files: Array<{ url: string; exists: boolean; error?: string }>
  }>({
    status: 'checking',
    files: [],
  })

  useEffect(() => {
    const checkAudio = async () => {
      const allFiles = [
        { name: 'ambient-base', url: AUDIO_FILES.ambient.base },
        { name: 'tension-layer', url: AUDIO_FILES.ambient.tension },
        { name: 'footsteps', url: AUDIO_FILES.sfx.distantFootsteps },
        { name: 'whisper', url: AUDIO_FILES.sfx.whisper },
        { name: 'buzz', url: AUDIO_FILES.sfx.buzzingLight },
      ]

      const results = await Promise.all(
        allFiles.map(async ({ name, url }) => {
          try {
            const response = await fetch(url, { method: 'HEAD' })
            return {
              url,
              exists: response.ok,
              error: response.ok ? undefined : `HTTP ${response.status}`,
            }
          } catch (err) {
            return {
              url,
              exists: false,
              error: err instanceof Error ? err.message : 'Unknown error',
            }
          }
        })
      )

      const hasErrors = results.some((r) => !r.exists)

      setAudioStatus({
        status: hasErrors ? 'error' : 'ready',
        files: results,
      })
    }

    checkAudio()
  }, [])

  if (audioStatus.status === 'checking') {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-900 text-yellow-100 p-4 rounded text-sm max-w-xs">
        🔄 Verificando áudio...
      </div>
    )
  }

  const hasErrors = audioStatus.files.some((f) => !f.exists)

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded text-sm max-w-md backdrop-blur-sm ${
        hasErrors
          ? 'bg-red-900/80 border border-red-600 text-red-100'
          : 'bg-green-900/80 border border-green-600 text-green-100'
      }`}
    >
      <div className="font-bold mb-2">
        {hasErrors ? '❌ Áudio incompleto' : '✅ Todos os áudios carregados'}
      </div>

      <div className="text-xs space-y-1">
        {audioStatus.files.map(({ url, exists, error }) => (
          <div key={url} className={exists ? 'text-green-300' : 'text-red-300'}>
            {exists ? '✓' : '✗'} {url.split('/').pop()}
            {error && ` (${error})`}
          </div>
        ))}
      </div>

      {hasErrors && (
        <div className="mt-3 text-xs">
          <p className="font-semibold mb-1">Como corrigir:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Verifique files em public/audio/</li>
            <li>Nomes devem ser exatos (case-sensitive)</li>
            <li>Formatos: MP3, WAV, OGG ou OPUS</li>
          </ol>
          <p className="mt-2">
            📖 Leia:{' '}
            <code className="bg-black/30 px-1 rounded text-yellow-300">
              AUDIO_SETUP.md
            </code>
          </p>
        </div>
      )}
    </div>
  )
}
