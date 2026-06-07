import { GAME, WORLD } from '@/config/Constants'
import type { AnxietyState, GameState, Player } from '@/utils/Game'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { mapMatrix as defaultMapMatrix } from '@/data/Map'

// --- NOVA FUNÇÃO: Calculadora de Spawn ---
function getSpawnPosition(matrix: number[][], spawnBlockId: number = 10): [number, number, number] {
  const height = matrix.length;
  const width = matrix[0]?.length || 0;

  // Varre a matriz procurando o bloco de spawn
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (matrix[row][col] === spawnBlockId) {
        // Encontrou! Agora converte [linha, coluna] para 3D [X, Z]
        // É a mesma matemática que usamos no LevelRenderer para posicionar os blocos
        const worldX = (col - width / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;
        const worldZ = (row - height / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;

        // Retorna a posição X, Altura da Câmera (1.6m), e Z
        return [worldX, 1.6, worldZ];
      }
    }
  }

  // Fallback: Se você esquecer de colocar o bloco 10 no mapa, ele nasce no centro
  console.warn(`Bloco de Spawn (${spawnBlockId}) não encontrado no mapa! Usando posição padrão [0, 1.6, 0].`);
  return [0, 1.6, 0];
}

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
  position: getSpawnPosition(defaultMapMatrix, 10),
  rotation: [0, 0],
  velocity: [0, 0, 0],
  isMoving: false,
  isRunning: false,
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
        position: getSpawnPosition(defaultMapMatrix, 10), // Recalcula ao morrer
      },
    })),
  }))
)