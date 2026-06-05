import { GAME_CONFIG } from '@/components/data/constants'
import type { AnxietyState, GameState, Player } from '@/utils/game'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface GameStore {
  gameState: GameState
  player: Player
  setGameState: (state: GameState['state']) => void
  incrementTime: (ms: number) => void
  resetGame: () => void
}

const initialAnxiety: AnxietyState = {
  level: 0,
  multiplier: 1.0,

}

const initialGameState: GameState = {
  state: 'boot',
  anxiety: initialAnxiety,
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

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set) => ({
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
          anxiety: {
            ...prev.gameState.anxiety,
            level: Math.min(
              GAME_CONFIG.MAX_ANXIETY,
              Math.max(0, prev.gameState.anxiety.level + delta)
            ),
          },
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
)
