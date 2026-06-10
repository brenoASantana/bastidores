import { ASSETS } from '@/config/Constants';
import { BLOCKS } from '@/utils/MapGenerator'; // Reutiliza o gabarito central de blocos

// 1. Definição da estrutura para garantir que nenhum campo seja esquecido
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

// 2. Modelo Base: Define o comportamento padrão da maioria dos blocos.
// Isso evita que você precise digitar "isSpawn: false, isHole: false..." em todo elemento.
const BASE_META: Omit<BlockMeta, 'nome' | 'walkable' | 'anxietyMultiplier'> = {
  color: '#ffffff',
  isSpawn: false,
  isHole: false,
  isInvisible: false,
  isExit: false,
};

// 3. O Dicionário de Metadados Centralizado
// Usamos as chaves dinâmicas [BLOCKS.X] para eliminar os números mágicos de texto ("0", "1", "3"...)
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
    isInvisible: true, // Sobrescreve o padrão do BASE_META
  },

  [BLOCKS.EXIT_PATH]: {
    ...BASE_META,
    nome: "Limiar",
    walkable: true,
    anxietyMultiplier: 5.0, // Ansiedade crítica!
    isInvisible: true      // Escuridão total
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