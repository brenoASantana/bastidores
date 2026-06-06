'use client'

import { INTENSITY_LIGHTS } from '@/data/constants'

export default function LightingSystem() {
    return (
        <group name="global-lighting">
            {/* Uma luz ambiente muito fraca apenas para não ficar 100% preto nas sombras */}
            <ambientLight intensity={INTENSITY_LIGHTS} color="#888899" />
        </group>
    )
}