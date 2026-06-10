import { GAME, WORLD } from '@/config/Constants';
import { BLOCKS } from '@/utils/MapGenerator'; // <-- NOVO: Trazemos o dicionário oficial
import type { AnxietyState, GameState, PlayerState } from '@/utils/Game';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// 1. A FUNÇÃO AGORA ACEITA NULL E USA O 'BLOCKS.SPAWN' COMO PADRÃO
function getSpawnPosition(matrix: number[][] | null, spawnBlockId: number = BLOCKS.SPAWN): [number, number, number] {

  // Defesa CRÍTICA: Se o mapa ainda não existir (menu inicial), retorna o centro do mundo.
  if (!matrix || matrix.length === 0) {
    return [0, 1.6, 0];
  }

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
  currentMap: number[][] | null
  setMap: (map: number[][]) => void
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
  currentMap: null, // Guardamos a referência do mapa dinâmico aqui
}

const initialPlayer: PlayerState = {
  position: getSpawnPosition(null), // A função agora sobrevive ao Null tranquilamente!
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
    currentMap: null,

    // Atualiza o mapa E teletransporta o jogador para o Spawn correto do NOVO mapa!
    setMap: (map) => set((state) => ({
      currentMap: map,
      player: {
        ...state.player,
        position: getSpawnPosition(map)
      }
    })),

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

    // Ao dar reset, tenta ler o mapa dinâmico atual, se não existir, usa o default e reseta o jogador
    resetGame: () => set((state) => ({
      gameState: initialGameState,
      player: {
        ...initialPlayer,
        position: getSpawnPosition(state.currentMap),
      },
    })),
  }))
)