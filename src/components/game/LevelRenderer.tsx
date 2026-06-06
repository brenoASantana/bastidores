import { BLOCK_SIZE } from '@/data/constants'
import { mapMatrix as defaultMapMatrix } from '@/data/map'
import { useMemo } from 'react'
import { Block } from './Block'
import { metadata as defaultMetaData } from '@/data/metadata'

interface LevelRendererProps {
  mapMatrix?: number[][]
}

export default function LevelRenderer({ mapMatrix = defaultMapMatrix }: LevelRendererProps) {

  // O useMemo garante que o catálogo de malhas só seja calculado UMA VEZ
  const mapMeshes = useMemo(() => {
    const meshes: JSX.Element[] = []

    const height = mapMatrix.length
    const width = mapMatrix[0]?.length || 0

    // Varremos a matriz bidimensional
    mapMatrix.forEach((row, rowIndex) => {
      row.forEach((blockId: number, colIndex) => {

        const blockMeta = defaultMetaData[String(blockId) as keyof typeof defaultMetaData]
        // Se for um bloco vazio (0: chão), pulamos
        if (blockId === 0) return

        // Calculamos a posição central do bloco no mundo, centralizando o mapa em (0,0)
        const worldX = (colIndex - width / 2 + 0.5) * BLOCK_SIZE
        const worldZ = (rowIndex - height / 2 + 0.5) * BLOCK_SIZE

        // const color = blockId === 1 ? '#7a7a7a' : '#777777' // parede ou chão

        // Empurramos o JSX da malha para a nossa lista
        meshes.push(
          <mesh key={`block-${rowIndex}-${colIndex}`} position={[worldX, 1.5, worldZ]}>
            <boxGeometry args={[BLOCK_SIZE, 3, BLOCK_SIZE]} />
            <Block
              textureUrl={blockMeta.texture}
              color={blockMeta.color || '#7a7a7a'}
            />
          </mesh>
        )
      })
    })

    return meshes
  }, [mapMatrix])

  // O componente apenas retorna o array de malhas prontas
  return <group name="level-geometry">{mapMeshes}</group>
}