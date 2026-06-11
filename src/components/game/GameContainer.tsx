'use client'

import { useGameStore } from '@/store/GameStore'
import { PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import GameHUD from '../ui/GameHUD'
import PauseMenu from '../ui/PauseMenu'
import { AssetLoader } from './AssetLoader'
import Game from './Game'
import LevelRenderer from './LevelRenderer'
import LightingSystem from './LightingSystem'

export default function GameContainer() {
  const gameState = useGameStore((state) => state.gameState)
  const isPaused = gameState.isPaused
  const isAppleDevice = typeof navigator !== 'undefined' &&
    (/Mac|iPhone|iPad|iPod/i.test(navigator.platform) ||
      /Mac/i.test(navigator.userAgent));

  return (
    <div className="fixed inset-0 w-full h-[100dvh] overflow-hidden bg-[#1a1a1a]">
      <Canvas
        gl={{
          antialias: !isAppleDevice,
          alpha: false,
          powerPreference: isAppleDevice ? 'default' : 'high-performance',
        }}
        // O Canvas precisa de um background via CSS para evitar flashes brancos iniciais
        style={{ background: '#1a1a1a' }}
        className="w-full h-full"
        // No Mac, limitamos o pixel ratio a 1. No Windows/Linux, até 1.5.
        dpr={isAppleDevice ? 1 : [1, 1.5]}
      >
        <AssetLoader />

        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1.6, 0]} fov={75} near={0.05} />

          {/* O componente <color /> define o fundo da cena 3D */}
          <color attach="background" args={['#1a1a1a']} />
          <fog attach="fog" args={['#1a1a1a', 30, 100]} />

          <ambientLight intensity={0.3} />

          {/* Renderização do nível */}
          <LightingSystem />
          <LevelRenderer />

          {/* Só renderiza o jogador e sistemas de jogo se estiver 'playing' */}
          {gameState.state === 'playing' && <Game />}
        </Suspense>
      </Canvas>

      {/* Interface (HUD e Pause) */}
      {gameState.state === 'playing' && !isPaused && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <GameHUD />
        </div>
      )}

      {gameState.state === 'playing' && isPaused && <PauseMenu />}
    </div>
  )
}