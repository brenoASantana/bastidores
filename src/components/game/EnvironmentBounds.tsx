'use client'

import { WORLD, ASSETS } from '@/config/Constants';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface BoundsProps {
    mapWidth: number
    mapHeight: number
}

export function EnvironmentBounds({ mapWidth, mapHeight }: BoundsProps) {
    const floorTex = useTexture(ASSETS.TEXTURES.CARPET);
    const ceilingTex = useTexture(ASSETS.TEXTURES.CEILING);
    floorTex.colorSpace = 'srgb';
    ceilingTex.colorSpace = 'srgb';

    [floorTex, ceilingTex].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        // Ajuste a repetição para combinar com o tamanho do grid
        tex.repeat.set(mapWidth, mapHeight);
    });

    const totalWidth = mapWidth * WORLD.GRID_BLOCK_SIZE;
    const totalDepth = mapHeight * WORLD.GRID_BLOCK_SIZE;

    return (
        <group name="environment-bounds">
            {/* O CHÃO: Levemente abaixo do 0 para não brigar com as instâncias */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                <planeGeometry args={[totalWidth, totalDepth]} />
                {/* SEM a propriedade color, ele vai renderizar apenas a textura */}
                <meshStandardMaterial map={floorTex} roughness={1} />
            </mesh>

            {/* O TETO: No topo da estrutura */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WORLD.STRUCTURE_WALL_HEIGHT, 0]}>
                <planeGeometry args={[totalWidth, totalDepth]} />
                <meshStandardMaterial map={ceilingTex} color="#aaaaaa" roughness={1} />
            </mesh>
        </group>
    )
}