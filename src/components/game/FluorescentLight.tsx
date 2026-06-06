'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PointLight, MeshStandardMaterial, Color } from 'three'
import { useTexture } from '@react-three/drei'
import { LAMP_URL } from '@/config/constants'

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

    const lampTex = useTexture(LAMP_URL)
    lampTex.magFilter = 1003
    lampTex.minFilter = 1003

    useFrame(() => {
        if (!lightRef.current || !isMain) return

        if (Math.random() > 0.98) {
            const flickerIntensity = (isMain ? 1.2 : intensity) * (Math.random() * 0.5 + 0.5)

            // A luz ambiente falha...
            lightRef.current.intensity = flickerIntensity
            // ...e a textura da lâmpada apaga junto!
            if (matRef.current) matRef.current.emissiveIntensity = flickerIntensity
        } else {
            lightRef.current.intensity = isMain ? 1.2 : intensity
            if (matRef.current) matRef.current.emissiveIntensity = isMain ? 1.2 : intensity
        }
    })

    return (
        <group position={position}>

            {/* 1. O FÓTON INVISÍVEL (Joga luz nas paredes e chão) */}
            <pointLight
                ref={lightRef}
                intensity={isMain ? 1.2 : intensity}
                distance={isMain ? 50 : distance}
                decay={2}
                color={isMain ? "#e8e8e0" : color}
                // Descemos a emissão de luz levemente para ela não ser engolida pelo teto
                position={[0, -0.5, 0]}
            />

            {/* 2. O CORPO FÍSICO DA LÂMPADA (A textura que o jogador vê olhando pra cima) */}
            <mesh
                position={[0, 0.49, 0]} // Sobe para encostar milimetricamente no teto
                rotation={[Math.PI / 2, 0, 0]} // Deita a placa de bruços para o jogador
            >
                {/* Uma placa quadrada de 3x3 metros */}
                <planeGeometry args={[3, 3]} />
                <meshStandardMaterial
                    ref={matRef}
                    map={lampTex}
                    color="#ffffff"
                    emissive={new Color(color)} // Faz a própria textura emitir brilho visual
                    emissiveMap={lampTex}
                    emissiveIntensity={isMain ? 1.2 : intensity}
                    toneMapped={false} // Evita que os filtros da câmera escureçam o neon
                />
            </mesh>

        </group>
    )
}