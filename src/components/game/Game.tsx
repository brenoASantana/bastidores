'use client'

import { keysPressed } from '@/components/game/Input';
import PlayerController from '@/components/game/PlayerController';
import { getAudioSystem } from '@/config/AudioSystem';
import { WORLD, GAME, MADNESS } from '@/config/Constants';
import { madnessSystem } from '@/config/MadnessSystem';
import { mapMatrix as defaultMapMatrix } from '@/data/Map';
import { metadata as defaultMetaData } from '@/data/Metadata';
import { useGameStore } from '@/store/GameStore';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

export default function Game() {
    const lastEventTime = useRef(0)
    const lastStepTime = useRef(0);
    const wasMoving = useRef(false);
    const { camera } = useThree()

    useFrame((_, delta) => {
        const audio = getAudioSystem()
        const state = useGameStore.getState()

        if (state.gameState.isPaused) return

        // 1. Atualiza tempo do jogo
        state.incrementTime(delta * 1000)

        // 2. Processa Inputs de Movimento
        const moveDirection = new Vector3()
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

        // Lógica de Movimento e Áudio
        if (isMoving) {
            const now = Date.now();
            const stepInterval = isSprinting ? 250 : 400;

            if (now - lastStepTime.current > stepInterval) {
                audio.playSFX(isSprinting ? 'running' : 'footsteps', 0.5);
                lastStepTime.current = now;
            }
            wasMoving.current = true; // Você está andando
        } else {
            // SE VOCÊ PAROU AGORA:
            if (wasMoving.current) {
                audio.stopSFX('footsteps');
                audio.stopSFX('running');
                wasMoving.current = false; // Resetamos o estado
            }
        }
        if (moveDirection.length() > 0) {
            moveDirection.normalize()
        }

        const speed = isSprinting ? GAME.PLAYER.MOVE_SPEED * GAME.PLAYER.SPRINT_MULTIPLIER : GAME.PLAYER.MOVE_SPEED

        const width = defaultMapMatrix[0].length
        const height = defaultMapMatrix.length
        const radius = GAME.PLAYER.COLLISION_RADIUS

        // --- 4. SISTEMA DE COLISÃO POR EIXOS SEPARADOS (AABB + Sliding) ---

        // A. Eixo X
        camera.position.x += moveDirection.x * speed * delta
        let curCol = Math.floor((camera.position.x / WORLD.BLOCK_SIZE) + (width / 2))
        let curRow = Math.floor((camera.position.z / WORLD.BLOCK_SIZE) + (height / 2))

        for (let r = curRow - 1; r <= curRow + 1; r++) {
            for (let c = curCol - 1; c <= curCol + 1; c++) {
                if (r < 0 || r >= height || c < 0 || c >= width || !defaultMetaData[String(defaultMapMatrix[r][c]) as keyof typeof defaultMetaData]?.walkable) {
                    const wallCenterX = (c - width / 2 + 0.5) * WORLD.BLOCK_SIZE
                    const wallCenterZ = (r - height / 2 + 0.5) * WORLD.BLOCK_SIZE
                    const minX = wallCenterX - WORLD.BLOCK_SIZE / 2
                    const maxX = wallCenterX + WORLD.BLOCK_SIZE / 2
                    const minZ = wallCenterZ - WORLD.BLOCK_SIZE / 2
                    const maxZ = wallCenterZ + WORLD.BLOCK_SIZE / 2
                    const closestX = Math.max(minX, Math.min(camera.position.x, maxX))
                    const closestZ = Math.max(minZ, Math.min(camera.position.z, maxZ))
                    const distX = camera.position.x - closestX
                    const distZ = camera.position.z - closestZ
                    const distance = Math.sqrt(distX * distX + distZ * distZ)
                    if (distance < radius && distance > 0) {
                        camera.position.x += (distX / distance) * (radius - distance)
                    }
                }
            }
        }

        // B. Eixo Z
        camera.position.z += moveDirection.z * speed * delta
        curCol = Math.floor((camera.position.x / WORLD.BLOCK_SIZE) + (width / 2))
        curRow = Math.floor((camera.position.z / WORLD.BLOCK_SIZE) + (height / 2))

        for (let r = curRow - 1; r <= curRow + 1; r++) {
            for (let c = curCol - 1; c <= curCol + 1; c++) {
                if (r < 0 || r >= height || c < 0 || c >= width || !defaultMetaData[String(defaultMapMatrix[r][c]) as keyof typeof defaultMetaData]?.walkable) {
                    const wallCenterX = (c - width / 2 + 0.5) * WORLD.BLOCK_SIZE
                    const wallCenterZ = (r - height / 2 + 0.5) * WORLD.BLOCK_SIZE
                    const minX = wallCenterX - WORLD.BLOCK_SIZE / 2
                    const maxX = wallCenterX + WORLD.BLOCK_SIZE / 2
                    const minZ = wallCenterZ - WORLD.BLOCK_SIZE / 2
                    const maxZ = wallCenterZ + WORLD.BLOCK_SIZE / 2
                    const closestX = Math.max(minX, Math.min(camera.position.x, maxX))
                    const closestZ = Math.max(minZ, Math.min(camera.position.z, maxZ))
                    const distX = camera.position.x - closestX
                    const distZ = camera.position.z - closestZ
                    const distance = Math.sqrt(distX * distX + distZ * distZ)
                    if (distance < radius && distance > 0) {
                        camera.position.z += (distZ / distance) * (radius - distance)
                    }
                }
            }
        }

        // 5. Mecânica de MADNESS
        const currentCol = Math.floor((camera.position.x / WORLD.BLOCK_SIZE) + (width / 2))
        const currentRow = Math.floor((camera.position.z / WORLD.BLOCK_SIZE) + (height / 2))
        const isCurrentOutside = currentRow < 0 || currentRow >= height || currentCol < 0 || currentCol >= width
        let activeAnxietyMultiplier = 1.0

        if (!isCurrentOutside) {
            const currentBlockId = defaultMapMatrix[currentRow][currentCol]
            const currentBlockMeta = defaultMetaData[String(currentBlockId) as keyof typeof defaultMetaData]
            if (currentBlockMeta) {
                activeAnxietyMultiplier = currentBlockMeta.anxietyMultiplier
            }
        }
        const anxietyDelta = madnessSystem.calculateAnxietyDelta(delta, activeAnxietyMultiplier)
        let currentAnxiety = state.gameState.anxiety.level
        currentAnxiety += anxietyDelta
        currentAnxiety = Math.max(0, Math.min(GAME.ANXIETY.MAX, currentAnxiety))
        state.updateAnxiety(anxietyDelta)

        // 6. Atualização de Camadas de Áudio e Eventos
        audio.updateAnxietyLayer(currentAnxiety)

        const now = Date.now()
        if (now - lastEventTime.current > 3000) {
            if (madnessSystem.shouldTriggerEvent(MADNESS.EVENTS.WHISPER, currentAnxiety, delta)) {
                audio.playSFX('whisper', 0.5);
                lastEventTime.current = now;
            }
        }

        // 7. Condição de Derrota
        if (currentAnxiety >= GAME.ANXIETY.COLLAPSE_THRESHOLD) {
            setTimeout(() => {
                const latestState = useGameStore.getState()
                if (latestState.gameState.anxiety.level >= GAME.ANXIETY.COLLAPSE_THRESHOLD) {
                    latestState.setGameState('failed')
                }
            }, GAME.ANXIETY.COLLAPSE_DURATION)
        }
    })

    return <PlayerController />
}