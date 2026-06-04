'use client'

import type { StaticWorldObject } from '@/types/world'
import StaticWorldObjectMesh from './StaticWorldObjectMesh'

interface LightObjectProps {
  object: StaticWorldObject
}

export default function LightObject({ object }: LightObjectProps) {
  return <StaticWorldObjectMesh object={object} defaultColor="#f3e4b5" />
}