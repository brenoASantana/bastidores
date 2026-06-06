// 1. Tipos de blocos que a nossa factory consegue renderizar
export type BlockKind = 'floor' | 'wall' | 'glass' | 'void'

export interface BlockMaterial {
  color?: string
  texture?: string
  roughness?: number
  metalness?: number
  emissive?: string
  emissiveIntensity?: number
}

// 2. O antigo StaticWorldObject evoluiu para os Metadados do Bloco
// Isso dita AS REGRAS e a APARÊNCIA de um ID específico na Matriz
export interface BlockMetadata {
  kind: BlockKind
  walkable: boolean
  transparent: boolean
  anxietyMultiplier: number
  material: BlockMaterial
}

// 3. Mantemos as Bounds para colisões que ainda não migraram para o grid
export interface LevelBounds {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export interface ObjectiveSpawn {
  id: string
  // Mudança de Pleno: Usar [linha, coluna] da matriz facilita criar fases novas
  // do que ficar adivinhando o eixo X e Z no mundo 3D.
  gridPosition: [number, number]
  radius: number
}

// 4. O Coração do Level Design
export interface LevelDefinition {
  id: string
  name: string

  // === NOVO MOTOR PROCEDURAL ===
  mapMatrix: number[][] // A planta baixa do mapa
  blockDictionary: Record<number, BlockMetadata> // O dicionário que traduz os números

  // === COORDENADAS E REGRAS ===
  spawn: [number, number, number] // Posição 3D de início (Three.js)
  bounds: LevelBounds
  safeZoneRadius: number
  openZoneRadius: number
  exitZone: LevelBounds

  objectiveSpawns: ObjectiveSpawn[]
}