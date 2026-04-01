'use client'

import React from 'react'
import { objectiveSystem } from '@/systems/objectiveSystem'

export default function ObjectiveMarkers() {
  const objectives = objectiveSystem.getObjectives()

  return (
    <group>
      {objectives.map((obj) => (
        !obj.collected && (
          <group key={obj.id} position={obj.position}>
            {/* Esfera do objetivo */}
            <mesh>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshStandardMaterial
                color="#ffaa00"
                emissive="#ff8800"
                emissiveIntensity={0.8}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>

            {/* Luz do objetivo */}
            <pointLight intensity={0.6} distance={10} color="#ffaa00" />
          </group>
        )
      ))}
    </group>
  )
}
