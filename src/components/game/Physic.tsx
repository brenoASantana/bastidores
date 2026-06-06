type BlockMetadata = {
  walkable: boolean;
  transparent: boolean;
};

export function canWalk(
  row: number,
  col: number,
  mapMatrix: number[][],
  metadata: Record<number, BlockMetadata>
): boolean {
  // Se a linha ou coluna estiverem fora dos limites da matriz, bloqueia o passo imediatamente.
  if (row < 0 || row >= mapMatrix.length || col < 0 || col >= mapMatrix[0].length) {
    return false;
  }

  const blockId = mapMatrix[row][col];
  return metadata[blockId].walkable;
}