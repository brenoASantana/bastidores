import { BLOCK_SIZE } from '@/data/constants'
import { mapMatrix as defaultMapMatrix } from '@/data/map'
import { useMemo } from 'react'
import { FluorescentLight } from './FluorescentLight'
import { Block } from './Block'
import { metadata as defaultMetaData } from '@/data/metadata'

interface LevelRendererProps {
  mapMatrix?: number[][]
}

export default function LevelRenderer({ mapMatrix = defaultMapMatrix }: LevelRendererProps) {

  const { mapMeshes, mapLights } = useMemo(() => {
    const meshes: JSX.Element[] = []
    const lights: JSX.Element[] = []

    // Vamos centralizar o mapa novamente para o jogador nascer no meio
    const height = mapMatrix.length
    const width = mapMatrix[0]?.length || 0

    mapMatrix.forEach((row, rowIndex) => {
      row.forEach((blockId, colIndex) => {

        // CORREÇÃO FUNDAMENTAL: Transformando Índice em Metros no Mundo 3D
        // colIndex = Eixo X (Esquerda/Direita)
        // rowIndex = Eixo Z (Frente/Trás)
        const worldX = (colIndex - width / 2 + 0.5) * BLOCK_SIZE
        const worldZ = (rowIndex - height / 2 + 0.5) * BLOCK_SIZE

        // Se for um bloco vazio (0: chão)
        if (blockId === 0) {
          if ((rowIndex + colIndex) % 2 === 0) {
            lights.push(
              <FluorescentLight
                key={`light-${rowIndex}-${colIndex}`}
                // Usa o worldX e worldZ calculados
                position={[worldX, 2.0, worldZ]}
                // Intensidade forte para preencher os 9 metros do corredor
                intensity={1.8}
                distance={BLOCK_SIZE * 2.5}
              />
            )
          }
          return
        }

        // Se for parede (blockId > 0)
        const blockMeta = defaultMetaData[String(blockId) as keyof typeof defaultMetaData]

        meshes.push(
          // Usa o worldX e worldZ para separar os blocos de 9 em 9 metros
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
  }, [mapMatrix])

  return (
    <group name="level-geometry">
      {mapMeshes}
      <group name="procedural-lights">
        {mapLights}
      </group>
    </group>
  )
}