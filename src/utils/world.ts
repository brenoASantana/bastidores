export type WorldObjectKind = 'floor' | 'wall' | 'ceiling' | 'light'

export interface WorldTransform {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

export interface WorldMaterial {
  color?: string
  texture?: string
  roughness?: number
  metalness?: number
  emissive?: string
  emissiveIntensity?: number
}

export interface StaticWorldObject extends WorldTransform {
  id: string
  kind: WorldObjectKind
  size: [number, number, number]
  material: WorldMaterial
  castShadow?: boolean
  receiveShadow?: boolean
}

export interface LevelBounds {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export interface ObjectiveSpawn {
  id: string
  position: [number, number, number]
  radius: number
}

export interface LevelDefinition {
  id: string
  name: string
  spawn: [number, number, number]
  bounds: LevelBounds
  safeZoneRadius: number
  openZoneRadius: number
  exitZone: LevelBounds
  geometry: StaticWorldObject[]
  objectiveSpawns: ObjectiveSpawn[]
}