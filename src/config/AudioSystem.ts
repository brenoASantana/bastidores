'use client' // Importante para garantir que rode apenas no cliente

import { MADNESS, ASSETS } from '@/config/Constants'
import type { AudioState } from '@/utils/Game'

type HowlClass = typeof import('howler')['Howl']
type HowlerGlobal = typeof import('howler')['Howler']
type HowlInstance = InstanceType<HowlClass>

let HowlCtor: HowlClass | null = null
let HowlerGlobal: HowlerGlobal | null = null

const SILENT_AUDIO_FALLBACK = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='

// Ajustamos o retorno para entregar os dois objetos necessários
const loadHowler = async (): Promise<{ Howl: HowlClass; Howler: HowlerGlobal } | null> => {
  if (typeof window === 'undefined') return null
  if (HowlCtor && HowlerGlobal) return { Howl: HowlCtor, Howler: HowlerGlobal }

  try {
    const howlerModule = await import('howler')
    HowlCtor = howlerModule.Howl
    HowlerGlobal = howlerModule.Howler
    return { Howl: HowlCtor, Howler: HowlerGlobal }
  } catch {
    console.warn('Howler not available')
    return null
  }
}

export class AudioSystem {
  private audioState: AudioState
  private tracks: Map<string, HowlInstance> = new Map()
  private initializationPromise: Promise<void> | null = null;
  private isInitialized = false

  constructor() {
    this.audioState = {
      masterVolume: MADNESS.AUDIO_CONFIG.MASTER_VOLUME,
      ambientVolume: MADNESS.AUDIO_CONFIG.AMBIENT_BASE,
      sfxVolume: MADNESS.AUDIO_CONFIG.SFX_VOLUME,
      anxietyLevel: 0,
    }
  }

  public async initializeTracks() {
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      const loaded = await loadHowler();
      if (!loaded) return;

      const { Howl } = loaded;

      console.log("Assets importados:", ASSETS.AUDIO);

      Object.entries(ASSETS.AUDIO).forEach(([category, files]) => {
        Object.entries(files).forEach(([key, url]) => {
          const trackId = `${category.toLowerCase()}.${key.toLowerCase()}`;
          const track = new Howl({
            src: [url, SILENT_AUDIO_FALLBACK],
            loop: category === 'AMBIENT',
            volume: category === 'AMBIENT' ? this.audioState.ambientVolume : this.audioState.sfxVolume,
            html5: true,
          });
          this.tracks.set(trackId, track);
        });
      });

      this.isInitialized = true;
      console.log("AudioSystem pronto! Chaves:", Array.from(this.tracks.keys()));
    })();

    return this.initializationPromise;
  }

  // No seu AudioSystem.ts
  private getTrack(id: string) {
    const normalizedId = id.toLowerCase();
    const track = this.tracks.get(normalizedId);

    // Apenas retorne o track se existir, sem poluir o console se não estiver pronto ainda
    return track;
  }

  // getTrackDebugger
  // private getTrack(id: string) {
  //   const normalizedId = id.toLowerCase();
  //   const track = this.tracks.get(normalizedId);

  //   if (!track) {
  //     console.warn(`AudioSystem: Track "${normalizedId}" não encontrada!`);
  //     console.log("Chaves disponíveis no sistema:", Array.from(this.tracks.keys()));
  //   }
  //   return track;
  // }

  resumeAudioContext() {
    if (HowlerGlobal && HowlerGlobal.ctx && HowlerGlobal.ctx.state === 'suspended') {
      HowlerGlobal.ctx.resume();
    }
  }

  // --- Controles ---
  startAmbient() {
    if (!this.isInitialized) {
      setTimeout(() => this.startAmbient(), 500)
      return
    }

    const track = this.getTrack('ambient.base')

    if (track && !track.playing()) {
      track.loop(true)
      track.play()
    }
  }
  startSoundtrack() {
    if (!this.isInitialized) {
      setTimeout(() => this.startSoundtrack(), 500)
      return
    }

    const track = this.getTrack('ambient.soundtrack')

    if (track && !track.playing()) {
      track.loop(true)
      track.play()
    }
  }

  stopAmbient() { this.getTrack('ambient.base')?.stop() }

  stopSoundtrack() { this.getTrack('ambient.soundtrack')?.stop() }

  startMenuMusic() {
    if (!this.isInitialized) {
      setTimeout(() => this.startMenuMusic(), 500)
      return
    }

    const track = this.getTrack('ambient.menu')

    if (track && !track.playing()) {
      track.loop(true)
      track.play()
    }
  }

  stopMenuMusic() {
    const track = this.getTrack('ambient.menu')
    if (track) {
      track.fade(track.volume() as number, 0, 1000)
      setTimeout(() => track.stop(), 1000)
    }
  }

  playSFX(eventId: string, volume: number = 1) {
    const key = eventId.toLowerCase()
    const track = this.getTrack(`sfx.${key}`) || this.getTrack(`madness.${key}`) || this.getTrack(`entity.${key}`)
    if (track) {
      track.volume(volume * this.audioState.sfxVolume * this.audioState.masterVolume)
      track.play()
    }
  }

  startLoopingSFX(eventId: string, volume: number = 0.5) {
    const key = eventId.toLowerCase()
    const track = this.getTrack(`sfx.${key}`)
    if (track) {
      track.loop(true)
      track.volume(volume * this.audioState.sfxVolume * this.audioState.masterVolume)
      if (!track.playing()) track.play()
    }
  }

  stopSFX(eventId: string) {
    const key = eventId.toLowerCase()
    const track = this.getTrack(`sfx.${key}`) || this.getTrack(`madness.${key}`) || this.getTrack(`entity.${key}`)
    if (track && track.playing()) track.stop()
  }

  updateAnxietyLayer(anxietyLevel: number) {
    this.audioState.anxietyLevel = anxietyLevel
    const normalizedAnxiety = anxietyLevel / 100
    const ambient = this.getTrack('ambient.base')
    if (ambient) {
      ambient.volume(MADNESS.AUDIO_CONFIG.AMBIENT_BASE * (1 - normalizedAnxiety * 0.3) * this.audioState.masterVolume)
    }
  }
}

let audioSystemInstance: AudioSystem | null = null
export function getAudioSystem(): AudioSystem {
  if (!audioSystemInstance) {
    audioSystemInstance = new AudioSystem()
    audioSystemInstance.initializeTracks().catch(console.warn)
  }
  return audioSystemInstance
}