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

import { AUDIO_FILES } from '@/components/config/audioFiles'
import { AUDIO_CONFIG, HORROR_EVENTS } from '@/components/data/constants'
import type { AudioState } from '@/utils/game'

// Fallback para áudio silencioso (silent WAV)
const SILENT_AUDIO_FALLBACK =
  'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='

export class AudioSystem {
  private audioState: AudioState
  private ambientTrack: HowlInstance | null = null
  private sfxTracks: Map<string, HowlInstance> = new Map()

  constructor() {
    this.audioState = {
      masterVolume: AUDIO_CONFIG.MASTER_VOLUME,
      ambientVolume: AUDIO_CONFIG.AMBIENT_BASE,
      sfxVolume: AUDIO_CONFIG.SFX_VOLUME,
      anxietyLevel: 0,
    }
    // initializeTracks is async and performs dynamic imports.
    // Do not call it from the constructor to avoid race conditions
    // during build-time optimization. It will be started lazily
    // when the system is first requested via `getAudioSystem()`.
  }

  public async initializeTracks() {
    const HowlerClass = await loadHowler()
    if (!HowlerClass) return

    // Áudio ambiente base
    this.ambientTrack = new HowlerClass({
      src: [AUDIO_FILES.ambient.base, SILENT_AUDIO_FALLBACK],
      loop: true,
      volume: this.audioState.ambientVolume,
      html5: true, // Permite streaming de arquivos maiores
      onloaderror: () => {
        console.warn(`Failed to load ambient track: ${AUDIO_FILES.ambient.base}`)
      },
    })
    // Inicializar SFX
    this.addSFX(HORROR_EVENTS.DISTANT_FOOTSTEPS, AUDIO_FILES.sfx.distantFootsteps)
  }

  private addSFX(eventId: string, soundUrl: string) {
    if (!HowlCtor) return

    const sound = new HowlCtor({
      src: [soundUrl, SILENT_AUDIO_FALLBACK],
      volume: this.audioState.sfxVolume,
      html5: true,
      onloaderror: () => {
        console.warn(`Failed to load SFX: ${soundUrl}`)
      },
    })

    this.sfxTracks.set(eventId, sound)
  }

  // Atualiza volumes de trilha com base em ansiedade
  updateAnxietyLayer(anxietyLevel: number) {
    this.audioState.anxietyLevel = anxietyLevel
    const normalizedAnxiety = anxietyLevel / 100

    // Trilha de tensão cresce com a ansiedade
    // const tensionVolume =
    //   AUDIO_CONFIG.TENSION_MIN +
    //   (AUDIO_CONFIG.TENSION_MAX - AUDIO_CONFIG.TENSION_MIN) * normalizedAnxiety

    //this.audioState.tensionVolume = tensionVolume

    // Ambient reduz levemente quando ansiedade sobe
    if (this.ambientTrack) {
      this.ambientTrack.volume(
        AUDIO_CONFIG.AMBIENT_BASE * (1 - normalizedAnxiety * 0.3) * this.audioState.masterVolume
      )
    }
  }

  // Reproduz efeito sonoro posicional
  playSFX(eventId: string, volume: number = 1) {
    const track = this.sfxTracks.get(eventId)
    if (track) {
      track.volume(volume * this.audioState.sfxVolume * this.audioState.masterVolume)
      track.play()
    }
  }

  // Inicia trilha ambiente
  startAmbient() {
    if (this.ambientTrack && !this.ambientTrack.playing()) {
      this.ambientTrack.play()
    }
  }

  // Para trilha ambiente
  stopAmbient() {
    if (this.ambientTrack) {
      this.ambientTrack.stop()
    }
  }

  // Inicia trilha de tensão
  // startTension() {
  //   if (this.tensionTrack && !this.tensionTrack.playing()) {
  //     this.tensionTrack.play()
  //   }
  // }

  // Para trilha de tensão
  // stopTension() {
  //   if (this.tensionTrack) {
  //     this.tensionTrack.stop()
  //   }
  // }

  // Define volume mestre
  setMasterVolume(volume: number) {
    this.audioState.masterVolume = Math.max(0, Math.min(1, volume))

    if (this.ambientTrack) {
      this.ambientTrack.volume(this.audioState.ambientVolume * this.audioState.masterVolume)
    }
    // if (this.tensionTrack) {
    //   this.tensionTrack.volume(this.audioState.tensionVolume * this.audioState.masterVolume)
    // }
  }

  getState(): AudioState {
    return { ...this.audioState }
  }
}

let audioSystemInstance: AudioSystem | null = null

export function getAudioSystem(): AudioSystem {
  if (!audioSystemInstance) {
    audioSystemInstance = new AudioSystem()
    // Start async initialization outside constructor to avoid
    // producing un-awaited promises during static build optimizations.
    // Initialization failures are non-fatal at build-time.
    audioSystemInstance.initializeTracks().catch((err) => {
      // Fail gracefully in environments where Howler isn't available.
      // Keep the system usable in a degraded (silent) mode.
      // eslint-disable-next-line no-console
      console.warn('AudioSystem initializeTracks failed:', err)
    })
  }
  return audioSystemInstance
}
