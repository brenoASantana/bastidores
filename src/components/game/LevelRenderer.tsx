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

  // 1. CARREGAMENTO DE TEXTURAS NO TOPO (Fora do useMemo!)
  // Como estamos otimizando, usaremos a textura direto aqui, em vez do componente <Block>
  const wallTexture = useTexture(ASSETS.TEXTURES.WALLPAPER);
  const glassTexture = useTexture(ASSETS.TEXTURES.GLASS);

  // 2. PROCESSAMENTO DO MAPA
  const { wallPositions, glassPositions, mapLights } = useMemo(() => {
    const walls: Vector3[] = [];
    const glasses: Vector3[] = [];
    const lights: JSX.Element[] = [];

    mapMatrix.forEach((row, rowIndex) => {
      row.forEach((blockId, colIndex) => {
        const worldX = (colIndex - width / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;
        const worldZ = (rowIndex - height / 2 + 0.5) * WORLD.GRID_BLOCK_SIZE;

        // A. CHÃO (ESPAÇO VAZIO) E LUZES
        if (blockId === 0 || blockId === 10) { // 10 é o Spawn que criamos
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

        // B. SEPARAÇÃO DOS BLOCOS SÓLIDOS
        const blockMeta = defaultMetaData[String(blockId) as keyof typeof defaultMetaData];
        const posY = WORLD.STRUCTURE_WALL_HEIGHT / 2; // Cubo encosta no chão

        if (blockMeta?.isGlass) {
          glasses.push(new Vector3(worldX, posY, worldZ));
        } else {
          // Tudo que não for vidro ou chão, assumimos como parede sólida
          walls.push(new Vector3(worldX, posY, worldZ));
        }
      });
    });

    return { wallPositions: walls, glassPositions: glasses, mapLights: lights };
  }, [mapMatrix, height, width]);


  return (
    <group name="level-geometry">
      <EnvironmentBounds mapWidth={width} mapHeight={height} />

      {/* --- OTIMIZAÇÃO 1: INSTÂNCIAS DE PAREDES (Renderiza 10.000 paredes de uma vez) --- */}
      {wallPositions.length > 0 && (
        <Instances limit={wallPositions.length}>
          <boxGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.STRUCTURE_WALL_HEIGHT, WORLD.GRID_BLOCK_SIZE]} />
          {/* meshLambertMaterial calcula luzes muito mais rápido que o Standard */}
          <meshLambertMaterial map={wallTexture} color="#ffffff" />

          {wallPositions.map((pos, i) => (
            <Instance key={`wall-${i}`} position={pos} />
          ))}
        </Instances>
      )}

      {/* --- OTIMIZAÇÃO 2: INSTÂNCIAS DE VIDRO --- */}
      {glassPositions.length > 0 && (
        <Instances limit={glassPositions.length}>
          {/* Geometria do vidro é fina no eixo Z */}
          <boxGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.STRUCTURE_WALL_HEIGHT, 0.5]} />

          <meshPhysicalMaterial
            map={glassTexture}
            color="#aaddff"
            transparent={true}
            transmission={0.9}
            opacity={1}
            roughness={0.1}
            ior={1.5}
            thickness={0.5}
          />

          {glassPositions.map((pos, i) => (
            <Instance key={`glass-${i}`} position={pos} />
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