'use client'

import { PLAYER_CONFIG } from '@/components/data/constants'
import { Camera } from 'three'
import { useEffect, useRef } from 'react'
import { keysPressed } from '@/utils/input'


export interface PlayerControllerProps {
  camera: Camera
}

export default function PlayerController({ camera }: PlayerControllerProps) {

  const isPointerLocked = useRef(false)
  // Event listeners
  useEffect(() => {

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

      const newRotX = rotX - deltaMove.y * PLAYER_CONFIG.MOUSE_SENSITIVITY
      const newRotY = rotY - deltaMove.x * PLAYER_CONFIG.MOUSE_SENSITIVITY

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

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
    }
  }, [camera])

  return null
}
