import { GAME } from '@/config/Constants'
import type { AnxietyState, GameState, Player } from '@/utils/Game'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface GameStore {
  gameState: GameState
  player: Player
  setGameState: (state: GameState['state']) => void
  updateAnxiety: (count: number) => void
  setPaused: (paused: boolean) => void
  incrementTime: (ms: number) => void
  resetGame: () => void
}

const initialAnxiety: AnxietyState = {
  level: 0,
  multiplier: 1.0,

}

const initialGameState: GameState = {
  state: 'menu',
  anxiety: initialAnxiety,
  timeSpent: 0,
  isPaused: false,
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

    updateAnxiety: (delta: number) =>
      set((prev) => ({
        gameState: {
          ...prev.gameState,
          anxiety: {
            ...prev.gameState.anxiety,
            level: Math.min(
              GAME.ANXIETY.MAX,
              Math.max(0, prev.gameState.anxiety.level + delta)
            ),
          },
        },
      })),

    setPaused: (paused: boolean) =>
      set((state) => ({
        gameState: { ...state.gameState, isPaused: paused }
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
