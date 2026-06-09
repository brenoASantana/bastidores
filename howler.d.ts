declare module 'howler' {
  export interface HowlOptions {
    src: string[]
    loop?: boolean
    volume?: number
    html5?: boolean
    onloaderror?: (id: number, error: Error) => void
    preload: boolean
    stereo?: number // Propriedade de pan espacial nativa
  }

  export class Howl {
    constructor(options: HowlOptions)
    volume(value?: number): number | this
    play(id?: number): number | this
    stop(id?: number): this
    playing(id?: number): boolean
    fade(from: number, to: number, duration: number, id?: number): this
    loop(value?: boolean, id?: number): boolean | this
    rate(value: number): number | this

    // --- MÉTODOS DE ÁUDIO ESPACIAL (3D) ---
    pos(x: number, y: number, z: number, id?: number): this
    pos(id?: number): [number, number, number]
    stereo(pan: number, id?: number): this | number
    pannerAttr(
      options: {
        coneInnerAngle?: number;
        coneOuterAngle?: number;
        coneOuterGain?: number;
        distanceModel?: 'inverse' | 'linear' | 'exponential';
        maxDistance?: number;
        panningModel?: 'HRTF' | 'equalpower';
        refDistance?: number;
        rolloffFactor?: number;
      },
      id?: number
    ): this
  }

  export const Howler: {
    ctx: AudioContext;
    ctxState(): string;
    mute(muted: boolean): void;
    volume(vol?: number): number;
    html5PoolSize: number;
    autoSuspend: boolean;
    autoUnlock: boolean;
    masterGain: AudioParam;

    // --- MÉTODOS GLOBAIS DE ÁUDIO ESPACIAL (3D) ---
    pos(x: number, y: number, z: number): void;
    orientation(
      x: number, y: number, z: number,
      xUp: number, yUp: number, zUp: number
    ): void;
  };
}