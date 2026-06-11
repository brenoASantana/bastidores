export type BlockKind = 'floor' | 'wall' | 'void'

export interface BlockMaterial {
  color?: string
  texture?: string
  roughness?: number
  metalness?: number
  emissive?: string
  emissiveIntensity?: number
}

export interface BlockMetadata {
  kind: BlockKind
  walkable: boolean
  transparent: boolean
  anxietyMultiplier: number
  material: BlockMaterial
}
export interface LevelBounds {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export interface ObjectiveSpawn {
  id: string
  gridPosition: [number, number]
  radius: number
}

export interface LevelDefinition {
  id: string
  name: string

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