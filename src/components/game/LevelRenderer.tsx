'use client'

import { WORLD } from '@/config/Constants';
import { mapMatrix as defaultMapMatrix } from '@/data/Map';
import { metadata as defaultMetaData } from '@/data/Metadata';
import { useMemo } from 'react';
import { Block } from './Block';
import { EnvironmentBounds } from './EnvironmentBounds';
import { FluorescentLight } from './FluorescentLight';

interface LevelRendererProps {
  mapMatrix?: number[][]
}

export default function LevelRenderer({ mapMatrix = defaultMapMatrix }: LevelRendererProps) {
  const height = mapMatrix.length
  const width = mapMatrix[0]?.length || 0

  const { mapMeshes, mapLights } = useMemo(() => {
    const meshes: JSX.Element[] = []
    const lights: JSX.Element[] = []

    mapMatrix.forEach((row, rowIndex) => {
      row.forEach((blockId, colIndex) => {

        const worldX = (colIndex - width / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE
        const worldZ = (rowIndex - height / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE

        if (blockId === 0) {
          if ((rowIndex + colIndex) % 2 === 0) {
            lights.push(
              <FluorescentLight
                key={`light-${rowIndex}-${colIndex}`}
                // CORREÇÃO 1: A luz deve ficar presa ao teto (WALL_HEIGHT), não ao GRID_BLOCK_SIZE.
                // Se a parede tem 4.5m, a luz deve estar em 4.0m (meio metro abaixo do teto)
                position={[worldX, WORLD.STRUCTURE_WALL_HEIGHT - 0.5, worldZ]}
                intensity={1.8}
                distance={WORLD.GRID_BLOCK_SIZE * 2.5}
              />
            )
          }
          return
        }

        const blockMeta = defaultMetaData[String(blockId) as keyof typeof defaultMetaData]

        meshes.push(
          // Posição Y (Altura) é metade da altura da parede para o cubo nascer no chão
          <mesh key={`block-${rowIndex}-${colIndex}`} position={[worldX, WORLD.STRUCTURE_WALL_HEIGHT / 2, worldZ]}>
            {/* CORREÇÃO 2: boxGeometry args -> [Largura (X), Altura (Y), Profundidade (Z)] */}
            {/* Antes estava: [GRID, HEIGHT, HEIGHT], o que deixava as paredes achatadas no eixo Z! */}
            <boxGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.STRUCTURE_WALL_HEIGHT, WORLD.GRID_BLOCK_SIZE]} />
            <Block
              textureUrl={blockMeta?.texture}
              color={blockMeta?.color || '#777777'}
            />
          </mesh>
        )
      })
    })

    return { mapMeshes: meshes, mapLights: lights }
  }, [mapMatrix, height, width])

  return (
    <group name="level-geometry">
      <EnvironmentBounds mapWidth={width} mapHeight={height} />
      {mapMeshes}
      <group name="procedural-lights">
        {mapLights}
      </group>
    </group>
  )
}