'use client'

import { keysPressed } from '@/components/game/Input'
import { GAME } from '@/config/Constants'
import { useGameStore } from '@/store/GameStore'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

export default function PlayerController() {

  const isPointerLocked = useRef(false)
  const { camera } = useThree()

  // Event listeners
  useEffect(() => {
    const onPointerLockChange = () => {
      // Se o documento não tem mais o ponteiro travado, o jogador saiu do modo de jogo
      if (document.pointerLockElement === null) {
        useGameStore.getState().setPaused(true);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed[e.key.toLowerCase()] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.key.toLowerCase()] = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current) return

      const deltaMove = {
        x: e.movementX,
        y: e.movementY,
      }

      const rotX = camera.rotation.x
      const rotY = camera.rotation.y

      const newRotX = rotX - deltaMove.y * GAME.PLAYER.MOUSE_SENSITIVITY
      const newRotY = rotY - deltaMove.x * GAME.PLAYER.MOUSE_SENSITIVITY

      // Limita rotação vertical
      const clampedRotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newRotX))

      camera.rotation.set(clampedRotX, newRotY, 0, 'YXZ')
    }

    const handleClick = () => {
      const body = document.body
      if (!body) return
      const requestPointerLock =
        body.requestPointerLock ||
        (body as HTMLBodyElement & { mozRequestPointerLock?: () => void }).mozRequestPointerLock
      requestPointerLock?.call(body)
    }

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement !== null
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    document.addEventListener('pointerlockchange', handlePointerLockChange)
    document.addEventListener('pointerlockchange', onPointerLockChange)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
      document.removeEventListener('pointerlockchange', onPointerLockChange);
    }
  }, [camera])

  return null
}
