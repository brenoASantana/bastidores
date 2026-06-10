'use client'

import { WORLD, ASSETS } from '@/config/Constants';
import { metadata as defaultMetaData } from '@/data/Metadata';
import { BLOCKS } from '@/utils/MapGenerator';
import { useGameStore } from '@/store/GameStore';
import { useMemo } from 'react';
import { EnvironmentBounds } from './EnvironmentBounds';
import { FluorescentLight } from './FluorescentLight';
import { Instance, Instances } from '@react-three/drei';
import { useTexture } from '@react-three/drei';
import { Vector3 } from 'three';

export default function LevelRenderer() {
  const mapMatrix = useGameStore((state) => state.currentMap);
  const height = mapMatrix?.length || 0;
  const width = mapMatrix?.[0]?.length || 0;

  // 2. CARREGAMENTO DE TEXTURAS
  const wallTexture = useTexture(ASSETS.TEXTURES.WALLPAPER);
  const carpetTexture = useTexture(ASSETS.TEXTURES.CARPET); // Certifique-se que você tem a textura do carpete
  const exit = useTexture(ASSETS.TEXTURES.DOORWAY);

  // 3. PROCESSAMENTO DO MAPA
  const { wallPositions, holePositions, exitPositions, floorPositions, mapLights } = useMemo(() => {
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

        // A. LUZES NO TETO
        if (blockId === BLOCKS.FLOOR || blockId === BLOCKS.SPAWN || blockId === BLOCKS.EXIT) {
          floors.push(new Vector3(worldX, 0, worldZ));
          if ((rowIndex + colIndex) % 2 === 0) {
            lights.push(
              <FluorescentLight
                key={`light-${rowIndex}-${colIndex}`}
                position={[worldX, WORLD.STRUCTURE_WALL_HEIGHT - 0.2, worldZ]} // Lâmpada mais perto do teto
                intensity={1.2} // Aumentei de 0.5 para 1.2
                distance={WORLD.GRID_BLOCK_SIZE * 3} // Aumentei o alcance
              />
            );
          }
        }

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

    return { wallPositions: walls, holePositions: holes, exitPositions: exits, floorPositions: floors, mapLights: lights };
  }, [mapMatrix, height, width]);

  if (!mapMatrix) return null;

  return (
    <group name="level-geometry">
      {/* ADICIONE ISSO: Uma luz ambiente muito fraca para que nada fique 100% preto */}
      <ambientLight intensity={0.15} color="#ffffff" />

      <EnvironmentBounds mapWidth={width} mapHeight={height} />

      {/* --- MUDANÇA NAS PAREDES --- */}
      <Instances limit={wallPositions.length}>
        <boxGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.STRUCTURE_WALL_HEIGHT, WORLD.GRID_BLOCK_SIZE]} />
        {/* Usando StandardMaterial com roughness 0.8 para dar volume à parede */}
        <meshStandardMaterial map={wallTexture} roughness={0.8} />
        {wallPositions.map((pos, i) => <Instance key={i} position={pos} />)}
      </Instances>

      {/* --- PAREDES (CONTRASTE CINZA) --- */}
      <Instances limit={wallPositions.length}>
        <boxGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.STRUCTURE_WALL_HEIGHT, WORLD.GRID_BLOCK_SIZE]} />
        <meshLambertMaterial map={wallTexture} color="#aaaaaa" />
        {wallPositions.map((pos, i) => (
          <Instance key={`wall-${i}`} position={pos} />
        ))}
      </Instances>

      {/* --- SAÍDA (PADRONIZADA) --- */}
      <Instances limit={exitPositions.length}>
        <boxGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.STRUCTURE_WALL_HEIGHT, WORLD.GRID_BLOCK_SIZE]} />
        <meshStandardMaterial
          map={exit}
          color="#ffffff"
          emissive="#ffaa00"
          emissiveIntensity={0.3}
        />
        {exitPositions.map((pos, i) => (
          <Instance key={`exit-${i}`} position={pos} />
        ))}
      </Instances>

      {/* --- BURACOS --- */}
      {holePositions.length > 0 && (
        <>
          <Instances limit={holePositions.length}>
            <planeGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.GRID_BLOCK_SIZE]} />
            <meshBasicMaterial color="#550000" />
            {holePositions.map((pos, i) => (
              <Instance key={`hole-rim-${i}`} position={[pos.x, 0.005, pos.z]} rotation={[-Math.PI / 2, 0, 0]} />
            ))}
          </Instances>
          <Instances limit={holePositions.length}>
            <planeGeometry args={[WORLD.GRID_BLOCK_SIZE * 0.7, WORLD.GRID_BLOCK_SIZE * 0.7]} />
            <meshBasicMaterial color="#000000" />
            {holePositions.map((pos, i) => (
              <Instance key={`hole-void-${i}`} position={[pos.x, 0.01, pos.z]} rotation={[-Math.PI / 2, 0, 0]} />
            ))}
          </Instances>
        </>
      )}

      <group name="procedural-lights">
        {mapLights}
      </group>
    </group>
  );
}