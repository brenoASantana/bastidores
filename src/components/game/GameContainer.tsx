'use client'

import { useGameStore } from '@/store/gameStore'
import { audioSystem } from '@/systems/audioSystem'
import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import GameHUD from './GameHUD'
import GameScene from './GameScene'
import PlayerController from './PlayerController'

export default function GameContainer() {
  const gameState = useGameStore((state) => state.gameState)
  const [canvasReady, setCanvasReady] = useState(false)

  useEffect(() => {
    if (gameState.state === 'playing') {
      audioSystem.startAmbient()
      audioSystem.startTension()
      setCanvasReady(true)
    } else {
      audioSystem.stopAmbient()
      audioSystem.stopTension()
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
            <PlayerController />
          </>
        )}
      </Canvas>

      {canvasReady && <GameHUD />}
    </div>
  )
}
