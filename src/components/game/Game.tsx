'use client'

import PlayerController from '@/components/game/PlayerController'
import { getAudioSystem } from '@/config/audioSystem'
import { horrorSystem } from '@/config/horrorSystem'
import { objectiveSystem } from '@/config/objectiveSystem'
import { GAME_CONFIG, HORROR_EVENTS, PLAYER_CONFIG } from '@/data/constants'
import { BLOCK_SIZE } from '@/data/constants'
import { mapMatrix } from '@/data/map'
import { useGameStore } from '@/store/gameStore'
import { keysPressed } from '@/utils/input'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'

export default function Game() {

    const lastEventTime = useRef(0)
    const { camera } = useThree()

    useFrame((_, delta) => {
        const audio = getAudioSystem()
        const state = useGameStore.getState()

        state.incrementTime(delta * 1000)

        const moveDirection = new Vector3()
        const currentPos = camera.position.clone()
        const forward = new Vector3(0, 0, -1)
        const right = new Vector3(1, 0, 0)

        forward.applyAxisAngle(new Vector3(0, 1, 0), camera.rotation.y)
        right.applyAxisAngle(new Vector3(0, 1, 0), camera.rotation.y)

        const isSprinting = keysPressed['shift']

        if (keysPressed['w'] || keysPressed['arrowup']) {
            moveDirection.add(forward)
            state.player.isMoving = true
        }
        if (keysPressed['s'] || keysPressed['arrowdown']) {
            moveDirection.sub(forward)
            state.player.isMoving = true
        }
        if (keysPressed['a'] || keysPressed['arrowleft']) {
            moveDirection.sub(right)
            state.player.isMoving = true
        }
        if (keysPressed['d'] || keysPressed['arrowright']) {
            moveDirection.add(right)
            state.player.isMoving = true
        }

        if (moveDirection.length() > 0) {
            moveDirection.normalize()
        }

        const speed = isSprinting ? PLAYER_CONFIG.MOVE_SPEED * 1.5 : PLAYER_CONFIG.MOVE_SPEED
        const nextPos = currentPos.addScaledVector(moveDirection, speed * delta)

        // ==========================================
        // NOVO MOTOR DE COLISÃO O(1) BASEADO EM GRID
        // ==========================================

        const width = mapMatrix[0].length
        const height = mapMatrix.length

        // Inversão: Transformamos o próximo passo de Metros (World Space) para Índices (Grid Space)
        const targetCol = Math.floor((nextPos.x / BLOCK_SIZE) + (width / 2))
        const targetRow = Math.floor((nextPos.z / BLOCK_SIZE) + (height / 2))

        // Programação Defensiva: Impede que o array quebre se o jogador bugar para fora do mapa
        const isOutsideMap = targetRow < 0 || targetRow >= height || targetCol < 0 || targetCol >= width

        let canWalk = false

        if (!isOutsideMap) {
            // Lemos o ID do bloco exato onde o jogador quer pisar
            const blockId = mapMatrix[targetRow][targetCol]

            // Definição de regras de física (ex: 0 é chão comum, 2 é passagem, 3 é área de ansiedade)
            // IDs de parede (ex: 1 e 5) não estão nesta lista, bloqueando o passo.
            if (blockId === 0 || blockId === 2 || blockId === 3) {
                canWalk = true
            }
        }

        // Movemos a câmera apenas se o bloco for "andável"
        if (canWalk) {
            camera.position.copy(nextPos)
        }

        // ==========================================

        const playerPos: [number, number, number] = [camera.position.x, camera.position.y, camera.position.z]

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

        audio.updateAnxietyLayer(currentAnxiety)

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

        const collectedIds = objectiveSystem.checkCollision(playerPos as [number, number, number])
        if (collectedIds.length > 0) {
            state.updateObjectives(objectiveSystem.getCollectedCount())
        }

        if (currentAnxiety >= GAME_CONFIG.ANXIETY_COLLAPSE_THRESHOLD) {
            setTimeout(() => {
                if (state.gameState.anxiety.level >= GAME_CONFIG.ANXIETY_COLLAPSE_THRESHOLD) {
                    state.setGameState('failed')
                }
            }, GAME_CONFIG.ANXIETY_COLLAPSE_DURATION)
        }

        // Lógica temporária da zona de saída mantida, mas idealmente
        // a zona de saída também virará um ID específico na matriz no futuro.
        const isInExitZone = false // Atualizar quando refatorar o objetivo de saída para a matriz

        if (objectiveSystem.getCollectedCount() === GAME_CONFIG.MAX_OBJECTIVES && isInExitZone) {
            state.setGameState('completed')
        }
    })

    return (
        <PlayerController />
    )
}