'use client'

import { WORLD, ASSETS } from '@/config/Constants';
import { metadata as defaultMetaData } from '@/data/Metadata';
import { BLOCKS } from '@/utils/MapGenerator';
import { useGameStore } from '@/store/GameStore';
import { useMemo } from 'react';
import { EnvironmentBounds } from './EnvironmentBounds';
import { FluorescentLight } from './FluorescentLight';
import { Instance, Instances, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Vector3 } from 'three';

export default function LevelRenderer() {
  const mapMatrix = useGameStore((state) => state.currentMap);
  const height = mapMatrix?.length || 0;
  const width = mapMatrix?.[0]?.length || 0;

  const wallTexture = useTexture(ASSETS.TEXTURES.WALLPAPER);
  const exitTexture = useTexture(ASSETS.TEXTURES.DOORWAY); // <-- Verifique este arquivo!
  wallTexture.colorSpace = THREE.SRGBColorSpace;
  exitTexture.colorSpace = THREE.SRGBColorSpace;

  const { wallPositions, exitPositions, mapLights } = useMemo(() => {
    const walls: Vector3[] = [];
    const exits: Vector3[] = [];
    const lights: JSX.Element[] = [];

    if (!mapMatrix) return { wallPositions: walls, exitPositions: exits, mapLights: lights };

    mapMatrix.forEach((row, rowIndex) => {
      row.forEach((blockId, colIndex) => {
        const worldX = (colIndex - width / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;
        const worldZ = (rowIndex - height / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;
        const posY = WORLD.STRUCTURE_WALL_HEIGHT / 2;

        if (blockId !== BLOCKS.WALL) {
          // Espalha as lâmpadas proceduralmente
          if ((rowIndex + colIndex) % 4 === 0) {
            lights.push(
              <FluorescentLight
                key={`light-${rowIndex}-${colIndex}`}
                position={[worldX, WORLD.STRUCTURE_WALL_HEIGHT, worldZ]}
                intensity={1.2}
                distance={WORLD.GRID_BLOCK_SIZE * 4}
              />
            );
          }
        }

        const blockMeta = defaultMetaData[blockId];

        if (blockMeta && !blockMeta.walkable && !blockMeta.isInvisible) {
          walls.push(new Vector3(worldX, posY, worldZ));
        } else if (blockMeta?.isExit) {
          exits.push(new Vector3(worldX, posY, worldZ));
        }
      });
    });

    return { wallPositions: walls, exitPositions: exits, mapLights: lights };
  }, [mapMatrix, height, width]);

  if (!mapMatrix) return null;

  return (
    <group name="level-geometry">
      <ambientLight intensity={0.15} color="#ffffff" />

      {/* O chão e o teto agora são gerenciados integralmente aqui */}
      <EnvironmentBounds mapWidth={width} mapHeight={height} />

      <Instances limit={wallPositions.length}>
        <boxGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.STRUCTURE_WALL_HEIGHT, WORLD.GRID_BLOCK_SIZE]} />
        <meshStandardMaterial map={wallTexture} roughness={1} />
        {wallPositions.map((pos, i) => <Instance key={`wall-${i}`} position={pos} />)}
      </Instances>

      {/* SAÍDA: Ajustada para mesclar com as paredes */}
      <Instances limit={exitPositions.length}>
        <boxGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.STRUCTURE_WALL_HEIGHT, WORLD.GRID_BLOCK_SIZE]} />
        {/* Removemos o emissive laranja. Usamos a mesma roughness da parede. */}
        <meshStandardMaterial
          map={exitTexture}
          roughness={1}
          emissive="#222222"       // Um cinza escuro apenas para o bloco não ficar 100% apagado no escuro
          emissiveIntensity={0.1}  // Brilho quase imperceptível
        />
        {exitPositions.map((pos, i) => <Instance key={`exit-${i}`} position={pos} />)}
      </Instances>

      <group name="procedural-lights">{mapLights}</group>
    </group>
  );
}