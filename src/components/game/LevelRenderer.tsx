'use client'

import { WORLD, ASSETS } from '@/config/Constants';
import { metadata as defaultMetaData } from '@/data/Metadata';
import { BLOCKS } from '@/utils/MapGenerator';
import { useGameStore } from '@/store/GameStore'; // <-- O SEGREDO ESTÁ AQUI
import { useMemo } from 'react';
import { EnvironmentBounds } from './EnvironmentBounds';
import { FluorescentLight } from './FluorescentLight';
import { Instance, Instances } from '@react-three/drei';
import { useTexture } from '@react-three/drei';
import { Vector3 } from 'three';

export default function LevelRenderer() {
  // 1. PUXA O MAPA DIRETO DA STORE (O renderer agora é independente!)
  const mapMatrix = useGameStore((state) => state.currentMap);

  // Fallbacks seguros
  const height = mapMatrix?.length || 0;
  const width = mapMatrix?.[0]?.length || 0;

  // 2. CARREGAMENTO DE TEXTURAS
  const wallTexture = useTexture(ASSETS.TEXTURES.WALLPAPER);
  const exit = useTexture(ASSETS.TEXTURES.DOORWAY);

  // 3. PROCESSAMENTO DO MAPA
  const { wallPositions, holePositions, exitPositions, mapLights } = useMemo(() => {
    const walls: Vector3[] = [];
    const holes: Vector3[] = [];
    const exits: Vector3[] = [];
    const lights: JSX.Element[] = [];

    // Se o mapa não estiver pronto, não desenha nada (evita crash)
    if (!mapMatrix) return { wallPositions: walls, holePositions: holes, exitPositions: exits, mapLights: lights };

    mapMatrix.forEach((row, rowIndex) => {
      row.forEach((blockId, colIndex) => {
        const worldX = (colIndex - width / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;
        const worldZ = (rowIndex - height / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;

        // A. LUZES NO TETO
        if (blockId === BLOCKS.FLOOR || blockId === BLOCKS.SPAWN || blockId === BLOCKS.EXIT) {
          if ((rowIndex + colIndex) % 2 === 0) {
            lights.push(
              <FluorescentLight
                key={`light-${rowIndex}-${colIndex}`}
                position={[worldX, WORLD.STRUCTURE_WALL_HEIGHT - 0.5, worldZ]}
                intensity={0.5}
                distance={WORLD.GRID_BLOCK_SIZE * 2.5}
              />
            );
          }
        }

        // B. LEITURA DINÂMICA DO METADATA
        const blockMeta = defaultMetaData[blockId];
        const posY = WORLD.STRUCTURE_WALL_HEIGHT / 2;

        if (blockMeta) {
          if (blockMeta.isHole) {
            holes.push(new Vector3(worldX, 0.01, worldZ));
          } else if (blockMeta.isExit) {
            exits.push(new Vector3(worldX, posY, worldZ));
          } else if (!blockMeta.isInvisible && !blockMeta.walkable) {
            walls.push(new Vector3(worldX, posY, worldZ));
          }
        }
      });
    });

    return {
      wallPositions: walls,
      holePositions: holes,
      exitPositions: exits,
      mapLights: lights,
    };
  }, [mapMatrix, height, width]);

  // Se não tem mapa, não tenta renderizar o grupo 3D
  if (!mapMatrix) return null;

  // 4. RENDERIZAÇÃO DO COMPONENTE
  return (
    <group name="level-geometry">
      <EnvironmentBounds mapWidth={width} mapHeight={height} />

      {/* --- OTIMIZAÇÃO 1: INSTÂNCIAS DE PAREDES --- */}
      {wallPositions.length > 0 && (
        <Instances limit={wallPositions.length}>
          <boxGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.STRUCTURE_WALL_HEIGHT, WORLD.GRID_BLOCK_SIZE]} />
          <meshLambertMaterial map={wallTexture} color="#ffffff" />
          {wallPositions.map((pos, i) => (
            <Instance key={`wall-${i}`} position={pos} />
          ))}
        </Instances>
      )}

      {/* --- BLOCO DE SAÍDA (PORTAL) --- */}
      {exitPositions.length > 0 && (
        <Instances limit={exitPositions.length}>
          <boxGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.STRUCTURE_WALL_HEIGHT, WORLD.GRID_BLOCK_SIZE]} />
          <meshBasicMaterial map={exit} color="#ffffff" />
          {exitPositions.map((pos, i) => (
            <Instance key={`exit-${i}`} position={pos} />
          ))}
        </Instances>
      )}

      {/* --- OTIMIZAÇÃO: BURACOS DE ALTO CONTRASTE --- */}
      {holePositions.length > 0 && (
        <>
          {/* 1. BORDA DE SEGURANÇA (Para o jogador notar o limite do buraco no escuro) */}
          <Instances limit={holePositions.length}>
            <planeGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.GRID_BLOCK_SIZE]} />
            <meshBasicMaterial color="#550000" /> {/* Vermelho Escuro: visível no escuro */}
            {holePositions.map((pos, i) => (
              <Instance key={`hole-rim-${i}`} position={[pos.x, 0.005, pos.z]} rotation={[-Math.PI / 2, 0, 0]} />
            ))}
          </Instances>

          {/* 2. O VAZIO PROFUNDO (Fica no centro) */}
          <Instances limit={holePositions.length}>
            <planeGeometry args={[WORLD.GRID_BLOCK_SIZE * 0.7, WORLD.GRID_BLOCK_SIZE * 0.7]} />
            <meshBasicMaterial color="#000000" /> {/* Preto absoluto */}
            {holePositions.map((pos, i) => (
              <Instance key={`hole-void-${i}`} position={[pos.x, 0.01, pos.z]} rotation={[-Math.PI / 2, 0, 0]} />
            ))}
          </Instances>

          {/* 3. LUZ DE ANOMALIA (Sinaliza que ali tem algo errado) */}
          {holePositions.map((pos, i) => (
            <pointLight
              key={`hole-warning-${i}`}
              position={[pos.x, 0.5, pos.z]}
              intensity={0.8}
              distance={WORLD.GRID_BLOCK_SIZE}
              color="#ff3333" // Vermelho mais vibrante
            />
          ))}
        </>
      )}

      {/* --- LUZES FLUORESCENTES GLOBAIS --- */}
      <group name="procedural-lights">
        {mapLights}
      </group>

    </group>
  );
}