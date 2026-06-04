# Arquitetura do Backrooms Game

## Visão Geral

O jogo é construído seguindo a arquitetura em camadas com separação clara de responsabilidades:

```text
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
```text

## Módulos Principais

### 1. **Camada de Apresentação** (`/src/components/ui`)

#### `Menu.tsx`

- Tela inicial e de fim de jogo
- Exibição de estatísticas (tempo, ansiedade final)
- Botões de controle (iniciar, reiniciar)

### 2. **Camada de Renderização 3D** (`/src/components/game`)

#### `GameScene.tsx`

- Configuração da cena Three.js
- Iluminação (ambiente e fluorescente)
- Neblina para efeito de profundidade

#### `MapGeometry.tsx`

- Renderiza a geometria do nível ativo a partir de dados do mundo
- Piso, paredes e teto da sala de teste quadrada
- Não contém regra de colisão; apenas apresentação 3D

#### `ObjectiveMarkers.tsx`

- Esferas amarelas como objetivos
- Emissão de luz dinâmica
- Animação de pulsação

### 3. **Camada de Controle** (`/src/components/game`)

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

#### `PlayerController.tsx`

- Input do teclado (WASD/Setas)
- Controle de mouse (look around)
- Sprint com Shift
- Pointer lock para imersão
- Physics básica (colisão AABB nos bounds do nível ativo)
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
```text

### 4. **Sistemas de Gameplay** (`/src/systems`)

#### `horrorSystem.ts`

**Responsabilidades:**

- Cálculo dinâmico de ansiedade baseado na posição
- Detecção de áreas seguras vs abertas
- Probabilidade de eventos psicológicos
- Geração de efeitos visuais por limiar

**Fórmula de Ansiedade:**

```text
Em zona safe:     ansiedade -= 0.15 * deltaTime
Em zona normal:   ansiedade += 0.5 * deltaTime
Em zona aberta:   ansiedade += 0.75 * deltaTime
```text

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

```text
tensionVolume = TENSION_MIN + (anxietyLevel / 100) * (TENSION_MAX - TENSION_MIN)
ambientVolume = AMBIENT_BASE * (1 - normalizedAnxiety * 0.3)
```

### `objectiveSystem.ts`

- Rastreamento de objetivos coletados
- Verificação de proximidade
- Sincronização com store

### 5. **State Management** (`/src/store`)

#### `gameStore.ts` (Zustand)

**Estado Global:**

```typescript
interface GameState {
  gameState: {
    state: 'boot' | 'menu' | 'playing' | 'completed' | 'failed'
    anxiety: number
    objectives: number
    timeSpent: number
  }
  player: {
    position: [number, number, number]
    rotation: [number, number, number]
  }
  // ... ações para atualizar estado
}
```

**Padrão de Uso:**

```typescript
const store = useGameStore()
const anxiety = store.gameState.anxiety  // Getter
store.updateAnxiety(5)                   // Setter
```

### 6. **Configuração** (`/src/config`)

#### `constants.ts`

Todas as configurações ajustáveis do jogo em um único lugar:

```typescript
export const PLAYER_CONFIG = { ... }
export const ANXIETY_CONFIG = { ... }
export const AUDIO_CONFIG = { ... }
export const HORROR_EVENTS = { ... }
```

#### `levels.ts`

Definição da sala de teste e, futuramente, de outros níveis.

```typescript
export const TEST_ROOM_LEVEL = {
  spawn,
  bounds,
  safeZoneRadius,
  openZoneRadius,
  exitZone,
  geometry,
  objectiveSpawns,
}
```

## World Model

O jogo passou a usar uma camada explícita de mundo para separar dados de cenário da renderização.

### Regras

- Geometria estática é declarada em `src/config/levels.ts`.
- Tipos de mundo ficam em `src/types/world.ts`.
- O player continua como entidade com estado e controle próprios.
- Objetivos e zonas de ansiedade consomem dados do nível, não coordenadas espalhadas pela cena.

### Benefícios

- Facilita testes com uma sala quadrada simples.
- Evita espalhar limites de colisão em múltiplos componentes.
- Permite adicionar novos níveis sem reescrever `MapGeometry.tsx`.
- Mantém `GameScene.tsx` como compositor, não como dono da regra de gameplay.

#### `audioFiles.ts`

Mapeamento central de arquivos de áudio:

```typescript
export const AUDIO_FILES = {
  ambient: { base: '...', tension: '...' },
  sfx: { footsteps: '...', whisper: '...' }
}
```

## Data Flow

```text
User Input (Keyboard/Mouse)
  ↓
PlayerController.useFrame()
  ↓
Calculate Movement + Update Position
  ↓
HorrorSystem.calculateAnxiety()
  ↓
Update Zustand Store
  ↓
AudioSystem.updateMixer() [Reactive]
  ↓
GameHUD Re-render [Reactive]
  ↓
Visual Effects Update [Reactive]
```

## Component Tree

```text
<GameContainer>
  └─ <Canvas>
      ├─ <GameScene>
      │   ├─ <MapGeometry />
      │   ├─ <ObjectiveMarkers />
      │   └─ <PlayerController>
      │       └─ useFrame() [Game Loop]
      └─ <GameHUD />
  └─ <AudioDebugger /> [Dev Only]
```

## Performance Considerations

### 1. Memory Management

- **Canvas Rendering**: Memoizado para evitar re-renders desnecessários
- **Audio Pool**: SFX são reciclados, não criados dinamicamente
- **State Selectors**: Use Zustand selectors para reatividade granular

### 2. Rendering Performance

- **Frustum Culling**: Three.js automático
- **Instancing**: Geometrias reutilizadas (corredores)
- **Lazy Loading**: Howler.js carregado apenas no cliente

### 3. Network Performance (Vercel)

- **Bundle Size**: Tree-shaking otimizado
- **Audio Serving**: CDN automático do Vercel
- **Caching**: Headers de cache para assets estáticos

## Extensibilidade

### Adicionar Novo Sistema

```typescript
// 1. Criar em src/systems/newSystem.ts
export const newSystem = {
  initialize() { ... },
  update(delta: number) { ... },
  destroy() { ... }
}

// 2. Integrar em PlayerController.tsx useFrame
useFrame((state, delta) => {
  newSystem.update(delta)
})

// 3. Inicializar em GameContainer
useEffect(() => {
  newSystem.initialize()
  return () => newSystem.destroy()
}, [])
```

### Adicionar Novo Componente 3D

```typescript
// 1. Criar em src/components/game/
const NewMesh: FC = () => {
  return (
    <mesh>
      <geometry />
      <material />
    </mesh>
  )
}

// 2. Adicionar ao GameScene
<GameScene>
  <NewMesh />
</GameScene>
```

## Testing Strategy (Roadmap)

- Unit tests para sistemas (horrorSystem, audioSystem)
- Integration tests para state management
- E2E tests para fluxo completo de gameplay
