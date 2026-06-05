import { useMemo } from 'react'
import { BLOCK_SIZE } from '@/'
import from '@/

export default function LevelRenderer({ mapMatrix, metadata }) {

  // O useMemo garante que o laboratório de blocos só seja calculado UMA VEZ
  const mapMeshes = useMemo(() => {
    const meshes = []

    // Varremos a matriz bidimensional
    mapMatrix.forEach((row, rowIndex) => {
      row.forEach((blockId, colIndex) => {

        const blockMeta = metadata[blockId]

        // Se for um bloco vazio (chão livre sem malha), pulamos
        if (!blockMeta || blockMeta.kind === 'empty') return

        // DESAFIO MATEMÁTICO: Calcular X e Z reais
        const worldX = /* ??? */
        const worldZ = /* ??? */

        // Empurramos o JSX da malha para a nossa lista
        meshes.push(
          <mesh key={`block-${rowIndex}-${colIndex}`} position={[worldX, 1.5, worldZ]}>
            <boxGeometry args={[BLOCK_SIZE, 3, BLOCK_SIZE]} />
            <meshStandardMaterial color={blockMeta.color} />
          </mesh>
        )
      })
    })

    return meshes
  }, [mapMatrix, metadata])

  // O componente apenas retorna o array de malhas prontas
  return <group name="level-geometry">{mapMeshes}</group>
}