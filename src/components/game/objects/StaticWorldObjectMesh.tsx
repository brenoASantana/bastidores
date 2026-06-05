'use client'

import type { StaticWorldObject } from '@/types/world'
import { useEffect, useState } from 'react'
import { RepeatWrapping, SRGBColorSpace, TextureLoader, type Texture } from 'three'

interface StaticWorldObjectMeshProps {
  object: StaticWorldObject
  defaultColor: string
  defaultTexture?: string
  textureRepeat?: [number, number]
}

function useTextureMap(texturePath?: string, repeat?: [number, number]) {
  const [texture, setTexture] = useState<Texture | null>(null)

  useEffect(() => {
    if (!texturePath) {
      setTexture(null)
      return
    }

    const loader = new TextureLoader()
    const loadedTexture = loader.load(texturePath)

    loadedTexture.wrapS = RepeatWrapping
    loadedTexture.wrapT = RepeatWrapping
    loadedTexture.colorSpace = SRGBColorSpace

    if (repeat) {
      loadedTexture.repeat.set(repeat[0], repeat[1])
    }

    setTexture(loadedTexture)

    return () => {
      loadedTexture.dispose()
    }
  }, [repeat, texturePath])

  return texture
}

export default function StaticWorldObjectMesh({ object, defaultColor, defaultTexture, textureRepeat }: StaticWorldObjectMeshProps) {
  const texture = useTextureMap(object.material.texture ?? defaultTexture, textureRepeat)
  const color = object.material.color ?? defaultColor

  return (
    <mesh
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      castShadow={object.castShadow}
      receiveShadow={object.receiveShadow}
    >
      <boxGeometry args={object.size} />
      <meshStandardMaterial
        color={color}
        map={texture ?? undefined}
        roughness={object.material.roughness}
        metalness={object.material.metalness}
        emissive={object.material.emissive}
        emissiveIntensity={object.material.emissiveIntensity}
      />
    </mesh>
  )
}