'use client'

import { keysPressed } from '@/components/game/Input';
import PlayerController from '@/components/game/PlayerController';
import { getAudioSystem } from '@/config/AudioSystem';
import { WORLD, GAME } from '@/config/Constants';
import { madnessSystem } from '@/config/MadnessSystem';
import { mapMatrix as defaultMapMatrix } from '@/data/Map';
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
    const { camera } = useThree();

    // LEITURA REATIVA CORRETA DO ZUSTAND:
    const currentGameState = useGameStore((state) => state.gameState.state);

    // 1. Resete o contador sempre que o jogo iniciar de fato
    useEffect(() => {
        if (currentGameState === 'playing') {
            framesSinceStart.current = 0;
        }
    }, [currentGameState]);

    // 2. Garante o teleporte inicial da câmera para o Spawn
    useEffect(() => {
        const spawnPosition = useGameStore.getState().player.position;

        camera.position.set(spawnPosition[0], spawnPosition[1], spawnPosition[2]);
        camera.rotation.set(0, 0, 0);

        isFalling.current = false;
        hasDied.current = false;
    }, [camera]);

    // 3. O ÚNICO LOOP DE JOGO (useFrame)
    useFrame((_, delta) => {
        const audio = getAudioSystem()
        const state = useGameStore.getState()

        // CONDIÇÃO CORRIGIDA: Se não for 'playing' OU estiver pausado, congela.
        if (state.gameState.state !== 'playing' || state.gameState.isPaused) return;
        // --- GUARDA DE TELEPORTE (Agora sim bloqueia a gravidade!) ---
        // Dá 10 frames de tempo para a câmera ser renderizada no Spawn correto antes de calcular as mortes
        if (framesSinceStart.current < 10) {
            framesSinceStart.current++;
            return;
        }

        // 1. Atualiza tempo do jogo
        state.incrementTime(delta * 1000)

        // --- MOTOR DE GRAVIDADE (QUEDA) ---
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

        // 2. Processa Inputs de Movimento
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

        // --- ESTAMINA ---
        const currentStamina = state.player.stamina;
        let isActuallySprinting = false;

        if (isMoving && isShiftPressed && currentStamina > 0) {
            isActuallySprinting = true;
            state.updateStamina(-GAME.PLAYER.STAMINA_DEPLETION_RATE * delta);
        } else if (!isShiftPressed || currentStamina <= 0) {
            if (currentStamina < GAME.PLAYER.STAMINA_MAX) {
                state.updateStamina(GAME.PLAYER.STAMINA_REGEN_RATE * delta);
            }
        }

        state.player.isMoving = isMoving
        state.player.isRunning = isActuallySprinting;

        let now = Date.now();
        const stepInterval = isActuallySprinting ? 250 : 400;

        // --- ÁUDIO DE PASSOS ---
        if (isMoving) {
            const isCurrentlyRunning = isActuallySprinting;

            if (isCurrentlyRunning && !wasRunning.current) {
                audio.stopSFX('player_footstep_walk');
            } else if (!isCurrentlyRunning && wasRunning.current) {
                audio.stopSFX('player_footstep_run');
            }

            if (now - lastStepTime.current > stepInterval) {
                if (isCurrentlyRunning) {
                    audio.playSFX('player_footstep_run', 0.5);
                } else {
                    audio.playSFX('player_footstep_walk', 0.5);
                }
                lastStepTime.current = now;
            }

            wasMoving.current = true;
            wasRunning.current = isCurrentlyRunning;

        } else {
            if (wasMoving.current || wasRunning.current) {
                audio.stopSFX('player_footstep_walk');
                audio.stopSFX('player_footstep_run');
                wasMoving.current = false;
                wasRunning.current = false;
            }
        }

        if (moveDirection.length() > 0) {
            moveDirection.normalize()
        }

        const speed = isActuallySprinting ? GAME.PLAYER.SPEED_MOVE * GAME.PLAYER.SPEED_SPRINT_MULTIPLIER : GAME.PLAYER.SPEED_MOVE

        const width = defaultMapMatrix[0].length
        const height = defaultMapMatrix.length
        const radius = GAME.PLAYER.PHYSICS_COLLISION_RADIUS

        // --- COLISÃO EIXO X ---
        camera.position.x += moveDirection.x * speed * delta
        let curCol = Math.floor((camera.position.x / WORLD.GRID_BLOCK_SIZE) + (width / 2))
        let curRow = Math.floor((camera.position.z / WORLD.GRID_BLOCK_SIZE) + (height / 2))

        for (let r = curRow - 1; r <= curRow + 1; r++) {
            for (let c = curCol - 1; c <= curCol + 1; c++) {
                if (r < 0 || r >= height || c < 0 || c >= width || !defaultMetaData[String(defaultMapMatrix[r][c]) as keyof typeof defaultMetaData]?.walkable) {
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

        // --- COLISÃO EIXO Z ---
        camera.position.z += moveDirection.z * speed * delta
        curCol = Math.floor((camera.position.x / WORLD.GRID_BLOCK_SIZE) + (width / 2))
        curRow = Math.floor((camera.position.z / WORLD.GRID_BLOCK_SIZE) + (height / 2))

        for (let r = curRow - 1; r <= curRow + 1; r++) {
            for (let c = curCol - 1; c <= curCol + 1; c++) {
                if (r < 0 || r >= height || c < 0 || c >= width || !defaultMetaData[String(defaultMapMatrix[r][c]) as keyof typeof defaultMetaData]?.walkable) {
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

        // 5. Mecânica de MADNESS & Verificação de Piso
        const currentCol = Math.floor((camera.position.x / WORLD.GRID_BLOCK_SIZE) + (width / 2))
        const currentRow = Math.floor((camera.position.z / WORLD.GRID_BLOCK_SIZE) + (height / 2))
        const isCurrentOutside = currentRow < 0 || currentRow >= height || currentCol < 0 || currentCol >= width
        let activeAnxietyMultiplier = 1.0

        if (!isCurrentOutside) {
            const currentBlockId = defaultMapMatrix[currentRow][currentCol]
            const currentBlockMeta = defaultMetaData[String(currentBlockId) as keyof typeof defaultMetaData]

            if (currentBlockMeta) {
                activeAnxietyMultiplier = currentBlockMeta.anxietyMultiplier
            }

            // --- DETECTOR DE BURACO SEGURO ---
            if (currentBlockMeta?.isHole === true && !isFalling.current) {
                isFalling.current = true;
                audio.stopSFX('player_footstep_walk');
                audio.stopSFX('player_footstep_run');
                audio.playSFX('events.entity_scream', 0.8);
            }

            // --- FÍSICA DA PONTE NORTE-SUL (Cai nas laterais X) ---
            if (currentBlockMeta?.isBridgeNS && !isFalling.current) {
                const blockCenterX = (currentCol - width / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;
                if (Math.abs(camera.position.x - blockCenterX) > 0.5) {
                    isFalling.current = true;
                    audio.stopSFX('player_footstep_walk');
                    audio.stopSFX('player_footstep_run');
                    audio.playSFX('events.entity_scream', 0.8);
                }
            }

            // --- FÍSICA DA PONTE LESTE-OESTE (Cai nas laterais Z) ---
            if (currentBlockMeta?.isBridgeWE && !isFalling.current) {
                const blockCenterZ = (currentRow - height / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;
                if (Math.abs(camera.position.z - blockCenterZ) > 0.5) {
                    isFalling.current = true;
                    audio.stopSFX('player_footstep_walk');
                    audio.stopSFX('player_footstep_run');
                    audio.playSFX('events.entity_scream', 0.8);
                }
            }

            // --- FÍSICA DA QUINA/ESQUINA CORRIGIDA (Operador &&) ---
            if (currentBlockMeta?.isBridgeCorner && !isFalling.current) {
                const blockCenterX = (currentCol - width / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;
                const blockCenterZ = (currentRow - height / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;

                if (Math.abs(camera.position.x - blockCenterX) > 0.5 && Math.abs(camera.position.z - blockCenterZ) > 0.5) {
                    isFalling.current = true;
                    audio.stopSFX('player_footstep_walk');
                    audio.stopSFX('player_footstep_run');
                    audio.playSFX('events.entity_scream', 0.8);
                }
            }
        }

        const anxietyDelta = madnessSystem.calculateAnxietyDelta(delta, activeAnxietyMultiplier)
        let currentAnxiety = state.gameState.anxiety.level
        currentAnxiety += anxietyDelta
        currentAnxiety = Math.max(0, Math.min(GAME.ANXIETY.LEVEL_MAX, currentAnxiety))
        state.updateAnxiety(anxietyDelta)

        // 6. Atualização de Áudio e Eventos (RNG)
        audio.updateAnxietyLayer(currentAnxiety)

        now = Date.now()
        if (now - lastEventTime.current > 4000) {
            if (currentAnxiety > 20) {
                const anxietyFactor = currentAnxiety / 100;
                const rollDice = Math.random() * 100;

                if (rollDice < (anxietyFactor * 40)) {
                    if (currentAnxiety > 60 && Math.random() > 0.5) {
                        audio.playSFX('events.entity_scream', 0.7);
                    } else {
                        audio.playSFX('events.entity_whisper', 0.4);
                    }
                    lastEventTime.current = now;
                }
            }
        }

        // CONSEQUÊNCIA FÍSICA DA ANSIEDADE ALTA
        if (currentAnxiety > 70 && !state.gameState.isPaused) {
            const panicIntensity = (currentAnxiety - 70) / 30;
            const shakeFactor = panicIntensity * 0.04;
            camera.position.x += (Math.random() - 0.5) * shakeFactor;
            camera.position.y += (Math.random() - 0.5) * shakeFactor;
        }

        // 7. Condição de Derrota pela Ansiedade
        if (currentAnxiety >= GAME.ANXIETY.THRESHOLD_COLLAPSE && !hasDied.current) {
            hasDied.current = true;
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