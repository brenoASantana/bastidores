import { create } from 'zustand'
import type { GameState, Player } from '@/types/game'
import { GAME_CONFIG, PLAYER_CONFIG } from '@/config/constants'

interface GameStore {
  gameState: GameState
  player: Player
  setGameState: (state: GameState['state']) => void
  updateAnxiety: (delta: number) => void
  updateObjectives: (count: number) => void
  updatePlayerPosition: (pos: [number, number, number]) => void
  updatePlayerRotation: (rot: [number, number]) => void
  updatePlayerVelocity: (vel: [number, number, number]) => void
  updatePlayerMoving: (moving: boolean) => void
  incrementTime: (ms: number) => void
  resetGame: () => void
}

const initialGameState: GameState = {
  state: 'boot',
  anxiety: 0,
  objectives: 0,
  maxObjectives: 3,
  timeSpent: 0,
}

const initialPlayer: Player = {
  position: [0, 1.6, 0],
  rotation: [0, 0],
  velocity: [0, 0, 0],
  isMoving: false,
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: initialGameState,
  player: initialPlayer,

  setGameState: (state) =>
    set((prev) => ({
      gameState: { ...prev.gameState, state },
    })),

  updateAnxiety: (delta) =>
    set((prev) => ({
      gameState: {
        ...prev.gameState,
        anxiety: Math.min(
          GAME_CONFIG.MAX_ANXIETY,
          Math.max(0, prev.gameState.anxiety + delta)
        ),
      },
    })),

  updateObjectives: (count) =>
    set((prev) => ({
      gameState: {
        ...prev.gameState,
        objectives: Math.min(GAME_CONFIG.MAX_OBJECTIVES, count),
      },
    })),

  updatePlayerPosition: (pos) =>
    set((prev) => ({
      player: { ...prev.player, position: pos },
    })),

  updatePlayerRotation: (rot) =>
    set((prev) => ({
      player: { ...prev.player, rotation: rot },
    })),

  updatePlayerVelocity: (vel) =>
    set((prev) => ({
      player: { ...prev.player, velocity: vel },
    })),

  updatePlayerMoving: (moving) =>
    set((prev) => ({
      player: { ...prev.player, isMoving: moving },
    })),

  incrementTime: (ms) =>
    set((prev) => ({
      gameState: {
        ...prev.gameState,
        timeSpent: prev.gameState.timeSpent + ms,
      },
    })),

  resetGame: () => ({
    gameState: initialGameState,
    player: initialPlayer,
  }),
}))
