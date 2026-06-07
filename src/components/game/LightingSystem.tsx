'use client'

import { WORLD } from '@/config/Constants'

export default function LightingSystem() {
    return (
        <group name="global-lighting">
            {/* Uma luz ambiente muito fraca apenas para não ficar 100% preto nas sombras */}
            <ambientLight intensity={WORLD.ENVIRONMENT_LIGHT_INTENSITY} color="#888899" />
        </group>
    )
}