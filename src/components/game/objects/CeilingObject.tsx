'use client'

import type { StaticWorldObject } from '@/types/world'
import StaticWorldObjectMesh from './StaticWorldObjectMesh'

interface CeilingObjectProps {
  object: StaticWorldObject
}

export default function CeilingObject({ object }: CeilingObjectProps) {
  return <StaticWorldObjectMesh object={object} defaultColor="#a89880" />
}