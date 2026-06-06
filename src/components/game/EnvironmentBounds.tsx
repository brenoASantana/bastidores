'use client'

import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { BLOCK_SIZE } from '@/data/constants'
import { CARPET_URL, CEILING_URL } from '@/data/constants'

interface BoundsProps {
    mapWidth: number
    mapHeight: number
}

export function FloorAndCeiling({ mapWidth, mapHeight }: BoundsProps) {
    const floorTex = useTexture(CARPET_URL)
    const ceilingTex = useTexture(CEILING_URL)

        // 2. O Segredo do Ladrilho
        // Avisamos o motor para repetir a imagem em vez de esticar
        ;[floorTex, ceilingTex].forEach((tex) => {
            tex.wrapS = THREE.RepeatWrapping
            tex.wrapT = THREE.RepeatWrapping

            // Filtro 1003 para manter o visual 8-bit/Retrô afiado
            tex.magFilter = THREE.NearestFilter
            tex.minFilter = THREE.NearestFilter

            // Se 1 bloco tem 9 metros, repetimos a textura 3 vezes por bloco
            // para o carpete/teto não parecerem de gigantes.
            tex.repeat.set(mapWidth * 3, mapHeight * 3)
        })

    // 3. Calculamos o tamanho colossal do plano em metros
    const totalWidth = mapWidth * BLOCK_SIZE
    const totalDepth = mapHeight * BLOCK_SIZE

    return (
        <group name="environment-bounds">
            {/* O CHÃO */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]} // Deita o plano no chão
                position={[0, 0, 0]} // Exatamente no nível zero (pé do jogador)
            >
                <planeGeometry args={[totalWidth, totalDepth]} />
                {/* Usamos uma cor base levemente mais escura para o chão não brilhar tanto */}
                <meshStandardMaterial map={floorTex} color="#aaaaaa" roughness={0.9} />
            </mesh>

            {/* O TETO */}
            <mesh
                rotation={[Math.PI / 2, 0, 0]} // Inverte o plano para ele olhar para baixo
                position={[0, 3, 0]} // Altura exata da sua parede (lembra do args=[..., 3, ...])
            >
                <planeGeometry args={[totalWidth, totalDepth]} />
                <meshStandardMaterial map={ceilingTex} color="#888888" roughness={1} />
            </mesh>
        </group>
    )
}