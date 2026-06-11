'use client'

import { ASSETS } from '@/config/Constants';
import { useTexture } from '@react-three/drei';
import { PointLightProps } from '@react-three/fiber'

export function FluorescentLight(props: PointLightProps) {

    const ceilingTex = useTexture(ASSETS.TEXTURES.CEILING);

    return (
        <group position={props.position}>
            {/* O corpo físico da lâmpada (O retângulo branco no teto) */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[5, 5, 5]} />
                <meshBasicMaterial map={ceilingTex} color="#ffffff" />
            </mesh>

            {/* O emissor de luz, levemente puxado para baixo para iluminar as paredes */}
            <pointLight
                intensity={props.intensity}
                distance={props.distance}
                position={[0, -0.2, 0]}
                color="#fffae6" // Tom levemente amarelado de lâmpada velha
            />
        </group>
    )
}