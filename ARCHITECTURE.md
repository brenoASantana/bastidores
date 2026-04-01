# Arquitetura do Backrooms Game

## Visão Geral

O jogo é construído seguindo a arquitetura em camadas com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────┐
│         UI Layer (Components)                │
│  Menu.tsx | GameHUD.tsx | GameContainer.tsx │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│       3D Rendering Layer (Three.js)          │
│ GameScene | MapGeometry | ObjectiveMarkers  │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│     Game Systems & Controllers               │
│ PlayerController | GameLoop Management      │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│    Core Systems (Business Logic)             │
│ HorrorSystem | AudioSystem | ObjectiveSystem │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│   State Management & Data Layer              │
│    Zustand Store | Game Constants           │
└──────────────────────────────────────────────┘
```

## Módulos Principais

### 1. **Camada de Apresentação** (`/src/components`)

#### `Menu.tsx`

- Tela inicial e de fim de jogo
- Exibição de estatísticas (tempo, ansiedade final)
- Botões de controle (iniciar, reiniciar)

#### `GameContainer.tsx`

- Contenedor principal da cena 3D
- Gerencia lifecycle do Canvas
- Inicializa sistemas de áudio

#### `GameHUD.tsx`

- Overlay de UI durante o jogo
- Barra de ansiedade em tempo real
- Contador de objetivos
- Instruções de controle
- Efeitos visuais reativos à ansiedade

### 2. **Camada de Renderização 3D** (`/src/components/game`)

#### `GameScene.tsx`

- Configuração da cena Three.js

- Iluminação (ambiente e fluorescente)
- Neblina para efeito de profundidade

#### `MapGeometry.tsx`

- Geometria do mapa (corredores, paredes, piso, teto)
- Materiais com texturas beges/arenosas
- Colisão estática

#### `ObjectiveMarkers.tsx`

- Esferas amarelas como objetivos

- Emissão de luz dinâmica
- Animação de pulsação

### 3. **Camada de Controle** (`/src/components/game`)

#### `PlayerController.tsx`

- Input do teclado (WASD/Setas)
- Controle de mouse (look around)
- Sprint com Shift
- Pointer lock para imersão
- Physics básica (colisão AABB)
- Update de câmera em tempo real

```typescript
// Loop principal do jogo
useFrame((state, delta) => {
  // 1. Processar input
  // 2. Calcular movimento
  // 3. Aplicar colisão
  // 4. Atualizar ansiedade
  // 5. Disparar eventos de horror

  // 6. Verificar vitória/derrota

})
```

### 4. **Sistemas de Gameplay** (`/src/systems`)

#### `horrorSystem.ts`

**Responsabilidades:**

- Cálculo dinâmico de ansiedade baseado na posição
- Detecção de áreas seguras vs abertas
- Probabilidade de eventos psicológicos
- Geração de efeitos visuais por limiar

**Fórmula de Ansiedade:**

```

Em zona safe:     ansiedade -= 0.15 * deltaTime

Em zona normal:   ansiedade += 0.5 * deltaTime
Em zona aberta:   ansiedade += 0.75 * deltaTime
```

**Gatilhos de Evento:**

- Probabilidade = (ansiedade / MAX) * 0.05
- Cooldown de 20 segundos entre eventos do mesmo tipo

#### `audioSystem.ts`

**Responsabilidades:**

- Gerenciamento de trilhas em camadas
- Mixer reativo à ansiedade
- Pool de efectos sonoros
- Lazy loading do Howler (evita SSR issues)

**Estrutura de Áudio:**

- **Ambient Track**: Ruído industrial base (reduz com ansiedade)
- **Tension Track**: Drones de tensão (cresce com ansiedade)
- **SFX Pool**: Passos distantes, sussurros, buzzes

**Fórmula de Mixer:**

```
tensionVolume = TENSION_MIN + (anxietyLevel / 100) * (TENSION_MAX - TENSION_MIN)
ambientVolume = AMBIENT_BASE * (1 - normalizedAnxiety * 0.3)
```

#### `objectiveSystem.ts`

**Responsabilidades:**

- Posicionamento de objetivos
- Detecção de colisão com player
- Rastreamento de progresso

**Mecânica:**

- 3 objetivos em posições fixas
- Colisão on-touch (raio 1.5 unidades)
- Vitória quando 3/3 coletados + saída alcançada

### 5. **Camada de Estado** (`/src/store`)

#### `gameStore.ts` (Zustand)

```typescript
interface GameState {
  state: 'boot' | 'menu' | 'playing' | 'failed' | 'completed'
  anxiety: number              // 0-100
  objectives: number           // 0-3
  timeSpent: number           // ms
}


interface Player {
  position: [x, y, z]
  rotation: [pitch, yaw]
  velocity: [x, y, z]
  isMoving: boolean
}
```

**Ações (Actions):**

- `setGameState(state)` - Transição de estado
- `updateAnxiety(delta)` - Modificar ansiedade
- `updateObjectives(count)` - Atualizar progresso
- `updatePlayerPosition/Rotation/Velocity` - Atualizar posição do jogador
- `incrementTime(ms)` - Incrementar tempo de sessão

### 6. **Configuração & Constantes** (`/src/config`)

#### `constants.ts`

Configurações centralizadas para fácil ajuste de balanceamento:

```typescript
GAME_CONFIG {
  MAX_ANXIETY: 100
  ANXIETY_RISE_RATE: 0.5
  ANXIETY_FALL_RATE: 0.15
  ANXIETY_COLLAPSE_THRESHOLD: 95
  MAX_OBJECTIVES: 3
}

PLAYER_CONFIG {
  MOVE_SPEED: 8
  SPRINT_MULTIPLIER: 1.5
  MOUSE_SENSITIVITY: 0.003
  COLLISION_RADIUS: 0.5
}

MAP_CONFIG {
  CORRIDOR_WIDTH: 3
  CORRIDOR_HEIGHT: 3
  SAFE_ZONE_RADIUS: 5
  OPEN_ZONE_RADIUS: 15
}

AUDIO_CONFIG {
  MASTER_VOLUME: 0.8
  AMBIENT_BASE: 0.4
  TENSION_MIN: 0.1
  TENSION_MAX: 0.7
}
```

## Fluxo de Dados

### Estado do Jogo

```
User Input (WASD, Mouse)
    ↓
PlayerController (useFrame)
    ├→ Calculate Movement
    ├→ Update Position
    ├→ Check Collisions
    ├→ Verify Safe Zone
    └→ Update Store
         ↓
    Store Updates:
    ├→ gameState.anxiety
    ├→ player.position
    ├→ player.rotation
    └→ gameState.objectives
         ↓
    Component Re-renders:
    ├→ Camera Position (Three.js)
    ├→ GameHUD (UI)
    ├→ AudioSystem (Mixer)
    └→ HorrorSystem (Event Triggers)
```

### Ciclo de Ansiedade

```
Player Position Calculated
    ↓
horrorSystem.isInSafeZone() checks distance from origin
    ├─ If safe:      ansiedade -= 0.15/s
    ├─ If normal:    ansiedade += 0.5/s
    └─ If open:      ansiedade += 0.75/s
    ↓
audioSystem.updateAnxietyLayer() adjusts mixer
    ├─ increases tension track
    ├─ decreases ambient track
    └─ applies processing effects
    ↓
horrorSystem.shouldTriggerEvent() checks probability
    └─ Dispara SFX e eventos visuais
    ↓
Se ansiedade >= COLLAPSE_THRESHOLD por 5s → FAIL
Se 3/3 objetivos + na saída → WIN
```

## Performance Considerations

### Optimization Strategies

1. **Colisão**: AABB simples (sem physics engine)
2. **Renderização**: Material padrão (não usa PBR heavy)
3. **Audio Lazy Load**: Howler carrega apenas no cliente
4. **No procedural**: Mapa fixo para menos cálculos
5. **LOD básico**: Fog para oclusão de geometria distante

### Browser Targets

- Desktop: Chrome 100+, Firefox 100+, Safari 15+
- Mobile: Performance reduzida (vercel analytics tracks)

## Extensibilidade

### Para Adicionar Nova Feature

1. **Novo Sistema**: Criar em `/src/systems/newSystem.ts`
2. **Novo Componente**: Criar em `/src/components/`
3. **Nova Constante**: Adicionar em `/src/config/constants.ts`
4. **Novo Estado**: Estender `gameStore.ts`
5. **Novo Tipo**: Adicionar em `/src/types/game.ts`

### Para Multiplayer (V2)

- Adicionar WebSocket em nova camada de rede
- Sincronizar posições/rotações de outros jogadores
- Usar estado global para lista de jogadores
- WebRTC para voz posicional

## Debugging

### Console Available Functions

```typescript
// Em GameContainer.tsx ou qualquer componente
const store = useGameStore()
console.log(store.gameState)
console.log(store.player)

// Em horrorSystem
console.log(horrorSystem.getVisualEffects(anxiety))

// Em audioSystem
console.log(audioSystem.getState())
```

### FPS Monitoring

GameHUD mostra em dev:

- Barra de ansiedade (0-100)
- Contador de objetivos (0-3)
- Efeitos visuais reativos

## Type Safety

Todos os módulos são TypeScript com strict mode habilitado:

```typescript
// Tipos disponíveis em /src/types/game.ts
GameState, Player, HorrorEvent, AudioState, Objective
```

## Roadmap de Evolução

1. **V1 (Current)**: Solo, single-level, atmosfera básica
2. **V1.1**: Mais eventos, refinamento de balanceamento
3. **V2**: Multiplayer com aparição/desaparição
4. **V2.5**: Voz posicional com WebRTC
5. **V3**: Procedural maps, leaderboard, seasonals
