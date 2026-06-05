'use client'

import PlayerController from '@/components/game/PlayerController'
import { getAudioSystem } from '@/config/audioSystem'
import { horrorSystem } from '@/config/horrorSystem'
import { objectiveSystem } from '@/config/objectiveSystem'
import { GAME_CONFIG, HORROR_EVENTS, PLAYER_CONFIG } from '@/data/constants'
import { TEST_ROOM_LEVEL } from '@/data/levels'
import { useGameStore } from '@/store/gameStore'
import { keysPressed } from '@/utils/input'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Camera, Vector3 } from 'three'

export interface GameProps {
    camera: Camera
}

export default function Game({ camera }: GameProps) {

    const lastEventTime = useRef(0)

    useFrame((_, delta) => {
        const audio = getAudioSystem()
        const state = useGameStore.getState()

        // Atualiza tempo
        state.incrementTime(delta * 1000)

        // Calcula movimento
        const moveDirection = new Vector3()
        // const currentPos = new Vector3(...state.player.position)
        // Lemos a posição real e atual da Câmera (O(1), zero Zustand)
        const currentPos = camera.position.clone()
        const forward = new Vector3(0, 0, -1)
        const right = new Vector3(1, 0, 0)

        forward.applyAxisAngle(new Vector3(0, 1, 0), camera.rotation.y)
        right.applyAxisAngle(new Vector3(0, 1, 0), camera.rotation.y)

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

        // Normaliza direção
        if (moveDirection.length() > 0) {
            moveDirection.normalize()
        }

        // Aplicamos a velocidade direto na posição nativa
        const speed = isSprinting ? PLAYER_CONFIG.MOVE_SPEED * 1.5 : PLAYER_CONFIG.MOVE_SPEED
        const nextPos = currentPos.addScaledVector(moveDirection, speed * delta)

        // Colisão simples com as bordas da sala de teste
        const margin = PLAYER_CONFIG.COLLISION_RADIUS
        const minX = TEST_ROOM_LEVEL.bounds.minX + margin
        const maxX = TEST_ROOM_LEVEL.bounds.maxX - margin
        const minZ = TEST_ROOM_LEVEL.bounds.minZ + margin
        const maxZ = TEST_ROOM_LEVEL.bounds.maxZ - margin

        // Checamos a colisão. Se for válido, movemos a câmera.
        // ZERO ZUSTAND ENVOLVIDO!
        if (nextPos.x >= minX && nextPos.x <= maxX && nextPos.z >= minZ && nextPos.z <= maxZ) {
            camera.position.copy(nextPos)
        }

        // Atualiza câmera
        const playerPos: [number, number, number] = [camera.position.x, camera.position.y, camera.position.z]

        // Sistema de horror - ansiedade
        const isInSafeZone = horrorSystem.isInSafeZone(playerPos)
        const anxietyDelta = horrorSystem.calculateAnxietyDelta(
            playerPos as [number, number, number],
            delta,
            isInSafeZone
        )

        let currentAnxiety = state.gameState.anxiety.level
        currentAnxiety += anxietyDelta
        currentAnxiety = Math.max(0, Math.min(GAME_CONFIG.MAX_ANXIETY, currentAnxiety))
        state.updateAnxiety(anxietyDelta)

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
            state.updateObjectives(objectiveSystem.getCollectedCount())
        }

        // Verifica falha (ansiedade crítica)
        if (currentAnxiety >= GAME_CONFIG.ANXIETY_COLLAPSE_THRESHOLD) {
            setTimeout(() => {
                if (state.gameState.anxiety.level >= GAME_CONFIG.ANXIETY_COLLAPSE_THRESHOLD) {
                    state.setGameState('failed')
                }
            }, GAME_CONFIG.ANXIETY_COLLAPSE_DURATION)
        }

        // Verifica vitória
        const isInExitZone =
            playerPos[0] >= TEST_ROOM_LEVEL.exitZone.minX &&
            playerPos[0] <= TEST_ROOM_LEVEL.exitZone.maxX &&
            playerPos[2] >= TEST_ROOM_LEVEL.exitZone.minZ &&
            playerPos[2] <= TEST_ROOM_LEVEL.exitZone.maxZ

        if (objectiveSystem.getCollectedCount() === GAME_CONFIG.MAX_OBJECTIVES && isInExitZone) {
            state.setGameState('completed')
        }
    })
    return (
        <PlayerController camera={camera} />
    )
}