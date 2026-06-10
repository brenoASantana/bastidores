// ==========================================
// 1. GABARITO DE BLOCOS
// ==========================================
export const BLOCKS = {
    FLOOR: 0,
    WALL: 1,
    DARK_ALLEY: 2,
    EXIT_PATH: 3,  // NOVO: Corredor final de ansiedade
    SPAWN: 4,
    EXIT: 5
} as const;

// ==========================================
// 2. CONFIGURAÇÕES
// ==========================================
const MAP_CONFIG = {
    CHANCE_LOOP: 0.65,
    CHANCE_DARK_ALLEY: 0.25, // Reduzido um pouco para o cluster ficar mais denso
} as const;

export function generateProceduralMap(width: number = 15, height: number = 19): number[][] {
    const map = Array.from({ length: height }, () => Array(width).fill(BLOCKS.WALL));

    // A. CENTRO BLOQUEADO
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            map[centerY + i][centerX + j] = BLOCKS.WALL;
        }
    }

    const spawnX = width - 2;
    const spawnY = 1;
    const exitX = 1;
    const exitY = height - 2;

    // B. CARVEMAZA (Backtracker)
    function carveMaze(cx: number, cy: number) {
        map[cy][cx] = BLOCKS.FLOOR;
        const directions = [[0, -2], [0, 2], [-2, 0], [2, 0]];
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }
        for (const [dx, dy] of directions) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (ny > 0 && ny < height - 1 && nx > 0 && nx < width - 1 && map[ny][nx] === BLOCKS.WALL) {
                map[cy + dy / 2][cx + dx / 2] = BLOCKS.FLOOR;
                carveMaze(nx, ny);
            }
        }
    }
    carveMaze(exitX, exitY);

    // C. BRAIDING
    for (let r = 1; r < height - 1; r += 2) {
        for (let c = 1; c < width - 1; c += 2) {
            if (map[r][c] === BLOCKS.FLOOR) {
                let walls = 0;
                if (map[r - 1][c] === BLOCKS.WALL) walls++;
                if (map[r + 1][c] === BLOCKS.WALL) walls++;
                if (map[r][c - 1] === BLOCKS.WALL) walls++;
                if (map[r][c + 1] === BLOCKS.WALL) walls++;

                // Se for um beco, temos chance de abrir um Loop ou criar uma Isca
                if (walls === 3 && Math.random() < MAP_CONFIG.CHANCE_LOOP) {
                    const breakable = [];
                    if (r > 1 && map[r - 1][c] === BLOCKS.WALL && map[r - 2][c] === BLOCKS.FLOOR) breakable.push([-1, 0]);
                    if (r < height - 2 && map[r + 1][c] === BLOCKS.WALL && map[r + 2][c] === BLOCKS.FLOOR) breakable.push([1, 0]);
                    if (c > 1 && map[r][c - 1] === BLOCKS.WALL && map[r][c - 2] === BLOCKS.FLOOR) breakable.push([0, -1]);
                    if (c < width - 2 && map[r][c + 1] === BLOCKS.WALL && map[r][c + 2] === BLOCKS.FLOOR) breakable.push([0, 1]);

                    if (breakable.length > 0) {
                        const [dr, dc] = breakable[Math.floor(Math.random() * breakable.length)];
                        map[r + dr][c + dc] = BLOCKS.FLOOR;
                    }
                }
            }
        }
    }

    // D. DISTRIBUIÇÃO DE BREU EM CONJUNTOS (Clustering)
    const clusterCount = Math.floor((width * height) * 0.15);
    for (let i = 0; i < clusterCount; i++) {
        const rx = Math.floor(Math.random() * (width - 2)) + 1;
        const ry = Math.floor(Math.random() * (height - 2)) + 1;
        if (map[ry][rx] === BLOCKS.FLOOR) {
            map[ry][rx] = BLOCKS.DARK_ALLEY;
            const neighbors = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            neighbors.forEach(([dx, dy]) => {
                if (Math.random() < 0.6) map[ry + dy][rx + dx] = BLOCKS.DARK_ALLEY;
            });
        }
    }

    // E. CORREDOR FINAL (EXIT_PATH)
    // Marca o caminho em um raio de 3 blocos da saída como EXIT_PATH
    for (let r = exitY - 2; r <= exitY + 2; r++) {
        for (let c = exitX - 2; c <= exitX + 2; c++) {
            if (r > 0 && r < height - 1 && c > 0 && c < width - 1) {
                if (map[r][c] !== BLOCKS.WALL) {
                    map[r][c] = BLOCKS.EXIT_PATH;
                }
            }
        }
    }

    map[spawnY][spawnX] = BLOCKS.SPAWN;
    map[exitY][exitX] = BLOCKS.EXIT;

    return map;
}