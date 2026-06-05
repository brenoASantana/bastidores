'use client'

import { TEST_ROOM_LEVEL } from '@/data/levels'
import type { StaticWorldObject } from '@/utils/world'
import CeilingObject from '../model/CeilingModel'
import FloorObject from '../model/FloorModel'
import LightObject from '../model/LightModel'
import WallObject from '../model/WallModel'

function renderWorldObject(object: StaticWorldObject) {
  switch (object.kind) {
    case 'floor':
      return <FloorObject key={object.id} object={object} />
    case 'wall':
      return <WallObject key={object.id} object={object} />
    case 'ceiling':
      return <CeilingObject key={object.id} object={object} />
    case 'light':
      return <LightObject key={object.id} object={object} />
    default:
      return null
  }
}

export default function MapGeometry() {
  return (
    <group>
      {TEST_ROOM_LEVEL.geometry.map(renderWorldObject)}
    </group>
  )
}
