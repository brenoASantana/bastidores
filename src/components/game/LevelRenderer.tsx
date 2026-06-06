// 1. Não esqueça de importar a nova constante!
import { WORLD } from '@/config/Constants'
import { mapMatrix as defaultMapMatrix } from '@/data/Map'
import { useMemo } from 'react'
import { FluorescentLight } from './FluorescentLight'
import { Block } from './Block'
import { metadata as defaultMetaData } from '@/data/Metadata'
import { FloorAndCeiling } from './EnvironmentBounds'

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

        const worldX = (colIndex - width / 2 + 0.5) * WORLD.BLOCK_SIZE
        const worldZ = (rowIndex - height / 2 + 0.5) * WORLD.BLOCK_SIZE

        if (blockId === 0) {
          if ((rowIndex + colIndex) % 2 === 0) {
            lights.push(
              <FluorescentLight
                key={`light-${rowIndex}-${colIndex}`}
                // A luz agora fica presa perto do teto dinâmico (meio metro abaixo do teto)
                position={[worldX, WORLD.WALL_HEIGHT - 0.5, worldZ]}
                intensity={1.8}
                distance={WORLD.BLOCK_SIZE * 2.5}
              />
            )
          }
          return
        }

        const blockMeta = defaultMetaData[String(blockId) as keyof typeof defaultMetaData]

        meshes.push(
          // Posição Y passa a ser WALL_HEIGHT / 2
          <mesh key={`block-${rowIndex}-${colIndex}`} position={[worldX, WORLD.WALL_HEIGHT / 2, worldZ]}>
            {/* Altura da geometria passa a ser WALL_HEIGHT */}
            <boxGeometry args={[WORLD.BLOCK_SIZE, WORLD.WALL_HEIGHT, WORLD.BLOCK_SIZE]} />
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
      <FloorAndCeiling mapWidth={width} mapHeight={height} />
      {mapMeshes}
      <group name="procedural-lights">
        {mapLights}
      </group>
    </group>
  )
}