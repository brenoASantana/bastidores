'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointLight, MeshStandardMaterial, Color } from 'three'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { ASSETS } from '@/config/Constants'

interface FluorescentLightProps {
    position: [number, number, number]
    intensity?: number
    color?: string
    distance?: number
    isMain?: boolean
}

export function FluorescentLight({
    position,
    intensity = 1.8,
    color = "#e8e8e0",
    distance = 30,
    isMain = false
}: FluorescentLightProps) {
    const lightRef = useRef<PointLight>(null)
    const matRef = useRef<MeshStandardMaterial>(null)
    const { camera } = useThree()

    const lampTex = useTexture(ASSETS.TEXTURES.LAMP)

    // Configurações de textura corretas
    lampTex.colorSpace = THREE.SRGBColorSpace
    lampTex.magFilter = THREE.NearestFilter
    lampTex.minFilter = THREE.NearestFilter

    useFrame(() => {
        if (!lightRef.current || !isMain) return

        const dist = camera.position.distanceTo(lightRef.current.position);

        if (dist > 30) {
            lightRef.current.visible = false;
        } else {
            lightRef.current.visible = true;
        }

        if (Math.random() > 0.98) {
            const flickerIntensity = (isMain ? 1.2 : intensity) * (Math.random() * 0.5 + 0.5)

            lightRef.current.intensity = flickerIntensity
            if (matRef.current) matRef.current.emissiveIntensity = flickerIntensity
        } else {
            lightRef.current.intensity = isMain ? 1.2 : intensity
            if (matRef.current) matRef.current.emissiveIntensity = isMain ? 1.2 : intensity
        }
    })

    return (
        <group position={position}>

            {/* 1. O FÓTON INVISÍVEL */}
            <pointLight
                ref={lightRef}
                intensity={isMain ? 1.2 : intensity}
                distance={isMain ? 50 : distance}
                decay={2}
                color={isMain ? "#e8e8e0" : color}
                position={[0, -0.5, 0]}
                castShadow={false}
            />

            {/* 2. O CORPO FÍSICO DA LÂMPADA */}
            <mesh
                position={[0, -0.01, 0]}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[3, 3]} />
                <meshStandardMaterial
                    ref={matRef}
                    map={lampTex}
                    color="#ffffff"
                    emissive={new Color(color)}
                    emissiveMap={lampTex}
                    emissiveIntensity={isMain ? 1.2 : intensity}
                    toneMapped={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

        </group>
    )
}