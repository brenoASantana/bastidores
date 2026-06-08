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

  // 2. PROCESSAMENTO DO MAPA
  // Agora desestruturamos a holePositions para ela ficar disponível no componente
  const { wallPositions, holePositions, mapLights } = useMemo(() => {
    const walls: Vector3[] = [];
    const glasses: Vector3[] = [];
    const holes: Vector3[] = [];
    const lights: JSX.Element[] = [];

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

        // B. SEPARAÇÃO DOS BLOCOS (Lógica de Decisão Corrigida)
        const blockMeta = defaultMetaData[String(blockId) as keyof typeof defaultMetaData];
        const posY = WORLD.STRUCTURE_WALL_HEIGHT / 2;

        if (blockMeta?.isGlass) {
          glasses.push(new Vector3(worldX, posY, worldZ));
        } else if (blockMeta?.isHole) {
          // Se for buraco, salva ele pertinho do chão e PULA o resto. Não gera parede!
          holes.push(new Vector3(worldX, 0.01, worldZ));
        } else if (!blockMeta?.isInvisible) {
          // Se não for vidro, nem buraco, nem um bloco fantasma (isInvisible), assumimos parede.
          walls.push(new Vector3(worldX, posY, worldZ));
        }
      });
    });

    // Precisamos retornar todas as listas geradas aqui!
    return {
      wallPositions: walls,
      holePositions: holes,
      mapLights: lights
    };
  }, [mapMatrix, height, width]);


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
          {/* Um plano deitado no chão do tamanho exato do bloco */}
          <planeGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.GRID_BLOCK_SIZE]} />

          {/* meshBasicMaterial preto ignora as luzes. É a escuridão absoluta. */}
          <meshBasicMaterial color="#000000" />

          {/* O map precisava estar limpo para retornar as Instâncias sem erros no JSX */}
          {holePositions.map((pos, i) => (
            <Instance key={`hole-${i}`} position={pos} rotation={[-Math.PI / 2, 0, 0]} />
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