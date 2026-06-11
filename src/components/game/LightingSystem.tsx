'use client'

import { WORLD } from '@/config/Constants'

export default function LightingSystem() {
    return (
        <group name="global-lighting">
            <ambientLight intensity={WORLD.ENVIRONMENT_LIGHT_INTENSITY} color="#888899" />
        </group>
    )
}