'use client'

import { MADNESS, ASSETS } from '@/config/Constants'
import type { AudioState } from '@/utils/Game'

type HowlClass = typeof import('howler')['Howl']
type HowlerGlobal = typeof import('howler')['Howler']
type HowlInstance = InstanceType<HowlClass>

let HowlCtor: HowlClass | null = null
let HowlerGlobal: HowlerGlobal | null = null

const loadHowler = async (): Promise<{ Howl: HowlClass; Howler: HowlerGlobal } | null> => {
  if (typeof window === 'undefined') return null
  if (HowlCtor && HowlerGlobal) return { Howl: HowlCtor, Howler: HowlerGlobal }

  try {
    const howlerModule = await import('howler')
    HowlCtor = howlerModule.Howl
    HowlerGlobal = howlerModule.Howler

    HowlerGlobal.autoSuspend = false;
    HowlerGlobal.autoUnlock = true;

    return { Howl: HowlCtor, Howler: HowlerGlobal }
  } catch {
    console.warn('Howler not available')
    return null
  }
}

export class AudioSystem {
  private audioState: AudioState
  private tracks: Map<string, HowlInstance> = new Map()
  private isInitialized = false
  private lastPlayTimes: Map<string, number> = new Map();

  constructor() {
    this.audioState = {
      masterVolume: MADNESS.AUDIO_CONFIG.VOLUME_MASTER,
      ambientVolume: MADNESS.AUDIO_CONFIG.VOLUME_AMBIENT_BASE,
      sfxVolume: MADNESS.AUDIO_CONFIG.VOLUME_SFX,
      anxietyLevel: 0,
    }
  }

  private async loadAssetsGroup(categories: string[]) {
    const loaded = await loadHowler();
    if (!loaded) return;
    const { Howl } = loaded;

    for (const category of categories) {
      const files = ASSETS.AUDIO[category as keyof typeof ASSETS.AUDIO];
      if (!files) continue;

      Object.entries(files).forEach(([key, url]) => {
        const trackId = `${category.toLowerCase()}.${key.toLowerCase()}`;
        if (this.tracks.has(trackId)) return;

        const track = new Howl({
          src: [url],
          loop: category === 'AMBIENT',
          volume: category === 'AMBIENT' ? this.audioState.ambientVolume : this.audioState.sfxVolume,
          preload: true,
          onloaderror: (id, err) => console.warn(`Falha ao carregar [${url}]:`, id, err),
        });

        this.tracks.set(trackId, track);
      });
    }
  }

  public async initializeEssential() {
    const loaded = await loadHowler();
    if (loaded) {
      await this.loadAssetsGroup(['AMBIENT', 'SFX']);
    }
    this.isInitialized = true;
  }

  public async initializeGameplay() {
    await this.loadAssetsGroup(['EVENTS']);
  }

  private getTrack(id: string) {
    const normalizedId = id.toLowerCase();
    return this.tracks.get(normalizedId);
  }

  resumeAudioContext() {
    if (HowlerGlobal && HowlerGlobal.ctx && HowlerGlobal.ctx.state === 'suspended') {
      HowlerGlobal.ctx.resume();
    }
  }

  startAmbient() {
    if (!this.isInitialized) {
      setTimeout(() => this.startAmbient(), 500);
      return;
    }
    const track = this.getTrack('sfx.buzzing_light');
    if (track && !track.playing()) {
      track.loop(true);
      track.volume(this.audioState.ambientVolume * this.audioState.masterVolume);
      track.play();
    }
  }

  startSoundtrack() {
    const track = this.getTrack('ambient.music_level_suburbs');
    if (track && !track.playing()) {
      track.loop(true);
      track.volume(this.audioState.ambientVolume * this.audioState.masterVolume);
      track.play();
    }
  }

  stopAmbient() { this.getTrack('sfx.buzzing_light')?.stop() }
  stopSoundtrack() { this.getTrack('ambient.music_level_suburbs')?.stop() }

  startMenuMusic() {
    if (!this.isInitialized) {
      setTimeout(() => this.startMenuMusic(), 500);
      return;
    }
    const track = this.getTrack('ambient.music_menu_main');
    if (track && !track.playing()) {
      track.loop(true);
      track.volume(this.audioState.ambientVolume * this.audioState.masterVolume);
      track.play();
    }
  }

  stopMenuMusic() {
    const track = this.getTrack('ambient.music_menu_main')
    if (track) {
      track.fade(track.volume() as number, 0, 1000)
      setTimeout(() => track.stop(), 1000)
    }
  }

  playSFX(eventId: string, volume: number = 1, rate: number = 1.0) {
    const now = Date.now();
    const lastPlay = this.lastPlayTimes.get(eventId) || 0;

    if (now - lastPlay < 100) return;

    const key = eventId.toLowerCase();
    const track = this.getTrack(`sfx.${key}`) || this.getTrack(`events.${key}`);

    if (track) {
      track.volume(volume * this.audioState.sfxVolume * this.audioState.masterVolume);
      track.rate(rate);
      track.play();
      this.lastPlayTimes.set(eventId, now);
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
    const track = this.getTrack(`sfx.${key}`) || this.getTrack(`events.${key}`)
    if (track && track.playing()) track.stop()
  }

  updateAnxietyLayer(anxietyLevel: number) {
    this.audioState.anxietyLevel = anxietyLevel
    const normalizedAnxiety = anxietyLevel / 100
    const ambient = this.getTrack('sfx.buzzing_light')
    if (ambient) {
      ambient.volume(MADNESS.AUDIO_CONFIG.VOLUME_AMBIENT_BASE * (1 - normalizedAnxiety * 0.3) * this.audioState.masterVolume)
    }
  }
}

const globalForAudio = globalThis as unknown as { audioSystemInstance: AudioSystem | null };

export function getAudioSystem(): AudioSystem {
  if (typeof window === 'undefined') {
    return new AudioSystem();
  }
  if (!globalForAudio.audioSystemInstance) {
    globalForAudio.audioSystemInstance = new AudioSystem();
  }
  return globalForAudio.audioSystemInstance;
}