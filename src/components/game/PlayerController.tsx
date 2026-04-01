'use client'

import { GAME_CONFIG, HORROR_EVENTS, MAP_CONFIG, PLAYER_CONFIG } from '@/config/constants'
import { useGameStore } from '@/store/gameStore'
import { getAudioSystem } from '@/systems/audioSystem'
import { horrorSystem } from '@/systems/horrorSystem'
import { objectiveSystem } from '@/systems/objectiveSystem'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'

const keysPressed: Record<string, boolean> = {}

export default function PlayerController() {
  const { camera } = useThree()
  const store = useGameStore()
  const isPointerLocked = useRef(false)
  const lastEventTime = useRef(0)

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

      const [rotX, rotY] = store.player.rotation

      const newRotX = rotX - deltaMove.y * PLAYER_CONFIG.MOUSE_SENSITIVITY
      const newRotY = rotY - deltaMove.x * PLAYER_CONFIG.MOUSE_SENSITIVITY

      // Limita rotação vertical
      const clampedRotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newRotX))

      store.updatePlayerRotation([clampedRotX, newRotY])
      camera.rotation.order = 'YXZ'
      camera.rotation.y = newRotY
      camera.rotation.x = clampedRotX
    }

    const handleClick = () => {
      if (!isPointerLocked.current) {
        document.body.requestPointerLock =
          document.body.requestPointerLock || (document.body as any).mozRequestPointerLock
        document.body.requestPointerLock()
      }
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
  }, [camera, store])

  // Game loop principal
  useFrame((state, delta) => {
    const audio = getAudioSystem()
    const gameState = store.gameState

    // Atualiza tempo
    store.incrementTime(delta * 1000)

    // Calcula movimento
    const moveDirection = new Vector3()
    const currentPos = new Vector3(...store.player.position)
    const forward = new Vector3(0, 0, -1)
    const right = new Vector3(1, 0, 0)

    forward.applyAxisAngle(new Vector3(0, 1, 0), store.player.rotation[1])
    right.applyAxisAngle(new Vector3(0, 1, 0), store.player.rotation[1])

    const isSprinting = keysPressed['shift']
    let isMoving = false

    if (keysPressed['w'] || keysPressed['arrowup']) {
      moveDirection.add(forward)
      isMoving = true
    }
    if (keysPressed['s'] || keysPressed['arrowdown']) {
      moveDirection.sub(forward)
      isMoving = true
    }
    if (keysPressed['a'] || keysPressed['arrowleft']) {
      moveDirection.sub(right)
      isMoving = true
    }
    if (keysPressed['d'] || keysPressed['arrowright']) {
      moveDirection.add(right)
      isMoving = true
    }

    store.updatePlayerMoving(isMoving)

    // Normaliza direção
    if (moveDirection.length() > 0) {
      moveDirection.normalize()
    }

    // Aplica velocidade
    const speed = isSprinting ? PLAYER_CONFIG.MOVE_SPEED * PLAYER_CONFIG.SPRINT_MULTIPLIER : PLAYER_CONFIG.MOVE_SPEED
    const newPos = currentPos.addScaledVector(moveDirection, speed * delta)

    // Colisão simples com paredes
    const margin = PLAYER_CONFIG.COLLISION_RADIUS
    const corrW = MAP_CONFIG.CORRIDOR_WIDTH / 2 - margin
    const corrH = MAP_CONFIG.CORRIDOR_HEIGHT - margin
    const corrL = MAP_CONFIG.CORRIDOR_LENGTH / 2 - margin

    // Limita movimentação dentro dos corredores
    if (Math.abs(newPos.x) < corrW && Math.abs(newPos.z) < corrL) {
      // Corredor principal
      store.updatePlayerPosition([newPos.x, newPos.y, newPos.z])
    } else if (
      newPos.x > corrW &&
      newPos.x < corrW + 20 &&
      Math.abs(newPos.z + 5) < 10 + margin
    ) {
      // Ramificação leste
      store.updatePlayerPosition([newPos.x, newPos.y, newPos.z])
    } else if (
      newPos.x < -corrW &&
      newPos.x > -corrW - 20 &&
      Math.abs(newPos.z - 5) < 10 + margin
    ) {
      // Ramificação oeste
      store.updatePlayerPosition([newPos.x, newPos.y, newPos.z])
    }

    // Atualiza câmera
    const playerPos = store.player.position
    camera.position.set(playerPos[0], playerPos[1], playerPos[2])

    // Sistema de horror - ansiedade
    const isInSafeZone = horrorSystem.isInSafeZone(playerPos)
    const anxietyDelta = horrorSystem.calculateAnxietyDelta(
      playerPos as [number, number, number],
      delta,
      isInSafeZone
    )

    let currentAnxiety = gameState.anxiety
    currentAnxiety += anxietyDelta
    currentAnxiety = Math.max(0, Math.min(GAME_CONFIG.MAX_ANXIETY, currentAnxiety))
    store.updateAnxiety(anxietyDelta)

    // Atualiza áudio
    audio.updateAnxietyLayer(currentAnxiety)

    // Horror events
    const now = Date.now()
    if (now - lastEventTime.current > 3000) {
      if (horrorSystem.shouldTriggerEvent(HORROR_EVENTS.DISTANT_FOOTSTEPS, currentAnxiety, delta)) {
        audio.playSFX(HORROR_EVENTS.DISTANT_FOOTSTEPS, 0.4)
        lastEventTime.current = now
      }
      if (horrorSystem.shouldTriggerEvent(HORROR_EVENTS.WHISPER, currentAnxiety, delta)) {
        audio.playSFX(HORROR_EVENTS.WHISPER, 0.3)
        lastEventTime.current = now
      }
    }

    // Verifica colisão com objetivos
    const collectedIds = objectiveSystem.checkCollision(playerPos as [number, number, number])
    if (collectedIds.length > 0) {
      store.updateObjectives(objectiveSystem.getCollectedCount())
    }

    // Verifica falha (ansiedade crítica)
    if (currentAnxiety >= GAME_CONFIG.ANXIETY_COLLAPSE_THRESHOLD) {
      setTimeout(() => {
        if (store.gameState.anxiety >= GAME_CONFIG.ANXIETY_COLLAPSE_THRESHOLD) {
          store.setGameState('failed')
        }
      }, GAME_CONFIG.ANXIETY_COLLAPSE_DURATION)
    }

    // Verifica vitória
    if (
      objectiveSystem.getCollectedCount() === GAME_CONFIG.MAX_OBJECTIVES &&
      playerPos[2] > MAP_CONFIG.CORRIDOR_LENGTH / 2 - 2
    ) {
      store.setGameState('completed')
    }
  })

  return null
}
