// ==========================================
// 1. GABARITO DE BLOCOS
// ==========================================
export const BLOCKS = {
    FLOOR: 0,       // Carpete Iluminado
    WALL: 1,        // Parede Maciça
    DARK_ALLEY: 2,  // Zona de Breu (Sem-Saída)
    SPAWN: 3,       // Início do Jogador
    EXIT: 4         // Fim do Nível
} as const;

// ==========================================
// 2. CONFIGURAÇÕES DA GERAÇÃO
// ==========================================
const MAP_CONFIG = {
    CHANCE_LOOP: 0.65,
    CHANCE_DARK_ALLEY: 0.35,
} as const;

export function generateProceduralMap(width: number = 15, height: number = 19): number[][] {
    const map = Array.from({ length: height }, () => Array(width).fill(BLOCKS.WALL));

    // A. CENTRO BLOQUEADO: Quebra a linha de visão direta e obriga contornos
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

    // B. PONTO DE PARTIDA ALEATÓRIO: O fluxo do labirinto nunca é o mesmo
    const startX = (Math.random() > 0.5) ? exitX : 1;
    const startY = (Math.random() > 0.5) ? exitY : height - 2;

    // ==========================================================
    // 3. RECURSIVE BACKTRACKER
    // ==========================================================
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

    carveMaze(startX, startY);

    // ==========================================================
    // 4. BRAIDING & ISCAS (O Efeito Minotauro)
    // ==========================================================
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

    // ==========================================================
    // 5. DISTRIBUIÇÃO DE BREU
    // ==========================================================
    for (let r = 1; r < height - 1; r++) {
        for (let c = 1; c < width - 1; c++) {
            if (map[r][c] === BLOCKS.FLOOR) {
                if (Math.random() < MAP_CONFIG.CHANCE_DARK_ALLEY) {
                    map[r][c] = BLOCKS.DARK_ALLEY;
                }
            }
        }
    }

    map[spawnY][spawnX] = BLOCKS.SPAWN;
    map[exitY][exitX] = BLOCKS.EXIT;

    return map;
}