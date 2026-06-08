'use client'

import { WORLD, ASSETS } from '@/config/Constants';
import { mapMatrix as defaultMapMatrix } from '@/data/Map';
import { metadata as defaultMetaData } from '@/data/Metadata';
import { useMemo } from 'react';
import { EnvironmentBounds } from './EnvironmentBounds';
import { FluorescentLight } from './FluorescentLight';
import { Instance, Instances } from '@react-three/drei';
import { useTexture } from '@react-three/drei';
import { Vector3 } from 'three';

interface LevelRendererProps {
  mapMatrix?: number[][]
}

export default function LevelRenderer({ mapMatrix = defaultMapMatrix }: LevelRendererProps) {
  const height = mapMatrix.length;
  const width = mapMatrix[0]?.length || 0;

  // 1. CARREGAMENTO DE TEXTURAS
  const wallTexture = useTexture(ASSETS.TEXTURES.WALLPAPER);

  // 2. PROCESSAMENTO DO MAPA (useMemo agora isolado corretamente)
  const { wallPositions, holePositions, mapLights, bridgeNS, bridgeWE, bridgeCorner } = useMemo(() => {
    const walls: Vector3[] = [];
    const holes: Vector3[] = [];
    const lights: JSX.Element[] = [];
    const ns: Vector3[] = [];
    const we: Vector3[] = [];
    const corner: Vector3[] = [];

    mapMatrix.forEach((row, rowIndex) => {
      row.forEach((blockId, colIndex) => {
        const worldX = (colIndex - width / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;
        const worldZ = (rowIndex - height / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;

        // A. CHÃO (ESPAÇO VAZIO) E LUZES
        if (blockId === 0 || blockId === 10) {
          if ((rowIndex + colIndex) % 2 === 0) {
            lights.push(
              <FluorescentLight
                key={`light-${rowIndex}-${colIndex}`}
                position={[worldX, WORLD.STRUCTURE_WALL_HEIGHT - 0.5, worldZ]}
                intensity={1.8}
                distance={WORLD.GRID_BLOCK_SIZE * 2.5}
              />
            );
          }
          return;
        }

        // B. SEPARAÇÃO DOS BLOCOS (Lógica Corrigida com else if)
        const blockMeta = defaultMetaData[String(blockId) as keyof typeof defaultMetaData];
        const posY = WORLD.STRUCTURE_WALL_HEIGHT / 2;

        if (blockMeta?.isHole) {
          holes.push(new Vector3(worldX, 0.01, worldZ));
        } else if (blockMeta?.isBridgeNS) {
          ns.push(new Vector3(worldX, 0.012, worldZ));
        } else if (blockMeta?.isBridgeWE) {
          we.push(new Vector3(worldX, 0.012, worldZ));
        } else if (blockMeta?.isBridgeCorner) {
          corner.push(new Vector3(worldX, 0.012, worldZ));
        } else if (!blockMeta?.isInvisible) {
          walls.push(new Vector3(worldX, posY, worldZ));
        }
      });
    });

    // O return do useMemo devolve os arrays prontos
    return {
      wallPositions: walls,
      holePositions: holes,
      mapLights: lights,
      bridgeNS: ns,
      bridgeWE: we,
      bridgeCorner: corner,
    };
  }, [mapMatrix, height, width]);

  // 3. RENDERIZAÇÃO DO COMPONENTE
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

      {/* --- OTIMIZAÇÃO 3: BURACOS (Ameaça Física) --- */}
      {holePositions.length > 0 && (
        <Instances limit={holePositions.length}>
          <planeGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.GRID_BLOCK_SIZE]} />
          <meshBasicMaterial color="#000000" />
          {holePositions.map((pos, i) => (
            <Instance key={`hole-${i}`} position={pos} rotation={[-Math.PI / 2, 0, 0]} />
          ))}
        </Instances>
      )}

      {/* --- 1. PONTE NORTE-SUL (Fina no X, Longa no Z) --- */}
      {bridgeNS.length > 0 && (
        <Instances limit={bridgeNS.length}>
          <planeGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.GRID_BLOCK_SIZE]} />
          <meshLambertMaterial color="#262626" />
          {bridgeNS.map((pos, i) => (
            <Instance key={`ns-${i}`} position={pos} rotation={[-Math.PI / 2, 0, 0]} scale={[0.25, 1, 1]} />
          ))}
        </Instances>
      )}

      {/* --- 2. PONTE LESTE-OESTE (Longa no X, Fina no Z) --- */}
      {bridgeWE.length > 0 && (
        <Instances limit={bridgeWE.length}>
          <planeGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.GRID_BLOCK_SIZE]} />
          <meshLambertMaterial color="#262626" />
          {bridgeWE.map((pos, i) => (
            <Instance key={`we-${i}`} position={pos} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 0.25]} />
          ))}
        </Instances>
      )}

      {/* --- 3. A QUINA DA PONTE (Um pequeno quadrado 1x1 no centro) --- */}
      {bridgeCorner.length > 0 && (
        <Instances limit={bridgeCorner.length}>
          <planeGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.GRID_BLOCK_SIZE]} />
          <meshLambertMaterial color="#262626" />
          {bridgeCorner.map((pos, i) => (
            <Instance key={`corner-${i}`} position={pos} rotation={[-Math.PI / 2, 0, 0]} scale={[0.25, 1, 0.25]} />
          ))}
        </Instances>
      )}

      {/* --- LUZES --- */}
      <group name="procedural-lights">
        {mapLights}
      </group>

    </group>
  );
}