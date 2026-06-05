import type { LevelDefinition } from '@/utils/world'

export const TEST_ROOM_LEVEL: LevelDefinition = {
  id: 'test-square-room',
  name: 'Sala Quadrada de Teste',
  spawn: [0, 1.6, 0],
  bounds: {
    minX: -10,
    maxX: 10,
    minZ: -10,
    maxZ: 10,
  },
  safeZoneRadius: 3.5,
  openZoneRadius: 8,
  exitZone: {
    minX: -1.5,
    maxX: 1.5,
    minZ: 7.25,
    maxZ: 9,
  },
  geometry: [
    {
      id: 'test-room-floor',
      kind: 'floor',
      position: [0, 0, 0],
      size: [20, 0.2, 20],
      material: {
        color: '#d4c4b0',
        roughness: 0.8,
        metalness: 0,
      },
      receiveShadow: true,
    },
    {
      id: 'test-room-ceiling',
      kind: 'ceiling',
      position: [0, 3, 0],
      size: [20, 0.2, 20],
      material: {
        color: '#a89880',
        roughness: 0.75,
        metalness: 0,
      },
      receiveShadow: true,
    },
    {
      id: 'test-room-north-wall',
      kind: 'wall',
      position: [0, 1.5, -9.75],
      size: [20, 3, 0.5],
      material: {
        color: '#c0b0a0',
        roughness: 0.85,
        metalness: 0,
      },
      castShadow: true,
    },
    {
      id: 'test-room-south-wall',
      kind: 'wall',
      position: [0, 1.5, 9.75],
      size: [20, 3, 0.5],
      material: {
        color: '#c0b0a0',
        roughness: 0.85,
        metalness: 0,
      },
      castShadow: true,
    },
    {
      id: 'test-room-east-wall',
      kind: 'wall',
      position: [9.75, 1.5, 0],
      size: [1, 1, 1],
      material: {
        color: '#c0b0a0',
        roughness: 0.85,
        metalness: 0,
      },
      castShadow: true,
    },
    {
      id: 'test-room-west-wall',
      kind: 'wall',
      position: [-9.75, 1.5, 0],
      size: [0.5, 3, 20],
      material: {
        color: '#c0b0a0',
        roughness: 0.85,
        metalness: 0,
      },
      castShadow: true,
    },
  ],
  objectiveSpawns: [
    {
      id: 'test-objective-1',
      position: [5.5, 1.5, 5.5],
      radius: 1.5,
    },
    {
      id: 'test-objective-2',
      position: [-5.5, 1.5, 4],
      radius: 1.5,
    },
    {
      id: 'test-objective-3',
      position: [2.5, 1.5, -5.5],
      radius: 1.5,
    },
  ],
}