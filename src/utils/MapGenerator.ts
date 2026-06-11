// ==========================================
// 1. GABARITO DE BLOCOS
// ==========================================
export const BLOCKS = {
    FLOOR: 0,
    WALL: 1,
    DARK_ALLEY: 2,
    EXIT_PATH: 3,
    SPAWN: 4,
    EXIT: 5
} as const;

// ==========================================
// 2. CONFIGURAÇÕES
// ==========================================
const MAP_CONFIG = {
    CHANCE_LOOP: 0.65,
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
    carveMaze(1, 1);

    // C. BRAIDING (Criando Loops e quebrando alguns becos)
    for (let r = 1; r < height - 1; r += 2) {
        for (let c = 1; c < width - 1; c += 2) {
            if (map[r][c] === BLOCKS.FLOOR) {
                let walls = 0;
                if (map[r - 1][c] === BLOCKS.WALL) walls++;
                if (map[r + 1][c] === BLOCKS.WALL) walls++;
                if (map[r][c - 1] === BLOCKS.WALL) walls++;
                if (map[r][c + 1] === BLOCKS.WALL) walls++;

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
    // D. ZONAS DE BREU INTELIGENTES (Preenchendo corredores mortos)
    // ==========================================================
    const deadEnds: { r: number, c: number }[] = [];

    // 1. Identifica o último bloco de todos os becos sem saída restantes
    for (let r = 1; r < height - 1; r++) {
        for (let c = 1; c < width - 1; c++) {
            if (map[r][c] === BLOCKS.FLOOR) {
                let openPaths = 0;
                if (map[r - 1][c] !== BLOCKS.WALL) openPaths++;
                if (map[r + 1][c] !== BLOCKS.WALL) openPaths++;
                if (map[r][c - 1] !== BLOCKS.WALL) openPaths++;
                if (map[r][c + 1] !== BLOCKS.WALL) openPaths++;

                if (openPaths === 1) {
                    deadEnds.push({ r, c });
                }
            }
        }
    }

    // 2. O "Veneno" da Escuridão: Consome o corredor de ré até esbarrar numa bifurcação
    for (const tip of deadEnds) {
        let currR = tip.r;
        let currC = tip.c;

        while (true) {
            let connections = 0;
            let nextR = -1;
            let nextC = -1;

            const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const [dr, dc] of dirs) {
                const nr = currR + dr;
                const nc = currC + dc;

                if (map[nr][nc] !== BLOCKS.WALL) {
                    connections++;
                    // Salva o caminho iluminado para continuarmos voltando
                    if (map[nr][nc] === BLOCKS.FLOOR) {
                        nextR = nr;
                        nextC = nc;
                    }
                }
            }

            // Se o bloco atual se liga a 3 ou mais caminhos, é uma bifurcação. O breu para!
            if (connections > 2) {
                break;
            }

            // Transforma o chão em Breu
            map[currR][currC] = BLOCKS.DARK_ALLEY;

            // Se não encontrou próximo passo iluminado, encerra esse corredor
            if (nextR === -1) {
                break;
            }

            // Anda para trás
            currR = nextR;
            currC = nextC;
        }
    }

    // ==========================================================
    // E. SPAWN E EXIT ALEATÓRIOS (Com Imersão Frontal)
    // ==========================================================
    const validFloors: { x: number, y: number }[] = [];
    const immersiveSpawns: { x: number, y: number }[] = [];

    for (let r = 1; r < height - 1; r++) {
        for (let c = 1; c < width - 1; c++) {
            if (map[r][c] === BLOCKS.FLOOR || map[r][c] === BLOCKS.DARK_ALLEY) {
                validFloors.push({ x: c, y: r });

                // Exigimos parede sólida atrás da câmera (Sul) e espaço livre na frente (Norte)
                if (map[r + 1][c] === BLOCKS.WALL && map[r - 1][c] !== BLOCKS.WALL) {
                    immersiveSpawns.push({ x: c, y: r });
                }
            }
        }
    }

    const spawnPool = immersiveSpawns.length > 0 ? immersiveSpawns : validFloors;
    spawnPool.sort(() => Math.random() - 0.5);
    const spawnX = spawnPool[0].x;
    const spawnY = spawnPool[0].y;

    validFloors.sort(() => Math.random() - 0.5);
    let exitX = validFloors[0].x;
    let exitY = validFloors[0].y;

    const minimumDistance = Math.floor(Math.max(width, height) / 1.5);

    for (let i = 0; i < validFloors.length; i++) {
        const dist = Math.abs(validFloors[i].x - spawnX) + Math.abs(validFloors[i].y - spawnY);
        if (dist >= minimumDistance) {
            exitX = validFloors[i].x;
            exitY = validFloors[i].y;
            break;
        }
    }

    // F. CORREDOR FINAL (EXIT_PATH)
    for (let r = exitY - 2; r <= exitY + 2; r++) {
        for (let c = exitX - 2; c <= exitX + 2; c++) {
            if (r > 0 && r < height - 1 && c > 0 && c < width - 1) {
                if (map[r][c] !== BLOCKS.WALL) {
                    map[r][c] = BLOCKS.EXIT_PATH;
                }
            }
        }
    }

    // G. A BLINDAGEM FINAL
    for (let r = 0; r < height; r++) {
        map[r][0] = BLOCKS.WALL;
        map[r][width - 1] = BLOCKS.WALL;
    }
    for (let c = 0; c < width; c++) {
        map[0][c] = BLOCKS.WALL;
        map[height - 1][c] = BLOCKS.WALL;
    }

    map[spawnY][spawnX] = BLOCKS.SPAWN;
    map[exitY][exitX] = BLOCKS.EXIT;

    return map;
}