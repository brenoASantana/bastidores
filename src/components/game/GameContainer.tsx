'use client'

import { getAudioSystem } from '@/config/audioSystem'
import { useGameStore } from '@/store/gameStore'
import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import GameHUD from '../ui/GameHUD'
import Game from './Game'
import GameScene from './GameScene'

export default function GameContainer() {
  const { camera } = useThree()
  const gameState = useGameStore((state) => state.gameState)
  const [canvasReady, setCanvasReady] = useState(false)

  useEffect(() => {
    const audio = getAudioSystem()
    if (gameState.state === 'playing') {
      audio.startAmbient()
      // audio.startTension()
      setCanvasReady(true)
    } else {
      audio.stopAmbient()
      // audio.stopTension()
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
            <Game camera={camera} />
          </>
        )}
      </Canvas>

      {canvasReady && <GameHUD />}
    </div>
  )
}
