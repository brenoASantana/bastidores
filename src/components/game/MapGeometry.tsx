'use client'

import React from 'react'
import { MAP_CONFIG } from '@/config/constants'

export default function MapGeometry() {
  return (
    <group>
      {/* Piso base */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#d4c4b0" roughness={0.8} metalness={0} />
      </mesh>

      {/* Corredor principal - paredes */}
      {/* Parede norte */}
      <mesh position={[0, MAP_CONFIG.CORRIDOR_HEIGHT / 2, -MAP_CONFIG.CORRIDOR_LENGTH / 2]} castShadow>
        <boxGeometry
          args={[MAP_CONFIG.CORRIDOR_WIDTH, MAP_CONFIG.CORRIDOR_HEIGHT, MAP_CONFIG.WALL_THICKNESS]}
        />
        <meshStandardMaterial color="#c0b0a0" roughness={0.85} metalness={0} />
      </mesh>

      {/* Parede sul */}
      <mesh position={[0, MAP_CONFIG.CORRIDOR_HEIGHT / 2, MAP_CONFIG.CORRIDOR_LENGTH / 2]} castShadow>
        <boxGeometry
          args={[MAP_CONFIG.CORRIDOR_WIDTH, MAP_CONFIG.CORRIDOR_HEIGHT, MAP_CONFIG.WALL_THICKNESS]}
        />
        <meshStandardMaterial color="#c0b0a0" roughness={0.85} metalness={0} />
      </mesh>

      {/* Parede leste */}
      <mesh position={[MAP_CONFIG.CORRIDOR_WIDTH / 2, MAP_CONFIG.CORRIDOR_HEIGHT / 2, 0]} castShadow>
        <boxGeometry
          args={[MAP_CONFIG.WALL_THICKNESS, MAP_CONFIG.CORRIDOR_HEIGHT, MAP_CONFIG.CORRIDOR_LENGTH]}
        />
        <meshStandardMaterial color="#c0b0a0" roughness={0.85} metalness={0} />
      </mesh>

      {/* Parede oeste */}
      <mesh position={[-MAP_CONFIG.CORRIDOR_WIDTH / 2, MAP_CONFIG.CORRIDOR_HEIGHT / 2, 0]} castShadow>
        <boxGeometry
          args={[MAP_CONFIG.WALL_THICKNESS, MAP_CONFIG.CORRIDOR_HEIGHT, MAP_CONFIG.CORRIDOR_LENGTH]}
        />
        <meshStandardMaterial color="#c0b0a0" roughness={0.85} metalness={0} />
      </mesh>

      {/* Ramificação leste */}
      {/* Parede norte da ramificação */}
      <mesh position={[MAP_CONFIG.CORRIDOR_WIDTH + 5, MAP_CONFIG.CORRIDOR_HEIGHT / 2, -10]} castShadow>
        <boxGeometry
          args={[MAP_CONFIG.CORRIDOR_LENGTH, MAP_CONFIG.CORRIDOR_HEIGHT, MAP_CONFIG.WALL_THICKNESS]}
        />
        <meshStandardMaterial color="#c0b0a0" roughness={0.85} metalness={0} />
      </mesh>

      {/* Parede leste da ramificação */}
      <mesh position={[MAP_CONFIG.CORRIDOR_WIDTH + 15, MAP_CONFIG.CORRIDOR_HEIGHT / 2, -5]} castShadow>
        <boxGeometry
          args={[MAP_CONFIG.WALL_THICKNESS, MAP_CONFIG.CORRIDOR_HEIGHT, 10]}
        />
        <meshStandardMaterial color="#c0b0a0" roughness={0.85} metalness={0} />
      </mesh>

      {/* Ramificação oeste */}
      {/* Parede sul da ramificação */}
      <mesh position={[-MAP_CONFIG.CORRIDOR_WIDTH - 5, MAP_CONFIG.CORRIDOR_HEIGHT / 2, 10]} castShadow>
        <boxGeometry
          args={[MAP_CONFIG.CORRIDOR_LENGTH, MAP_CONFIG.CORRIDOR_HEIGHT, MAP_CONFIG.WALL_THICKNESS]}
        />
        <meshStandardMaterial color="#c0b0a0" roughness={0.85} metalness={0} />
      </mesh>

      {/* Parede oeste da ramificação */}
      <mesh position={[-MAP_CONFIG.CORRIDOR_WIDTH - 15, MAP_CONFIG.CORRIDOR_HEIGHT / 2, 5]} castShadow>
        <boxGeometry
          args={[MAP_CONFIG.WALL_THICKNESS, MAP_CONFIG.CORRIDOR_HEIGHT, 10]}
        />
        <meshStandardMaterial color="#c0b0a0" roughness={0.85} metalness={0} />
      </mesh>

      {/* Teto */}
      <mesh position={[0, MAP_CONFIG.CORRIDOR_HEIGHT, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#a89880" roughness={0.75} metalness={0} />
      </mesh>
    </group>
  )
}
