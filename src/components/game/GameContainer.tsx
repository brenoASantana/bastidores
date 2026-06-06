'use client'

import { getAudioSystem } from '@/config/AudioSystem';
import { useGameStore } from '@/store/GameStore';
import { PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import GameHUD from '../ui/GameHUD';
import PauseMenu from '../ui/PauseMenu';
import { AssetLoader } from './AssetLoader';
import Game from './Game';
import LevelRenderer from './LevelRenderer';
import LightingSystem from './LightingSystem';

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
    // fixed inset-0 força o container a ocupar 100% da viewport, ignorando margens de pais
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 1.6, 0], fov: 75, near: 0.05 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1.6, 0]} fov={75} near={0.05} />
          <AssetLoader />
          <color attach="background" args={['#1a1a1a']} />
          <fog attach="fog" args={['#1a1a1a', 30, 100]} />
          <ambientLight intensity={0.3} />

          <LightingSystem />
          <LevelRenderer />

          {gameState.state === 'playing' && <Game />}
        </Suspense>
      </Canvas>

      {/* Sintaxe corrigida aqui: apenas uma chave para o bloco de renderização */}
      {gameState.state === 'playing' && !isPaused && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <GameHUD />
        </div>
      )}

      {gameState.state === 'playing' && isPaused && <PauseMenu />}
    </div>
  )
}