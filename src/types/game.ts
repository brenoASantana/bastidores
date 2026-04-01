// Tipos centrais de gameplay
export interface GameState {
  state: 'boot' | 'menu' | 'playing' | 'failed' | 'completed'
  anxiety: number
  objectives: number
  maxObjectives: number
  timeSpent: number
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
  tensionVolume: number
  sfxVolume: number
  anxietyLevel: number
}
