declare module 'howler' {
  export interface HowlOptions {
    src: string[]
    loop?: boolean
    volume?: number
    html5?: boolean
    onloaderror?: (id: number, error: Error) => void
    preload: boolean;
  }

  export class Howl {
    constructor(options: HowlOptions)
    volume(value?: number): number | this
    play(id?: number): number | this
    stop(id?: number): this
    playing(id?: number): boolean
    fade(from: number, to: number, duration: number, id?: number): this
    loop(value?: boolean, id?: number): boolean | this
  }

  // Adicionamos a definição do objeto global Howler aqui:
  export const Howler: {
    ctx: AudioContext;
    ctxState(): string;
    mute(muted: boolean): void;
    volume(vol?: number): number;
    html5PoolSize: number;
    autoSuspend: boolean;
    autoUnlock: boolean;
  };
}