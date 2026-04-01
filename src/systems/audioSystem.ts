import { Howl } from 'howler'
import { AUDIO_CONFIG, HORROR_EVENTS } from '@/config/constants'
import type { AudioState } from '@/types/game'

export class AudioSystem {
  private audioState: AudioState
  private ambientTrack: Howl | null = null
  private tensionTrack: Howl | null = null
  private sfxTracks: Map<string, Howl> = new Map()

  constructor() {
    this.audioState = {
      masterVolume: AUDIO_CONFIG.MASTER_VOLUME,
      ambientVolume: AUDIO_CONFIG.AMBIENT_BASE,
      tensionVolume: AUDIO_CONFIG.TENSION_MIN,
      sfxVolume: AUDIO_CONFIG.SFX_VOLUME,
      anxietyLevel: 0,
    }

    this.initializeTracks()
  }

  private initializeTracks() {
    // Áudio ambiente base (pode ser substituído por arquivo real depois)
    this.ambientTrack = new Howl({
      src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
      loop: true,
      volume: this.audioState.ambientVolume,
    })

    // Trilha de tensão em loop
    this.tensionTrack = new Howl({
      src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
      loop: true,
      volume: this.audioState.tensionVolume,
    })

    // Inicializar SFX
    this.addSFX(HORROR_EVENTS.DISTANT_FOOTSTEPS, 'fallback_sound')
    this.addSFX(HORROR_EVENTS.WHISPER, 'fallback_sound')
    this.addSFX(HORROR_EVENTS.BUZZING_LIGHT, 'fallback_sound')
  }

  private addSFX(eventId: string, soundKey: string) {
    const sound = new Howl({
      src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
      volume: this.audioState.sfxVolume,
    })
    this.sfxTracks.set(eventId, sound)
  }

  // Atualiza volumes de trilha com base em ansiedade
  updateAnxietyLayer(anxietyLevel: number) {
    this.audioState.anxietyLevel = anxietyLevel
    const normalizedAnxiety = anxietyLevel / 100

    // Trilha de tensão cresce com a ansiedade
    const tensionVolume =
      AUDIO_CONFIG.TENSION_MIN +
      (AUDIO_CONFIG.TENSION_MAX - AUDIO_CONFIG.TENSION_MIN) * normalizedAnxiety

    this.audioState.tensionVolume = tensionVolume

    if (this.tensionTrack) {
      this.tensionTrack.volume(tensionVolume * this.audioState.masterVolume)
    }

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
  startTension() {
    if (this.tensionTrack && !this.tensionTrack.playing()) {
      this.tensionTrack.play()
    }
  }

  // Para trilha de tensão
  stopTension() {
    if (this.tensionTrack) {
      this.tensionTrack.stop()
    }
  }

  // Define volume mestre
  setMasterVolume(volume: number) {
    this.audioState.masterVolume = Math.max(0, Math.min(1, volume))

    if (this.ambientTrack) {
      this.ambientTrack.volume(this.audioState.ambientVolume * this.audioState.masterVolume)
    }
    if (this.tensionTrack) {
      this.tensionTrack.volume(this.audioState.tensionVolume * this.audioState.masterVolume)
    }
  }

  getState(): AudioState {
    return { ...this.audioState }
  }
}

export const audioSystem = new AudioSystem()
