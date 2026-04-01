'use client'

import React, { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { MAP_CONFIG } from '@/config/constants'
import MapGeometry from './MapGeometry'
import ObjectiveMarkers from './ObjectiveMarkers'

export default function GameScene() {
  return (
    <>
      {/* Iluminação base */}
      <ambientLight intensity={0.2} color="#f5f5f5" />

      {/* Luz de fluorescente instável (principal) */}
      <pointLight
        position={[0, 2.5, 0]}
        intensity={1.2}
        distance={50}
        decay={2}
        color="#e8e8e0"
      />

      {/* Luzes adicionais em corredores */}
      <pointLight
        position={[10, 2.5, 10]}
        intensity={0.9}
        distance={30}
        decay={2}
        color="#d0d0c8"
      />
      <pointLight
        position={[-10, 2.5, -10]}
        intensity={0.9}
        distance={30}
        decay={2}
        color="#d0d0c8"
      />

      {/* Mapa principal */}
      <MapGeometry />

      {/* Marcadores de objetivo */}
      <ObjectiveMarkers />
    </>
  )
}
