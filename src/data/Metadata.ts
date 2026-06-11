import { ASSETS } from '@/config/Constants';
import { BLOCKS } from '@/utils/MapGenerator';

interface BlockMeta {
  nome: string;
  walkable: boolean;
  texture?: string;
  color: string;
  anxietyMultiplier: number;
  isSpawn: boolean;
  isHole: boolean;
  isInvisible: boolean;
  isExit: boolean;
  transparent?: boolean;
}

const BASE_META: Omit<BlockMeta, 'nome' | 'walkable' | 'anxietyMultiplier'> = {
  color: '#ffffff',
  isSpawn: false,
  isHole: false,
  isInvisible: false,
  isExit: false,
};

export const metadata: Record<number, BlockMeta> = {

  [BLOCKS.FLOOR]: {
    ...BASE_META,
    nome: "Chão",
    walkable: true,
    texture: ASSETS.TEXTURES.CARPET,
    anxietyMultiplier: 1.0,
  },

  [BLOCKS.WALL]: {
    ...BASE_META,
    nome: "Parede",
    walkable: false,
    texture: ASSETS.TEXTURES.WALLPAPER,
    anxietyMultiplier: 1.0,
    transparent: false,
  },

  [BLOCKS.DARK_ALLEY]: {
    ...BASE_META,
    nome: "Sem Saída",
    walkable: true,
    texture: ASSETS.TEXTURES.CARPET,
    anxietyMultiplier: 2.5,
    isInvisible: true,
  },

  [BLOCKS.EXIT_PATH]: {
    ...BASE_META,
    nome: "Limiar",
    walkable: true,
    anxietyMultiplier: 5.0,
    isInvisible: true 
  },

  [BLOCKS.SPAWN]: {
    ...BASE_META,
    nome: "Spawn",
    walkable: true,
    texture: ASSETS.TEXTURES.CARPET,
    anxietyMultiplier: 2.5,
    isSpawn: true,
    isInvisible: true,
  },

  [BLOCKS.EXIT]: {
    ...BASE_META,
    nome: "Saida",
    walkable: true,
    texture: ASSETS.TEXTURES.DOORWAY,
    anxietyMultiplier: 1.0,
    isExit: true,
  },

};