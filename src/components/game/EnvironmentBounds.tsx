'use client'

import { ASSETS, WORLD } from '@/config/Constants';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface BoundsProps {
    mapWidth: number
    mapHeight: number
}

export function EnvironmentBounds({ mapWidth, mapHeight }: BoundsProps) {

    const floorTex = useTexture(ASSETS.TEXTURES.CARPET)
    const ceilingTex = useTexture(ASSETS.TEXTURES.CEILING)

        ;[floorTex, ceilingTex].forEach((tex) => {
            tex.wrapS = THREE.RepeatWrapping
            tex.wrapT = THREE.RepeatWrapping
            tex.magFilter = THREE.NearestFilter
            tex.minFilter = THREE.NearestFilter
            tex.repeat.set(mapWidth * 3, mapHeight * 3)
        })

    const totalWidth = mapWidth * WORLD.GRID_BLOCK_SIZE
    const totalDepth = mapHeight * WORLD.GRID_BLOCK_SIZE

    return (
        <group name="environment-bounds">
            {/* O CHÃO continua no 0 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[totalWidth, totalDepth]} />
                <meshStandardMaterial map={floorTex} color="#aaaaaa" roughness={0.9} />
            </mesh>

            {/* O TETO agora flutua dinamicamente na altura máxima da parede */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WORLD.STRUCTURE_WALL_HEIGHT, 0]}>
                <planeGeometry args={[totalWidth, totalDepth]} />
                <meshStandardMaterial map={ceilingTex} color="#888888" roughness={1} />
            </mesh>
        </group>
    )
}