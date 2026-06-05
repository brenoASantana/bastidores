'use client'

import type { StaticWorldObject } from '@/utils/world'
import StaticWorldObjectMesh from './StaticWorldObjectMesh'

interface FloorObjectProps {
  object: StaticWorldObject
}

export default function FloorObject({ object }: FloorObjectProps) {
  return <StaticWorldObjectMesh object={object} defaultColor="#d4c4b0" />
}