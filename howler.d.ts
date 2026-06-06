declare module 'howler' {
  export interface HowlOptions {
    src: string[]
    loop?: boolean
    volume?: number
    html5?: boolean
    onloaderror?: (id: number, error: Error) => void
  }

  export class Howl {
    constructor(options: HowlOptions)
    volume(value?: number): number | this
    play(id?: number): number | this
    stop(id?: number): this
    playing(id?: number): boolean

    // Método para controle de fade
    fade(from: number, to: number, duration: number, id?: number): this

    // Método para controle de loop
    loop(value?: boolean, id?: number): boolean | this
  }
}