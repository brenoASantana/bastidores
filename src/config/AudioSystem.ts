import { MADNESS, ASSETS } from '@/config/Constants'
import type { AudioState } from '@/utils/Game'

// Fallback para áudio silencioso (silent WAV)
const SILENT_AUDIO_FALLBACK =
  'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='

type HowlClass = typeof import('howler')['Howl']
type HowlInstance = InstanceType<HowlClass>

let HowlCtor: HowlClass | null = null

// Lazy load Howler apenas quando necessário
const loadHowler = async (): Promise<HowlClass | null> => {
  if (typeof window === 'undefined') return null
  if (HowlCtor) return HowlCtor

  try {
    const howlerModule = await import('howler')
    HowlCtor = howlerModule.Howl
    return HowlCtor
  } catch {
    console.warn('Howler not available, using silent audio system')
    return null
  }
}

export class AudioSystem {
  private audioState: AudioState
  private tracks: Map<string, HowlInstance> = new Map() // Guardamos tudo num mapa único

  constructor() {
    this.audioState = {
      masterVolume: MADNESS.AUDIO_CONFIG.MASTER_VOLUME,
      ambientVolume: MADNESS.AUDIO_CONFIG.AMBIENT_BASE,
      sfxVolume: MADNESS.AUDIO_CONFIG.SFX_VOLUME,
      anxietyLevel: 0,
    }
  }

  public async initializeTracks() {
    const HowlerClass = await loadHowler()
    if (!HowlerClass) return

    // Varre todas as categorias do seu arquivo de constantes automaticamente
    Object.entries(ASSETS.AUDIO).forEach(([category, files]) => {
      Object.entries(files).forEach(([key, url]) => {
        const trackId = `${category}.${key}`

        const track = new HowlerClass({
          src: [url, SILENT_AUDIO_FALLBACK],
          loop: category === 'ambient', // Faz loop apenas se for da categoria ambient
          volume: category === 'ambient' ? this.audioState.ambientVolume : this.audioState.sfxVolume,
          html5: true,
          onloaderror: () => console.warn(`Falha ao carregar: ${url}`)
        })

        this.tracks.set(trackId, track)
      })
    })
  }

  // Métodos de controle simplificados
  getTrack(id: string) { return this.tracks.get(id) }

  startAmbient() {
    const track = this.getTrack('ambient.base')
    if (track && !track.playing()) track.play()
  }

  stopAmbient() {
    this.getTrack('ambient.base')?.stop()
  }

  startMenuMusic() {
    const track = this.getTrack('ambient.menu')
    if (track && !track.playing()) track.play()
  }

  stopMenuMusic() {
    const track = this.getTrack('ambient.menu')
    if (track) {
      track.fade(track.volume() as number, 0, 1000)
      setTimeout(() => track.stop(), 1000)
    }
  }

  playSFX(eventId: string, volume: number = 1) {
    // Busca inteligente: tenta achar nos SFX ou Madness/Entity
    const track = this.tracks.get(`sfx.${eventId}`) ||
      this.tracks.get(`madness.${eventId}`) ||
      this.tracks.get(`entity.${eventId}`)

    if (track) {
      track.volume(volume * this.audioState.sfxVolume * this.audioState.masterVolume)
      track.play()
    }
  }

  updateAnxietyLayer(anxietyLevel: number) {
    this.audioState.anxietyLevel = anxietyLevel
    const normalizedAnxiety = anxietyLevel / 100
    const ambient = this.getTrack('ambient.base')

    if (ambient) {
      ambient.volume(
        MADNESS.AUDIO_CONFIG.AMBIENT_BASE * (1 - normalizedAnxiety * 0.3) * this.audioState.masterVolume
      )
    }
  }
}

let audioSystemInstance: AudioSystem | null = null

export function getAudioSystem(): AudioSystem {
  if (!audioSystemInstance) {
    audioSystemInstance = new AudioSystem()
    audioSystemInstance.initializeTracks().catch((err) => {
      console.warn('AudioSystem initializeTracks failed:', err)
    })
  }
  return audioSystemInstance
}
