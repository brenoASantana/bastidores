'use client'

import { TEST_ROOM_LEVEL } from '@/config/levels'

export default function MapGeometry() {
  return (
    <group>
      {TEST_ROOM_LEVEL.geometry.map((object) => (
        <mesh
          key={object.id}
          position={object.position}
          rotation={object.rotation}
          scale={object.scale}
          castShadow={object.castShadow}
          receiveShadow={object.receiveShadow}
        >
          <boxGeometry args={object.size} />
          <meshStandardMaterial
            color={object.material.color}
            roughness={object.material.roughness}
            metalness={object.material.metalness}
            emissive={object.material.emissive}
            emissiveIntensity={object.material.emissiveIntensity}
          />
        </mesh>
      ))}
    </group>
  )
}
