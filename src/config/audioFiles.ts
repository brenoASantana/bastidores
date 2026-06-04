export const AUDIO_FILES = {
  ambient: {
    base: '/assets/audio/music/Furniture_Lament.mp3', // Industrial, máquinas, silêncio assustador
    tension: '/audio/tension-layer.mp3', // Sons distorcidos, drones crescentes
  },

  // Efeitos sonoros - disparam em eventos
  sfx: {
    distantFootsteps: '/audio/footsteps.mp3', // Passos distantes e lentos
    whisper: '/audio/whisper.mp3', // Sussurro incompreensível
    buzzingLight: '/audio/buzz.mp3', // Fluorescente zumbindo
  },
}

/**
 * Validar URLs disponíveis - Retorna true se o arquivo existe
 * Use em desenvolvimento para debugar qual arquivo não foi encontrado
 */
export async function validateAudioFiles() {
  const allFiles = [
    ...Object.values(AUDIO_FILES.ambient),
    ...Object.values(AUDIO_FILES.sfx),
  ]

  const results = await Promise.all(
    allFiles.map(async (url) => {
      try {
        const response = await fetch(url, { method: 'HEAD' })
        return { url, exists: response.ok }
      } catch {
        return { url, exists: false }
      }
    })
  )

  const missing = results.filter((r) => !r.exists)
  if (missing.length > 0) {
    console.warn('Missing audio files:', missing.map((r) => r.url))
    return false
  }

  console.log('✅ All audio files found')
  return true
}
