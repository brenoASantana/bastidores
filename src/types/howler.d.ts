declare module 'howler' {
  export interface HowlOptions {
    src: string[]
    loop?: boolean
    volume?: number
    html5?: boolean
    onloaderror?: () => void
  }

  export class Howl {
    constructor(options: HowlOptions)
    volume(value?: number): number | this
    play(): number | this
    stop(): this
    playing(): boolean
  }
}