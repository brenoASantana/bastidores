import { BLOCK_SIZE } from '@/data/constants'
import { mapMatrix as defaultMapMatrix } from '@/data/map'
import { useMemo } from 'react'
import { FluorescentLight } from './FluorescentLight'
import { Block } from './Block'
import { metadata as defaultMetaData } from '@/data/metadata'
import { FloorAndCeiling } from './EnvironmentBounds'

interface LevelRendererProps {
  mapMatrix?: number[][]
}

export default function LevelRenderer({ mapMatrix = defaultMapMatrix }: LevelRendererProps) {

  // 1. Movemos o cálculo das dimensões para fora do useMemo
  // Agora o componente inteiro sabe o tamanho do mapa!
  const height = mapMatrix.length
  const width = mapMatrix[0]?.length || 0

  const { mapMeshes, mapLights } = useMemo(() => {
    const meshes: JSX.Element[] = []
    const lights: JSX.Element[] = []

    mapMatrix.forEach((row, rowIndex) => {
      row.forEach((blockId, colIndex) => {

        const worldX = (colIndex - width / 2 + 0.5) * BLOCK_SIZE
        const worldZ = (rowIndex - height / 2 + 0.5) * BLOCK_SIZE

        if (blockId === 0) {
          if ((rowIndex + colIndex) % 2 === 0) {
            lights.push(
              <FluorescentLight
                key={`light-${rowIndex}-${colIndex}`}
                position={[worldX, 2.0, worldZ]}
                intensity={1.8}
                distance={BLOCK_SIZE * 2.5}
              />
            )
          }
          return
        }

        const blockMeta = defaultMetaData[String(blockId) as keyof typeof defaultMetaData]

        meshes.push(
          <mesh key={`block-${rowIndex}-${colIndex}`} position={[worldX, 1.5, worldZ]}>
            <boxGeometry args={[BLOCK_SIZE, 3, BLOCK_SIZE]} />
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
      {/* 2. Injetamos o Chão e o Teto usando as dimensões recém-calculadas */}
      <FloorAndCeiling mapWidth={width} mapHeight={height} />

      {mapMeshes}
      <group name="procedural-lights">
        {mapLights}
      </group>
    </group>
  )
}