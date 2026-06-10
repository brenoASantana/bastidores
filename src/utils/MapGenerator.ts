// ==========================================
// 1. GABARITO DE BLOCOS (Legenda do Mapa)
// ==========================================
export const BLOCKS = {
    FLOOR: 0,       // Carpete Iluminado
    WALL: 1,        // Parede Maciça
    DARK_ALLEY: 2,  // Zona de Breu (Sem-Saída)
    HOLE: 3,        // Buraco (Ameaça Física)
    SPAWN: 4,       // Início do Jogador
    EXIT: 5         // Fim do Nível
} as const;

// ==========================================
// 2. CONFIGURAÇÕES DA GERAÇÃO
// ==========================================
const MAP_CONFIG = {
    CHANCE_LOOP: 0.65,         // 65% de chance de quebrar um beco sem saída e criar um Loop infinito (Efeito Minotauro)
    CHANCE_DARK_ALLEY: 0.35,   // 35% de todo o chão passável do labirinto estará em breu absoluto
    CHANCE_HOLE: 0.04          // 4% de chance de buracos nas rotas
} as const;

export function generateProceduralMap(width: number = 15, height: number = 19): number[][] {
    // 1. Inicia o mundo como um bloco sólido de paredes
    const map = Array.from({ length: height }, () => Array(width).fill(BLOCKS.WALL));

    // A lógica de labirinto clássico exige coordenadas ímpares para as rotas
    const spawnX = width - 2; // (13)
    const spawnY = 1;         // (1)
    const exitX = 1;          // (1)
    const exitY = height - 2; // (17)

    // ==========================================================
    // 3. RECURSIVE BACKTRACKER (Cria o Labirinto Denso e Curvo)
    // ==========================================================
    function carveMaze(cx: number, cy: number) {
        map[cy][cx] = BLOCKS.FLOOR;

        // Tenta ir para Cima, Baixo, Esquerda, Direita (Pulando 2 casas para manter as paredes de 1 bloco)
        const directions = [
            [0, -2], [0, 2], [-2, 0], [2, 0]
        ];

        // Embaralha as direções aleatoriamente (Fisher-Yates) para criar as curvas caóticas
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }

        for (const [dx, dy] of directions) {
            const nx = cx + dx;
            const ny = cy + dy;

            // Se o vizinho (pulando 1) for parede e estiver dentro dos limites seguros
            if (ny > 0 && ny < height - 1 && nx > 0 && nx < width - 1 && map[ny][nx] === BLOCKS.WALL) {
                // Derruba a parede entre o bloco atual e o próximo
                map[cy + dy / 2][cx + dx / 2] = BLOCKS.FLOOR;
                // Entra no novo bloco e continua cavando
                carveMaze(nx, ny);
            }
        }
    }

    // O gerador começa a cavar furiosamente a partir da saída
    carveMaze(exitX, exitY);

    // ==========================================================
    // 4. BRAIDING (Destruindo Becos para criar Ciclos / Loops)
    // ==========================================================
    for (let r = 1; r < height - 1; r += 2) {
        for (let c = 1; c < width - 1; c += 2) {
            if (map[r][c] === BLOCKS.FLOOR) {
                // Conta quantas paredes cercam este chão
                let walls = 0;
                if (map[r - 1][c] === BLOCKS.WALL) walls++;
                if (map[r + 1][c] === BLOCKS.WALL) walls++;
                if (map[r][c - 1] === BLOCKS.WALL) walls++;
                if (map[r][c + 1] === BLOCKS.WALL) walls++;

                // Se houver 3 paredes, é um Beco Sem Saída visual.
                if (walls === 3 && Math.random() < MAP_CONFIG.CHANCE_LOOP) {
                    // Escolhe uma parede segura aleatória e quebra ela para conectar a outro corredor
                    const breakable = [];
                    if (r > 1 && map[r - 1][c] === BLOCKS.WALL && map[r - 2][c] === BLOCKS.FLOOR) breakable.push([-1, 0]);
                    if (r < height - 2 && map[r + 1][c] === BLOCKS.WALL && map[r + 2][c] === BLOCKS.FLOOR) breakable.push([1, 0]);
                    if (c > 1 && map[r][c - 1] === BLOCKS.WALL && map[r][c - 2] === BLOCKS.FLOOR) breakable.push([0, -1]);
                    if (c < width - 2 && map[r][c + 1] === BLOCKS.WALL && map[r][c + 2] === BLOCKS.FLOOR) breakable.push([0, 1]);

                    if (breakable.length > 0) {
                        const [dr, dc] = breakable[Math.floor(Math.random() * breakable.length)];
                        map[r + dr][c + dc] = BLOCKS.FLOOR; // Cria o Loop!
                    }
                }
            }
        }
    }

    // 5. DISTRIBUIÇÃO DE PERIGO (Otimizado: Bloqueio de caminhos fatais)
    for (let r = 1; r < height - 1; r++) {
        for (let c = 1; c < width - 1; c++) {
            const isWalkable = map[r][c] === BLOCKS.FLOOR || map[r][c] === BLOCKS.DARK_ALLEY;

            // Ignora pontos críticos
            const isNearCrucialPoints =
                (Math.abs(c - spawnX) <= 1 && Math.abs(r - spawnY) <= 1) ||
                (Math.abs(c - exitX) <= 1 && Math.abs(r - exitY) <= 1);

            if (isWalkable && !isNearCrucialPoints && Math.random() < MAP_CONFIG.CHANCE_HOLE) {

                // --- A VERIFICAÇÃO DE JUSTIÇA ---
                // Conta quantos vizinhos "caminháveis" existem em volta
                let neighbors = 0;
                if (map[r - 1][c] === BLOCKS.FLOOR || map[r - 1][c] === BLOCKS.DARK_ALLEY) neighbors++;
                if (map[r + 1][c] === BLOCKS.FLOOR || map[r + 1][c] === BLOCKS.DARK_ALLEY) neighbors++;
                if (map[r][c - 1] === BLOCKS.FLOOR || map[r][c - 1] === BLOCKS.DARK_ALLEY) neighbors++;
                if (map[r][c + 1] === BLOCKS.FLOOR || map[r][c + 1] === BLOCKS.DARK_ALLEY) neighbors++;

                // SÓ COLOCA O BURACO se o jogador tiver pelo menos uma rota de fuga (mais de 1 vizinho livre)
                if (neighbors > 1) {
                    map[r][c] = BLOCKS.HOLE;
                }
            }
        }
    }

    // ==========================================================
    // 6. CRAVA A ENTRADA E SAÍDA NO MAPA
    // ==========================================================
    map[spawnY][spawnX] = BLOCKS.SPAWN;
    map[exitY][exitX] = BLOCKS.EXIT;

    return map;
}