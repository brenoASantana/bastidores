export type GamePhase = 'boot' | 'menu' | 'playing' | 'completed' | 'failed';

export type GameOverState = 'completed' | 'failed';

export interface GameState {
  state: GamePhase; // Esta é a ÚNICA variável que controla o fluxo
  timeSpent: number;
  anxiety: {
    level: number;
  };
  isPaused: boolean;
}

export interface AnxietyState {
  level: number,
  multiplier: number,
}

export interface Player {
  position: [number, number, number]
  rotation: [number, number]
  velocity: [number, number, number]
  isMoving: boolean
  isRunning: boolean
}

export interface MadnessEvent {
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
