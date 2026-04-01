'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Fog } from '@react-three/drei'
import { Vector3, Euler } from 'three'
import { useGameStore } from '@/store/gameStore'
import { horrorSystem } from '@/systems/horrorSystem'
import { audioSystem } from '@/systems/audioSystem'
import { objectiveSystem } from '@/systems/objectiveSystem'
import { PLAYER_CONFIG, MAP_CONFIG, GAME_CONFIG } from '@/config/constants'
import GameScene from './GameScene'
import PlayerController from './PlayerController'
import GameHUD from './GameHUD'

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
        <Fog attach="fog" args={['#1a1a1a', 30, 100]} />
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
