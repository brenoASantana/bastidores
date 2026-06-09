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
  const exit = useTexture(ASSETS.TEXTURES.DOORWAY);

  // 2. PROCESSAMENTO DO MAPA
  const { wallPositions, holePositions, exitPositions, mapLights, bridgeNS, bridgeWE, bridgeCorner } = useMemo(() => {
    const walls: Vector3[] = [];
    const holes: Vector3[] = [];
    const exits: Vector3[] = [];
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
                // AQUI FOI APLICADO O SEU ESCURO EXTREMO: A luz caiu de 1.8 para 0.5
                intensity={0.5}
                distance={WORLD.GRID_BLOCK_SIZE * 2.5}
              />
            );
          }
          return;
        }

        // B. SEPARAÇÃO DOS BLOCOS
        const blockMeta = defaultMetaData[String(blockId) as keyof typeof defaultMetaData];
        const posY = WORLD.STRUCTURE_WALL_HEIGHT / 2;

        if (blockMeta?.isHole) {
          holes.push(new Vector3(worldX, 0.01, worldZ));
        } else if (blockMeta?.isExit) {
          exits.push(new Vector3(worldX, posY, worldZ));
        } else if (!blockMeta?.isInvisible) {
          walls.push(new Vector3(worldX, posY, worldZ));
        }
      });
    });

    return {
      wallPositions: walls,
      holePositions: holes,
      exitPositions: exits,
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

      {/* --- OTIMIZAÇÃO 3: BURACOS (MUITO MAIS SINALIZADOS) --- */}
      {holePositions.length > 0 && (
        <>
          {/* 1. MOLDURA DE AVISO (Uma base vermelha escura do tamanho exato do grid) */}
          <Instances limit={holePositions.length}>
            <planeGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.GRID_BLOCK_SIZE]} />
            <meshBasicMaterial color="#3a0000" /> {/* Vermelho Sangue / Fio Desencapado */}
            {holePositions.map((pos, i) => (
              <Instance key={`hole-rim-${i}`} position={[pos.x, 0.008, pos.z]} rotation={[-Math.PI / 2, 0, 0]} />
            ))}
          </Instances>

          {/* 2. O VAZIO NEGRO (O buraco em si agora é 15% menor para revelar a moldura vermelha) */}
          <Instances limit={holePositions.length}>
            <planeGeometry args={[WORLD.GRID_BLOCK_SIZE * 0.85, WORLD.GRID_BLOCK_SIZE * 0.85]} />
            <meshBasicMaterial color="#000000" />
            {holePositions.map((pos, i) => (
              <Instance key={`hole-void-${i}`} position={[pos.x, 0.01, pos.z]} rotation={[-Math.PI / 2, 0, 0]} />
            ))}
          </Instances>

          {/* 3. LUZ DE ANOMALIA (Agora banha as paredes de vermelho vivo de longe) */}
          {holePositions.map((pos, i) => (
            <pointLight
              key={`hole-warning-${i}`}
              position={[pos.x, 1.5, pos.z]} // A luz subiu para 1.5 metros de altura
              intensity={2.0} // Bem mais forte que a luz do corredor
              distance={WORLD.GRID_BLOCK_SIZE * 1.5}
              color="#ff0000" // Cor de emergência/perigo
            />
          ))}
        </>
      )}

      {/* --- 1. PONTE NORTE-SUL --- */}
      {bridgeNS.length > 0 && (
        <Instances limit={bridgeNS.length}>
          <planeGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.GRID_BLOCK_SIZE]} />
          <meshLambertMaterial color="#262626" />
          {bridgeNS.map((pos, i) => (
            <Instance key={`ns-${i}`} position={pos} rotation={[-Math.PI / 2, 0, 0]} scale={[0.25, 1, 1]} />
          ))}
        </Instances>
      )}

      {/* --- 2. PONTE LESTE-OESTE --- */}
      {bridgeWE.length > 0 && (
        <Instances limit={bridgeWE.length}>
          <planeGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.GRID_BLOCK_SIZE]} />
          <meshLambertMaterial color="#262626" />
          {bridgeWE.map((pos, i) => (
            <Instance key={`we-${i}`} position={pos} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 0.25]} />
          ))}
        </Instances>
      )}

      {/* --- 3. A QUINA DA PONTE --- */}
      {bridgeCorner.length > 0 && (
        <Instances limit={bridgeCorner.length}>
          <planeGeometry args={[WORLD.GRID_BLOCK_SIZE, WORLD.GRID_BLOCK_SIZE]} />
          <meshLambertMaterial color="#262626" />
          {bridgeCorner.map((pos, i) => (
            <Instance key={`corner-${i}`} position={pos} rotation={[-Math.PI / 2, 0, 0]} scale={[0.25, 1, 0.25]} />
          ))}
        </Instances>
      )}

      {/* --- LUZES FLUORESCENTES GLOBAIS --- */}
      <group name="procedural-lights">
        {mapLights}
      </group>

    </group>
  );
}