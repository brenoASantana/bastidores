'use client'

import { getAudioSystem } from '@/config/audioSystem'
import { useGameStore } from '@/store/gameStore'
import { Canvas } from '@react-three/fiber'
import { useEffect } from 'react'
import GameHUD from '../ui/GameHUD'
import Game from './Game'
import LevelRenderer from './LevelRenderer'
import PauseMenu from '../ui/PauseMenu'
import { AssetLoader } from './AssetLoader'
import { Suspense } from 'react'
import LightingSystem from './LightingSystem'

export default function GameContainer() {
  const gameState = useGameStore((state) => state.gameState)
  const isPaused = gameState.isPaused

  useEffect(() => {
    const audio = getAudioSystem()
    if (gameState.state === 'playing') {
      audio.startAmbient()
    } else {
      audio.stopAmbient()
    }
  }, [gameState.state])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 1.6, 0], fov: 75 }}
      >
        <Suspense fallback={null}>
          <AssetLoader />
          <color attach="background" args={['#1a1a1a']} />
          <fog attach="fog" args={['#1a1a1a', 30, 100]} />
          <ambientLight intensity={0.3} />

          {/* O CENÁRIO (Sempre renderizado para baixar as texturas e aparecer de fundo) */}
          <LightingSystem />
          <LevelRenderer />

          {/* A LÓGICA DO JOGADOR (Só roda se estiver efetivamente jogando) */}
          {gameState.state === 'playing' && <Game />}
        </Suspense>
      </Canvas>

      {/* INTERFACE HTML (Depende estritamente do estado do jogo) */}
      {gameState.state === 'playing' && !isPaused && <GameHUD />}
      {gameState.state === 'playing' && isPaused && <PauseMenu />}
    </div>
  )
}