'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PointLight } from 'three'

interface FluorescentLightProps {
    position: [number, number, number]
    intensity?: number
    color?: string
    distance?: number
    isMain?: boolean
}

export function FluorescentLight({
    position,
    intensity = 0.9,
    color = "#d0d0c8",
    distance = 30,
    isMain = false
}: FluorescentLightProps) {
    const lightRef = useRef<PointLight>(null)

    // Este loop nos permitirá fazer a luz piscar no futuro baseado na ansiedade do jogador
    useFrame(({ clock }) => {
        // SE a luz não carregou OU SE ela NÃO for a principal, aborte a função aqui.
        // Isso salva o FPS do jogo, pois 99% das luzes não vão rodar o cálculo abaixo.
        if (!lightRef.current || !isMain) return

        const time = clock.elapsedTime

        // Mistura de duas ondas senoidais em frequências diferentes + um ruído caótico
        const badContact = Math.sin(time * 10) * Math.sin(time * 25) + Math.random() * 0.2

        // Se o defeito atingir um pico alto, a lâmpada falha
        if (badContact > 0.6) {
            // Reduz o brilho drasticamente
            lightRef.current.intensity = (isMain ? 1.2 : intensity) * 0.3
        } else {
            // Brilho normal
            lightRef.current.intensity = isMain ? 1.2 : intensity
        }
    })

    return (
        <pointLight
            ref={lightRef}
            position={position}
            intensity={isMain ? 1.2 : intensity}
            distance={isMain ? 50 : distance}
            decay={2}
            color={isMain ? "#e8e8e0" : color}
        />
    )
}