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
        const isGlass = blockMeta?.isGlass;

        meshes.push(
          <mesh key={`block-${rowIndex}-${colIndex}`} position={[worldX, WORLD.STRUCTURE_WALL_HEIGHT / 2, worldZ]}>
            {/* Se for vidro, faz a profundidade ser apenas 0.5 (fino). Se for parede, tamanho normal */}
            <boxGeometry args={[
              WORLD.GRID_BLOCK_SIZE,
              WORLD.STRUCTURE_WALL_HEIGHT,
              isGlass ? 0.5 : WORLD.GRID_BLOCK_SIZE // <-- Condição de "bloco pequeno"
            ]} />

            {isGlass ? (
              // --- MATERIAL DE VIDRO ---
              <meshPhysicalMaterial
                color={blockMeta?.color || '#ffffff'}
                transparent={true}
                transmission={0.9} // Quanta luz passa (efeito de vidro real)
                opacity={1}
                roughness={0.1} // Vidro liso (ou aumente para vidro fosco)
                ior={1.5} // Índice de refração (distorce o que está do outro lado)
                thickness={0.5} // Espessura para a refração
              />
            ) : (
              // --- MATERIAL DE PAREDE NORMAL ---
              <Block
                textureUrl={blockMeta?.texture}
                color={blockMeta?.color || '#777777'}
              />
            )}
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