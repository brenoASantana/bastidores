'use client' // Importante para garantir que rode apenas no cliente

import { MADNESS, ASSETS } from '@/config/Constants'
import type { AudioState } from '@/utils/Game'

type HowlClass = typeof import('howler')['Howl']
type HowlerGlobal = typeof import('howler')['Howler']
type HowlInstance = InstanceType<HowlClass>

let HowlCtor: HowlClass | null = null
let HowlerGlobal: HowlerGlobal | null = null

const SILENT_AUDIO_FALLBACK = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='

const loadHowler = async (): Promise<{ Howl: HowlClass; Howler: HowlerGlobal } | null> => {
  if (typeof window === 'undefined') return null
  if (HowlCtor && HowlerGlobal) return { Howl: HowlCtor, Howler: HowlerGlobal }

  try {
    const howlerModule = await import('howler')
    HowlCtor = howlerModule.Howl
    HowlerGlobal = howlerModule.Howler

    // Aumenta o limite nativo do pool do navegador
    HowlerGlobal.html5PoolSize = 50;
    // Impede que o Howler suspenda os áudios e perca a referência deles
    HowlerGlobal.autoSuspend = false;
    // Força o desbloqueio automático no primeiro clique
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

  // --- LÓGICA DE CARREGAMENTO MODULAR ---
  private async loadAssetsGroup(categories: string[]) {
    const loaded = await loadHowler();
    if (!loaded) return;
    const { Howl } = loaded;

    for (const category of categories) {
      const files = ASSETS.AUDIO[category as keyof typeof ASSETS.AUDIO];
      if (!files) continue;

      Object.entries(files).forEach(([key, url]) => {
        const trackId = `${category.toLowerCase()}.${key.toLowerCase()}`;
        if (this.tracks.has(trackId)) return; // Evita carregar duplicado

        const track = new Howl({
          src: [url],
          loop: category === 'AMBIENT',
          volume: category === 'AMBIENT' ? this.audioState.ambientVolume : this.audioState.sfxVolume,

          html5: false, // <--- A MÁGICA: Ao forçar false, ele faz download total (Status 200) e NUNCA usa o Pool do navegador!

          preload: true, // Força o download imediato
          onloaderror: (id, err) => console.warn(`Falha ao carregar [${url}]:`, id, err),
        });

        this.tracks.set(trackId, track);
      });
    }

    // Debug limpo para você ver o que carregou em cada estágio
    console.log(`AudioSystem carregou grupo [${categories.join(', ')}]. Chaves prontas:`, Array.from(this.tracks.keys()));
  }

  // Estágio 1: Menu
  public async initializeEssential() {
    await this.loadAssetsGroup(['AMBIENT']);
    this.isInitialized = true;
  }

  // Estágio 2: Jogo Base
  public async initializeGameplay() {
    await this.loadAssetsGroup(['SFX', 'EVENTS']);
  }


  // --- RECUPERAÇÃO E CONTEXTO ---
  private getTrack(id: string) {
    const normalizedId = id.toLowerCase();
    return this.tracks.get(normalizedId);
  }

  resumeAudioContext() {
    if (HowlerGlobal && HowlerGlobal.ctx && HowlerGlobal.ctx.state === 'suspended') {
      HowlerGlobal.ctx.resume();
    }
  }

  // --- CONTROLES DE ÁUDIO ---
  startAmbient() {
    if (!this.isInitialized) { setTimeout(() => this.startAmbient(), 500); return; }
    const track = this.getTrack('sfx.buzzing_light')
    if (track && !track.playing()) { track.loop(true); track.play(); }
  }

  startSoundtrack() {
    if (!this.isInitialized) { setTimeout(() => this.startSoundtrack(), 500); return; }
    const track = this.getTrack('ambient.music_level_suburbs')
    if (track && !track.playing()) { track.loop(true); track.play(); }
  }

  stopAmbient() { this.getTrack('sfx.buzzing_light')?.stop() }
  stopSoundtrack() { this.getTrack('ambient.music_level_suburbs')?.stop() }

  startMenuMusic() {
    if (!this.isInitialized) { setTimeout(() => this.startMenuMusic(), 500); return; }
    const track = this.getTrack('ambient.music_menu_main')
    if (track && !track.playing()) { track.loop(true); track.play(); }
  }

  stopMenuMusic() {
    const track = this.getTrack('ambient.music_menu_main')
    if (track) {
      track.fade(track.volume() as number, 0, 1000)
      setTimeout(() => track.stop(), 1000)
    }
  }

  playSFX(eventId: string, volume: number = 1) {
    const now = Date.now();
    const lastPlay = this.lastPlayTimes.get(eventId) || 0;

    // Limite: não toca o mesmo som se ele foi tocado nos últimos 100ms
    if (now - lastPlay < 100) return;

    const key = eventId.toLowerCase();
    const track = this.getTrack(`sfx.${key}`) || this.getTrack(`events.${key}`);

    if (track) {
      track.volume(volume * this.audioState.sfxVolume * this.audioState.masterVolume);
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

// ==========================================
// SINGLETON À PROVA DE HOT-RELOAD (NEXT.JS)
// ==========================================

// Cria um espaço seguro no objeto global que não é apagado quando você salva o arquivo
const globalForAudio = globalThis as unknown as { audioSystemInstance: AudioSystem | null };

export function getAudioSystem(): AudioSystem {
  if (typeof window === 'undefined') {
    // Se estiver rodando no servidor (SSR), retorna uma instância inútil só para não quebrar
    return new AudioSystem();
  }

  // Se não existir no globalThis, cria a primeira vez
  if (!globalForAudio.audioSystemInstance) {
    globalForAudio.audioSystemInstance = new AudioSystem();
  }

  // Retorna sempre a mesma instância, não importa quantos Ctrl+S você dê
  return globalForAudio.audioSystemInstance;
}