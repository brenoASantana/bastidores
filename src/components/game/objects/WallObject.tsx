'use client'

import type { StaticWorldObject } from '@/types/world'
import StaticWorldObjectMesh from './StaticWorldObjectMesh'

interface WallObjectProps {
  object: StaticWorldObject
}

export default function WallObject({ object }: WallObjectProps) {
  const repeat: [number, number] = [Math.max(object.size[0] / 4, 1), Math.max(object.size[1] / 2, 1)]

  return (
    <StaticWorldObjectMesh
      object={object}
      defaultColor="#c0b0a0"
      defaultTexture="/assets/textures/Wallpaper.png"
      textureRepeat={repeat}
    />
  )
}