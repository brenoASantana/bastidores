'use client'

import PlayerController from '@/components/game/PlayerController'
import { getAudioSystem } from '@/config/audioSystem'
import { horrorSystem } from '@/config/horrorSystem'
import { BLOCK_SIZE, GAME_CONFIG, HORROR_EVENTS, PLAYER_CONFIG } from '@/data/constants'
import { mapMatrix as defaultMapMatrix } from '@/data/map'
import { metadata as defaultMetaData } from '@/data/metadata'
import { useGameStore } from '@/store/gameStore'
import { keysPressed } from '@/utils/Input'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'

export default function Game() {
    const lastEventTime = useRef(0)
    const { camera } = useThree()

    useFrame((_, delta) => {
        const audio = getAudioSystem()
        const state = useGameStore.getState()

        if (state.gameState.isPaused) return

        // 1. Atualiza tempo do jogo
        state.incrementTime(delta * 1000)

        // 2. Processa Inputs de Movimento
        const moveDirection = new Vector3()
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
        if (keysPressed['ESC']) {
            state.setPaused(true)
        }

        state.player.isMoving = isMoving

        if (moveDirection.length() > 0) {
            moveDirection.normalize()
        }

        const speed = isSprinting ? PLAYER_CONFIG.MOVE_SPEED * 1.5 : PLAYER_CONFIG.MOVE_SPEED
        const nextPos = currentPos.addScaledVector(moveDirection, speed * delta)

        const width = defaultMapMatrix[0].length
        const height = defaultMapMatrix.length

        // 3. Sistema de Colisão Avançado (Target Check)
        const targetCol = Math.floor((nextPos.x / BLOCK_SIZE) + (width / 2))
        const targetRow = Math.floor((nextPos.z / BLOCK_SIZE) + (height / 2))

        const isTargetOutside = targetRow < 0 || targetRow >= height || targetCol < 0 || targetCol >= width
        let canWalk = false

        if (!isTargetOutside) {
            const targetBlockId = defaultMapMatrix[targetRow][targetCol]
            const targetBlockMeta = defaultMetaData[String(targetBlockId) as keyof typeof defaultMetaData]

            // A física agora obedece diretamente a propriedade declarativa do dicionário!
            if (targetBlockMeta?.walkable) {
                canWalk = true
            }
        }

        if (canWalk) {
            camera.position.copy(nextPos)
        }

        // 4. Mecânica de Horror O(1) Otimizada (Current Check)
        // Convertemos a posição atual estabilizada da câmera de volta para índices
        const currentCol = Math.floor((camera.position.x / BLOCK_SIZE) + (width / 2))
        const currentRow = Math.floor((camera.position.z / BLOCK_SIZE) + (height / 2))

        const isCurrentOutside = currentRow < 0 || currentRow >= height || currentCol < 0 || currentCol >= width

        // Valor padrão de segurança (neutralidade) caso o jogador consiga sair do mapa
        let activeAnxietyMultiplier = 1.0

        if (!isCurrentOutside) {
            const currentBlockId = defaultMapMatrix[currentRow][currentCol]
            const currentBlockMeta = defaultMetaData[String(currentBlockId) as keyof typeof defaultMetaData]
            if (currentBlockMeta) {
                activeAnxietyMultiplier = currentBlockMeta.anxietyMultiplier
            }
        }

        // Chamada limpa enviando apenas o tempo e o multiplicador dinâmico do bloco
        const anxietyDelta = horrorSystem.calculateAnxietyDelta(delta, activeAnxietyMultiplier)

        let currentAnxiety = state.gameState.anxiety.level
        currentAnxiety += anxietyDelta
        currentAnxiety = Math.max(0, Math.min(GAME_CONFIG.MAX_ANXIETY, currentAnxiety))
        state.updateAnxiety(anxietyDelta)

        // 5. Atualização de Camadas de Áudio e Eventos Dinâmicos
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

        // 6. Monitoramento de Condição de Derrota
        if (currentAnxiety >= GAME_CONFIG.ANXIETY_COLLAPSE_THRESHOLD) {
            setTimeout(() => {
                if (state.gameState.anxiety.level >= GAME_CONFIG.ANXIETY_COLLAPSE_THRESHOLD) {
                    state.setGameState('failed')
                }
            }, GAME_CONFIG.ANXIETY_COLLAPSE_DURATION)
        }
    })

    return <PlayerController />
}