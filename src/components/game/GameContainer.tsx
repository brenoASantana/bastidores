'use client'

import { getAudioSystem } from '@/config/audioSystem'
import { useGameStore } from '@/store/gameStore'
import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import GameHUD from '../ui/GameHUD'
import Game from './Game'
import GameScene from './GameScene'
import LevelRenderer from './LevelRenderer'
import PauseMenu from '../ui/PauseMenu'
import { AssetLoader } from './AssetLoader'
import { Suspense } from 'react'

export default function GameContainer() {
  const gameState = useGameStore((state) => state.gameState)
  const isPaused = gameState.isPaused
  const [canvasReady, setCanvasReady] = useState(false)

  useEffect(() => {
    const audio = getAudioSystem()
    if (gameState.state === 'playing') {
      audio.startAmbient()
      setCanvasReady(true)
    } else {
      audio.stopAmbient()
    }
  }, [gameState.state])

  if (gameState.state !== 'playing') {
    return <div className="w-full h-full bg-black" />
  }

  return (
    <div className="relative w-full h-full bg-black">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 1.6, 0], fov: 75 }}
      >
        <color attach="background" args={['#1a1a1a']} />
        <fog attach="fog" args={['#1a1a1a', 30, 100]} />
        <ambientLight intensity={0.3} />

        {canvasReady && (
          <>
            <GameScene />
            <AssetLoader />
            <Suspense fallback={null}>
              <LevelRenderer />
            </Suspense>
            <Game />
          </>
        )}
      </Canvas>

      {canvasReady && !isPaused && <GameHUD />}

      {canvasReady && isPaused && <PauseMenu />}
    </div>
  )
}