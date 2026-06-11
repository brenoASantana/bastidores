'use client'

import { keysPressed } from '@/components/game/Input';
import PlayerController from '@/components/game/PlayerController';
import { getAudioSystem } from '@/config/AudioSystem';
import { WORLD, GAME } from '@/config/Constants';
import { madnessSystem } from '@/config/MadnessSystem';
import { metadata as defaultMetaData } from '@/data/Metadata';
import { useGameStore } from '@/store/GameStore';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Vector3 } from 'three';


export default function Game() {
    const lastEventTime = useRef(0)
    const lastStepTime = useRef(0);
    const wasMoving = useRef(false);
    const wasRunning = useRef(false);
    const isFalling = useRef(false);
    const hasDied = useRef(false);
    const framesSinceStart = useRef(0);
    const currentMap = useGameStore((state) => state.currentMap);

    const staminaLock = useRef(false);
    const wasExhausted = useRef(false);
    const hasPlayedWhisper = useRef(false);
    const hasPlayedEntityScream = useRef(false);
    const hasPlayedVictimScream = useRef(false);

    const { camera } = useThree();
    const currentGameState = useGameStore((state) => state.gameState.state);

    useEffect(() => {
        if (currentGameState === 'playing') {
            framesSinceStart.current = 0;
            isFalling.current = false;
            hasDied.current = false;

            const spawnPosition = useGameStore.getState().player.position;

            camera.position.set(spawnPosition[0], spawnPosition[1], spawnPosition[2]);
            camera.rotation.set(0, 0, 0);
        }
    }, [currentGameState, camera]);

    useFrame((_, delta) => {

        if (!currentMap) return;

        const audio = getAudioSystem()
        const state = useGameStore.getState()

        if (state.gameState.state !== 'playing' || state.gameState.isPaused) return;

        if (framesSinceStart.current < 10) {
            framesSinceStart.current++;
            return;
        }

        state.incrementTime(delta * 1000)

        if (isFalling.current) {
            camera.position.y -= 15 * delta;
            camera.rotation.z += 5 * delta;

            if (camera.position.y < -10 && !hasDied.current) {
                hasDied.current = true;
                state.updateAnxiety(100);
                state.setGameState('failed');
            }
            return;
        }

        const moveDirection = new Vector3()
        const forward = new Vector3(0, 0, -1)
        const right = new Vector3(1, 0, 0)

        forward.applyAxisAngle(new Vector3(0, 1, 0), camera.rotation.y)
        right.applyAxisAngle(new Vector3(0, 1, 0), camera.rotation.y)

        const isShiftPressed = keysPressed['shift']
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

        // ==========================================
        // SISTEMA DE ESTAMINA
        // ==========================================
        const currentStamina = state.player.stamina;
        let isActuallySprinting = false;

        if (!isShiftPressed) {
            staminaLock.current = false;
        }

        if (currentStamina <= 0) {
            staminaLock.current = true;
        }

        if (isMoving && isShiftPressed && currentStamina > 0 && !staminaLock.current) {
            isActuallySprinting = true;
            state.updateStamina(-GAME.PLAYER.STAMINA_DEPLETION_RATE * delta);
        } else {
            if (currentStamina < GAME.PLAYER.STAMINA_MAX) {
                state.updateStamina(GAME.PLAYER.STAMINA_REGEN_RATE * delta);
            }
        }

        state.player.isMoving = isMoving;
        state.player.isRunning = isActuallySprinting;

        // ==========================================
        // SISTEMA DE RESPIRAÇÃO PESADA
        // ==========================================
        const isPanicking = state.gameState.anxiety.level > 70;

        if (currentStamina <= 0 && !wasExhausted.current) {
            wasExhausted.current = true;
            if (!isPanicking) {
                audio.startLoopingSFX('out_of_breath', 0.6);
            }
        }

        if (isPanicking && !wasExhausted.current) {
            wasExhausted.current = true;
            audio.startLoopingSFX('out_of_breath', 0.6);
        }

        if (wasExhausted.current && !isPanicking && currentStamina > GAME.PLAYER.STAMINA_MAX * 0.8) {
            audio.stopSFX('out_of_breath');
            wasExhausted.current = false;
        }

        let now = Date.now();
        const stepInterval = isActuallySprinting ? 320 : 500;

        if (isMoving) {
            const isCurrentlyRunning = isActuallySprinting;
            if (now - lastStepTime.current > stepInterval) {

                audio.stopSFX('player_footstep_walk');

                if (isCurrentlyRunning) {
                    audio.playSFX('player_footstep_walk', 0.6, 1.4);
                } else {
                    audio.playSFX('player_footstep_walk', 0.5, 1.0);
                }
                lastStepTime.current = now;
            }
            wasMoving.current = true;
            wasRunning.current = isCurrentlyRunning;
        } else {
            if (wasMoving.current || wasRunning.current) {
                audio.stopSFX('player_footstep_walk');
                wasMoving.current = false;
                wasRunning.current = false;
            }
        }

        if (moveDirection.length() > 0) {
            moveDirection.normalize()
        }

        const speed = isActuallySprinting ? GAME.PLAYER.SPEED_MOVE * GAME.PLAYER.SPEED_SPRINT_MULTIPLIER : GAME.PLAYER.SPEED_MOVE
        const width = currentMap[0].length
        const height = currentMap.length
        const radius = GAME.PLAYER.PHYSICS_COLLISION_RADIUS

        // --- COLISÃO NO EIXO X ---
        camera.position.x += moveDirection.x * speed * delta
        let curCol = Math.floor((camera.position.x / WORLD.GRID_BLOCK_SIZE) + (width / 2))
        let curRow = Math.floor((camera.position.z / WORLD.GRID_BLOCK_SIZE) + (height / 2))

        for (let r = curRow - 1; r <= curRow + 1; r++) {
            for (let c = curCol - 1; c <= curCol + 1; c++) {
                // LEITURA DIRETA DO METADATA SEM CONVERSÃO DE STRING:
                if (r < 0 || r >= height || c < 0 || c >= width || !defaultMetaData[currentMap[r][c]]?.walkable) {
                    const wallCenterX = (c - width / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE
                    const wallCenterZ = (r - height / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE
                    const minX = wallCenterX - WORLD.GRID_BLOCK_SIZE / 2
                    const maxX = wallCenterX + WORLD.GRID_BLOCK_SIZE / 2
                    const minZ = wallCenterZ - WORLD.GRID_BLOCK_SIZE / 2
                    const maxZ = wallCenterZ + WORLD.GRID_BLOCK_SIZE / 2
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

        // --- COLISÃO NO EIXO Z ---
        camera.position.z += moveDirection.z * speed * delta
        curCol = Math.floor((camera.position.x / WORLD.GRID_BLOCK_SIZE) + (width / 2))
        curRow = Math.floor((camera.position.z / WORLD.GRID_BLOCK_SIZE) + (height / 2))

        for (let r = curRow - 1; r <= curRow + 1; r++) {
            for (let c = curCol - 1; c <= curCol + 1; c++) {
                // LEITURA DIRETA DO METADATA SEM CONVERSÃO DE STRING:
                if (r < 0 || r >= height || c < 0 || c >= width || !defaultMetaData[currentMap[r][c]]?.walkable) {
                    const wallCenterX = (c - width / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE
                    const wallCenterZ = (r - height / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE
                    const minX = wallCenterX - WORLD.GRID_BLOCK_SIZE / 2
                    const maxX = wallCenterX + WORLD.GRID_BLOCK_SIZE / 2
                    const minZ = wallCenterZ - WORLD.GRID_BLOCK_SIZE / 2
                    const maxZ = wallCenterZ + WORLD.GRID_BLOCK_SIZE / 2
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

        // --- VERIFICAÇÃO DE BLOCO ATUAL (BURACOS, SAÍDA, ANSIEDADE) ---
        const currentCol = Math.floor((camera.position.x / WORLD.GRID_BLOCK_SIZE) + (width / 2))
        const currentRow = Math.floor((camera.position.z / WORLD.GRID_BLOCK_SIZE) + (height / 2))
        const isCurrentOutside = currentRow < 0 || currentRow >= height || currentCol < 0 || currentCol >= width
        let activeAnxietyMultiplier = 1.0

        if (!isCurrentOutside) {
            const currentBlockId = currentMap[currentRow][currentCol]

            // LEITURA DIRETA E SEGURA:
            const currentBlockMeta = defaultMetaData[currentBlockId]

            if (currentBlockMeta) {
                activeAnxietyMultiplier = currentBlockMeta.anxietyMultiplier
            }

            if (currentBlockMeta?.isExit && !hasDied.current) {
                hasDied.current = true;
                audio.stopSFX('player_footstep_walk');
                audio.stopSFX('out_of_breath');
                state.setGameState('completed');
                return;
            }

            if (currentBlockMeta?.isHole === true && !isFalling.current) {
                isFalling.current = true;
                audio.stopSFX('player_footstep_walk');
                audio.playSFX('entity_scream', 0.8);
            }
        }

        const anxietyDelta = madnessSystem.calculateAnxietyDelta(delta, activeAnxietyMultiplier)
        let currentAnxiety = state.gameState.anxiety.level
        currentAnxiety += anxietyDelta
        currentAnxiety = Math.max(0, Math.min(GAME.ANXIETY.LEVEL_MAX, currentAnxiety))
        state.updateAnxiety(anxietyDelta)

        audio.updateAnxietyLayer(currentAnxiety)
        now = Date.now()

        // --- EVENTOS ÚNICOS ---
        if (now - lastEventTime.current > 4000) {
            if (currentAnxiety > 20) {
                const anxietyFactor = currentAnxiety / 100;
                const rollDice = Math.random() * 100;

                if (rollDice < (anxietyFactor * 40)) {
                    if (currentAnxiety > 60 && !hasPlayedEntityScream.current && Math.random() > 0.3) {
                        audio.playSFX('entity_scream', 0.8);
                        hasPlayedEntityScream.current = true;
                    }
                    else if (!hasPlayedWhisper.current) {
                        audio.playSFX('entity_whisper', 0.7);
                        hasPlayedWhisper.current = true;
                    }
                }

                lastEventTime.current = now;
            }
        }

        // --- CONSEQUÊNCIAS FÍSICAS DA ANSIEDADE ALTA ---
        if (currentAnxiety > 70 && !state.gameState.isPaused) {
            const panicIntensity = (currentAnxiety - 70) / 30;
            const shakeFactor = panicIntensity * 0.04;
            camera.position.x += (Math.random() - 0.5) * shakeFactor;
            camera.position.y += (Math.random() - 0.5) * shakeFactor;
        }

        // --- GAME OVER ---
        if (currentAnxiety >= GAME.ANXIETY.THRESHOLD_COLLAPSE && !hasDied.current) {
            hasDied.current = true;

            if (!hasPlayedVictimScream.current) {
                audio.playSFX('victim_scream', 1.0);
                hasPlayedVictimScream.current = true;
            }

            audio.stopSFX('out_of_breath');
            audio.stopSFX('player_footstep_walk');

            setTimeout(() => {
                const latestState = useGameStore.getState()
                if (latestState.gameState.anxiety.level >= GAME.ANXIETY.THRESHOLD_COLLAPSE) {
                    latestState.setGameState('failed')
                }
            }, GAME.ANXIETY.DURATION_COLLAPSE_MS)
        }
    })

    return <PlayerController />
}