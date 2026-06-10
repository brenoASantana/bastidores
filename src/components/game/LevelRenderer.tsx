'use client'

import { WORLD, ASSETS } from '@/config/Constants';
import { metadata as defaultMetaData } from '@/data/Metadata';
import { BLOCKS } from '@/utils/MapGenerator';
import { useGameStore } from '@/store/GameStore';
import { useMemo } from 'react';
import { EnvironmentBounds } from './EnvironmentBounds';
import { FluorescentLight } from './FluorescentLight';
import { Instance, Instances, useTexture } from '@react-three/drei';
import { Vector3 } from 'three';

export default function LevelRenderer() {
  const mapMatrix = useGameStore((state) => state.currentMap);
  const height = mapMatrix?.length || 0;
  const width = mapMatrix?.[0]?.length || 0;

  // 1. CARREGAMENTO DE TEXTURAS (Caminhos relativos à pasta public)
  const wallTexture = useTexture(ASSETS.TEXTURES.WALLPAPER);
  const carpetTexture = useTexture(ASSETS.TEXTURES.CARPET);
  const exit = useTexture(ASSETS.TEXTURES.DOORWAY);

  wallTexture.colorSpace = 'srgb';
  carpetTexture.colorSpace = 'srgb';

  const { wallPositions, exitPositions, floorPositions, mapLights } = useMemo(() => {
    const walls: Vector3[] = [];
    const holes: Vector3[] = [];
    const exits: Vector3[] = [];
    const floors: Vector3[] = [];
    const lights: JSX.Element[] = [];

    if (!mapMatrix) return { wallPositions: walls, holePositions: holes, exitPositions: exits, floorPositions: floors, mapLights: lights };

    mapMatrix.forEach((row, rowIndex) => {
      row.forEach((blockId, colIndex) => {
        const worldX = (colIndex - width / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;
        const worldZ = (rowIndex - height / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;

        if (blockId !== BLOCKS.WALL) {
          floors.push(new Vector3(worldX, 0, worldZ));
          if ((rowIndex + colIndex) % 4 === 0) { // Menos lâmpadas para não pesar
            lights.push(
              <FluorescentLight
                key={`light-${rowIndex}-${colIndex}`}
                // Altere para uma altura que fique "encostada" no teto, mas visível
                position={[worldX, WORLD.STRUCTURE_WALL_HEIGHT - 0.1, worldZ]}
                intensity={1.2}
                distance={WORLD.GRID_BLOCK_SIZE * 4}
              />
            );
          }
        }

        const blockMeta = defaultMetaData[blockId];
        const posY = WORLD.STRUCTURE_WALL_HEIGHT / 2;

        if (blockMeta && !blockMeta.walkable && !blockMeta.isInvisible) {
          walls.push(new Vector3(worldX, posY, worldZ));
        } else if (blockMeta?.isExit) {
          exits.push(new Vector3(worldX, posY, worldZ));
        }
      });
    });

    return { wallPositions: walls, holePositions: holes, exitPositions: exits, floorPositions: floors, mapLights: lights };
  }, [mapMatrix, height, width]);

  if (!mapMatrix) return null;

  return (
    <group name="level-geometry">
      <ambientLight intensity={0.2} color="#ffffff" />
      <EnvironmentBounds mapWidth={width} mapHeight={height} />

      <Instances limit={floorPositions.length}>
        <planeGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.GRID_BLOCK_SIZE]} />
        {/* Remova o 'emissive' se ele estiver deixando o carpete com cor de plástico */}
        <meshLambertMaterial map={carpetTexture} />
        {floorPositions.map((pos, i) => (
          <Instance key={`floor-${i}`} position={[pos.x, 0.001, pos.z]} rotation={[-Math.PI / 2, 0, 0]} />
        ))}
      </Instances>

      {/* PAREDES: Ajustadas para não serem cinzas */}
      <Instances limit={wallPositions.length}>
        <boxGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.STRUCTURE_WALL_HEIGHT, WORLD.GRID_BLOCK_SIZE]} />
        {/* SEM A PROPRIEDADE COLOR, a textura original deve aparecer como ela é */}
        <meshStandardMaterial
          map={wallTexture}
          roughness={1}
          metalness={0}
        />
        {wallPositions.map((pos, i) => <Instance key={`wall-${i}`} position={pos} />)}
      </Instances>

      {/* SAÍDA */}
      <Instances limit={exitPositions.length}>
        <boxGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.STRUCTURE_WALL_HEIGHT, WORLD.GRID_BLOCK_SIZE]} />
        <meshStandardMaterial map={exit} emissive="#ffaa00" emissiveIntensity={0.2} />
        {exitPositions.map((pos, i) => <Instance key={`exit-${i}`} position={pos} />)}
      </Instances>

      <group name="procedural-lights">{mapLights}</group>
    </group>
  );
}