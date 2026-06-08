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
    const wasRunning = useRef(false);
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

        const currentStamina = state.player.stamina;
        let isActuallySprinting = false;

        if (isMoving && isShiftPressed && currentStamina > 0) {
            // O jogador quer correr, está se movendo e TEM fôlego
            isActuallySprinting = true;
            state.updateStamina(-GAME.PLAYER.STAMINA_DEPLETION_RATE * delta);
        } else if (!isShiftPressed || currentStamina <= 0) {
            // Se soltou o shift OU perdeu o fôlego, começa a recuperar devagar
            if (currentStamina < GAME.PLAYER.STAMINA_MAX) {
                state.updateStamina(GAME.PLAYER.STAMINA_REGEN_RATE * delta);
            }
        }

        state.player.isMoving = isMoving
        state.player.isRunning = isActuallySprinting;

        let now = Date.now();
        const stepInterval = isActuallySprinting ? 250 : 400;

        // Lógica de Movimento e Áudio
        if (isMoving) {
            // O jogador ESTÁ pressionando uma tecla de direção (W, A, S, D)
            const isCurrentlyRunning = isActuallySprinting; // Verifica se shift também está apertado

            // 1. Lógica de transição (Andar -> Correr ou Correr -> Andar)
            if (isCurrentlyRunning && !wasRunning.current) {
                audio.stopSFX('player_footstep_walk'); // Para o andar imediatamente
            } else if (!isCurrentlyRunning && wasRunning.current) {
                audio.stopSFX('player_footstep_run');  // Para o correr imediatamente
            }

            // 2. Disparo do som correto baseado no tempo
            if (now - lastStepTime.current > stepInterval) {
                if (isCurrentlyRunning) {
                    audio.playSFX('player_footstep_run', 0.5);
                } else {
                    audio.playSFX('player_footstep_walk', 0.5);
                }
                lastStepTime.current = now;
            }

            // 3. Atualiza os estados de memória
            wasMoving.current = true;
            wasRunning.current = isCurrentlyRunning;

        } else {
            // O jogador NÃO ESTÁ pressionando direção (parou de se mover totalmente)
            // Não importa se ele está segurando o shift parado, o som deve parar.

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

        // --- 4. SISTEMA DE COLISÃO POR EIXOS SEPARADOS (AABB + Sliding) ---

        // A. Eixo X
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

        // B. Eixo Z
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

        // 5. Mecânica de MADNESS
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
        }
        const anxietyDelta = madnessSystem.calculateAnxietyDelta(delta, activeAnxietyMultiplier)
        let currentAnxiety = state.gameState.anxiety.level
        currentAnxiety += anxietyDelta
        currentAnxiety = Math.max(0, Math.min(GAME.ANXIETY.LEVEL_MAX, currentAnxiety))
        state.updateAnxiety(anxietyDelta)

        // 6. Atualização de Camadas de Áudio e Eventos Dinâmicos (RNG)
        audio.updateAnxietyLayer(currentAnxiety)

        now = Date.now()
        // Janela de checagem a cada 4 segundos para não inundar o jogador com sons sobrepostos
        if (now - lastEventTime.current > 4000) {

            // CONDIÇÃO 1: Eventos só começam a acontecer acima de 20% de ansiedade
            if (currentAnxiety > 20) {

                // Fator de ansiedade normalizado (vai de 0.2 a 1.0)
                const anxietyFactor = currentAnxiety / 100;

                // Rola um dado de 0 a 100
                const rollDice = Math.random() * 100;

                // CHANCE ESCALÁVEL: Quanto maior a ansiedade, maior a chance do evento passar no teste.
                // Exemplo: Com 30% de ansiedade, o limite é 12. Com 90%, o limite é 36.
                if (rollDice < (anxietyFactor * 40)) {

                    // SE PASSOU NO TESTE, DECIDE O SOM:
                    // Se a ansiedade estiver acima de 60%, há 50% de chance de ser o GRITO DO MONSTRO
                    if (currentAnxiety > 60 && Math.random() > 0.5) {
                        audio.playSFX('events.entity_scream', 0.7); // Grito aterrorizante
                    } else {
                        audio.playSFX('events.entity_whisper', 0.4); // Assobio / Sussurro
                    }

                    lastEventTime.current = now; // Reseta o relógio do próximo evento
                }
            }
        }

        // --- NOVO: CONSEQUÊNCIA FÍSICA DA ANSIEDADE ALTA (TREMEDEIRA) ---
        // Se a ansiedade passar de 70%, a visão do jogador começa a tremer de pavor
        if (currentAnxiety > 70 && !state.gameState.isPaused) {
            // Calcula a força do tremor com base no quanto passou de 70 (vai de 0 a 1)
            const panicIntensity = (currentAnxiety - 70) / 30;

            // Força máxima do deslocamento da câmera (ajuste se achar muito forte)
            const shakeFactor = panicIntensity * 0.04;

            camera.position.x += (Math.random() - 0.5) * shakeFactor;
            camera.position.y += (Math.random() - 0.5) * shakeFactor;
        }

        // 7. Condição de Derrota
        if (currentAnxiety >= GAME.ANXIETY.THRESHOLD_COLLAPSE) {
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