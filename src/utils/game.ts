export interface GameState {
  state: 'boot' | 'menu' | 'playing' | 'failed' | 'completed'
  anxiety: AnxietyState
  objectives: number
  maxObjectives: number
  timeSpent: number
  isPaused: boolean
}

export interface AnxietyState{
  level: number,
  multiplier: number,
}

export interface Player {
  position: [number, number, number]
  rotation: [number, number]
  velocity: [number, number, number]
  isMoving: boolean
}

export interface HorrorEvent {
  id: string
  type: 'audio' | 'visual' | 'spatial'
  cooldown: number
  probability: number
  triggered: boolean
}

export interface AudioState {
  masterVolume: number
  ambientVolume: number
  sfxVolume: number
  anxietyLevel: number
}
