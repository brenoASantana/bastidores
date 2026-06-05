import { BLOCK_SIZE } from '@/data/constants'
import { mapMatrix as defaultMapMatrix } from '@/data/map'
import { useMemo } from 'react'

interface LevelRendererProps {
  mapMatrix?: number[][]
}

export default function LevelRenderer({ mapMatrix = defaultMapMatrix }: LevelRendererProps) {

  // O useMemo garante que o catálogo de malhas só seja calculado UMA VEZ
  const mapMeshes = useMemo(() => {
    const meshes: JSX.Element[] = []

    const height = mapMatrix.length
    const width = mapMatrix[0]?.length || 0

    // Mapeamento simples de cores por tipo de bloco
    const colorsById: Record<number, string> = {
      1: '#7a7a7a', // parede
      2: '#8fbf8f', // passagem
      3: '#c09090', // sem-saida
      4: '#222222', // buraco
      5: '#8fcff0', // vidro
    }

    // Varremos a matriz bidimensional
    mapMatrix.forEach((row, rowIndex) => {
      row.forEach((blockId, colIndex) => {

        // Se for um bloco vazio (0: chão), pulamos
        if (blockId === 0) return

        // Calculamos a posição central do bloco no mundo, centralizando o mapa em (0,0)
        const worldX = (colIndex - width / 2 + 0.5) * BLOCK_SIZE
        const worldZ = (rowIndex - height / 2 + 0.5) * BLOCK_SIZE

        const color = colorsById[blockId] ?? '#777777'

        // Empurramos o JSX da malha para a nossa lista
        meshes.push(
          <mesh key={`block-${rowIndex}-${colIndex}`} position={[worldX, 1.5, worldZ]}>
            <boxGeometry args={[BLOCK_SIZE, 3, BLOCK_SIZE]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )
      })
    })

    return meshes
  }, [mapMatrix])

  // O componente apenas retorna o array de malhas prontas
  return <group name="level-geometry">{mapMeshes}</group>
}