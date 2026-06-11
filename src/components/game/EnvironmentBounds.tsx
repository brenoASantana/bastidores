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

    // Garante que a textura repita perfeitamente acompanhando o grid
    [floorTex, ceilingTex].forEach((tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.repeat.set(mapWidth, mapHeight);
    });

    const totalWidth = mapWidth * WORLD.GRID_BLOCK_SIZE;
    const totalDepth = mapHeight * WORLD.GRID_BLOCK_SIZE;

    return (
        <group name="environment-bounds">
            {/* CHÃO GIGANTE DEFINITIVO */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[totalWidth, totalDepth]} />
                <meshLambertMaterial map={floorTex} emissive="#222222" emissiveIntensity={0.2} />
            </mesh>

            {/* TETO GIGANTE DEFINITIVO */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WORLD.STRUCTURE_WALL_HEIGHT, 0]}>
                <planeGeometry args={[totalWidth, totalDepth]} />
                <meshLambertMaterial map={ceilingTex} emissive="#111111" emissiveIntensity={0.1} />
            </mesh>
        </group>
    )
}