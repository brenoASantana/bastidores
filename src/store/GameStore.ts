import { GAME, WORLD } from '@/config/Constants';
import { mapMatrix as defaultMapMatrix } from '@/data/Map';
import type { AnxietyState, GameState, PlayerState } from '@/utils/Game';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

function getSpawnPosition(matrix: number[][], spawnBlockId: number = 8): [number, number, number] {
  const height = matrix.length;
  const width = matrix[0]?.length || 0;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (matrix[row][col] === spawnBlockId) {
        const worldX = (col - width / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;
        const worldZ = (row - height / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;

        // Retorna a posição X, Altura da Câmera (1.6m), e Z
        return [worldX, 1.6, worldZ];
      }
    }
  }

  console.warn(`Bloco de Spawn (${spawnBlockId}) não encontrado no mapa! Usando posição padrão [0, 1.6, 0].`);
  return [0, 1.6, 0];
}

interface GameStore {
  gameState: GameState
  player: PlayerState
  updateStamina: (amount: number) => void
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

const initialPlayer: PlayerState = {
  position: getSpawnPosition(defaultMapMatrix, 8),
  rotation: [0, 0],
  velocity: [0, 0, 0],
  isMoving: false,
  isRunning: false,
  stamina: GAME.PLAYER.STAMINA_MAX,
}

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set) => ({
    gameState: initialGameState,
    player: initialPlayer,
    updateStamina: (amount) => set((state) => ({
      player: {
        ...state.player,
        stamina: Math.max(0, Math.min(GAME.PLAYER.STAMINA_MAX, state.player.stamina + amount))
      }
    })),
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
              GAME.ANXIETY.LEVEL_MAX,
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

    // O resetGame agora também recalcula o spawn para garantir que o jogador volte para o início correto!
    resetGame: () => set(() => ({
      gameState: initialGameState,
      player: {
        ...initialPlayer,
        position: getSpawnPosition(defaultMapMatrix, 8), // Recalcula ao morrer
      },
    })),
  }))
)