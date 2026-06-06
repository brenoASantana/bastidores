import { MADNESS, ASSETS } from './Constants'
import type { AudioState } from '@/utils/Game'

// Fallback para áudio silencioso (silent WAV)
const SILENT_AUDIO_FALLBACK =
  'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='

type HowlClass = typeof import('howler')['Howl']
type HowlInstance = InstanceType<HowlClass>

let HowlCtor: HowlClass | null = null

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
  private tracks: Map<string, HowlInstance> = new Map()

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

    // Varre todas as categorias do objeto ASSETS.AUDIO automaticamente
    Object.entries(ASSETS.AUDIO).forEach(([category, files]) => {
      Object.entries(files).forEach(([key, url]) => {
        // ID gerado: "ambient.base", "sfx.footsteps", "madness.whisper"
        const trackId = `${category.toLowerCase()}.${key.toLowerCase()}`

        const track = new HowlerClass({
          src: [url, SILENT_AUDIO_FALLBACK],
          loop: category === 'AMBIENT', // Roda em loop se for ambient
          volume: category === 'AMBIENT' ? this.audioState.ambientVolume : this.audioState.sfxVolume,
          html5: true,
          onloaderror: () => console.warn(`Falha ao carregar: ${url}`)
        })

        this.tracks.set(trackId, track)
      })
    })
  }

  getTrack(id: string) { return this.tracks.get(id) }

  // Métodos específicos para Ambient (que possuem loop)
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

  // Busca inteligente para SFX
  playSFX(eventId: string, volume: number = 1) {
    const key = eventId.toLowerCase()

    // Tenta encontrar em qualquer categoria (sfx, madness, entity)
    const track = this.getTrack(`sfx.${key}`) ||
      this.getTrack(`madness.${key}`) ||
      this.getTrack(`entity.${key}`)

    if (track) {
      track.volume(volume * this.audioState.sfxVolume * this.audioState.masterVolume)
      track.play()
    } else {
      console.warn(`Som não encontrado: ${eventId}`)
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