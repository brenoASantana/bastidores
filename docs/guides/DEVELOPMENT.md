# Development Guide - bastidores

## Setup Inicial

### Pré-requisitos

- **Node.js**: 18+
- **npm**: 9+
- **Git**: para versionamento
- **VS Code**: recomendado com extensões React/TypeScript

### Instalação

```bash
# Clone o repo
git clone https://github.com/brenoASantana/bastidores.git
cd bastidores

# Instale dependências
npm install

# Inicie desenvolvimento
npm run dev
```

Acesse `http://localhost:3000` (ou a porta indicada se 3000 estiver ocupada).

### Estrutura de Projeto

```
bastidores/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Home page (renderiza Menu ou Game)
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Estilos globais
│   ├── components/
│   │   ├── ui/
│   │   │   └── Menu.tsx         # Tela inicial/fim de jogo
│   │   └── game/
│   │       ├── GameContainer.tsx     # Contenedor principal
│   │       ├── GameScene.tsx         # Setup 3D
│   │       ├── GameHUD.tsx           # UI Overlay
│   │       ├── PlayerController.tsx  # Input & Physics
│   │       ├── MapGeometry.tsx       # Mapa 3D
│   │       └── ObjectiveMarkers.tsx  # Objetivos visuais
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   ├── store/
│   │   └── gameStore.ts         # Zustand state management
│   ├── systems/
│   │   ├── horrorSystem.ts      # Ansiedade & eventos
│   │   ├── audioSystem.ts       # Trilhas & mixer
│   │   └── objectiveSystem.ts   # Coleta de objetivos
│   ├── config/
│   │   ├── constants.ts         # Configurações globais
│   │   └── audioFiles.ts        # Mapeamento de arquivos de áudio
│   └── types/
│       └── game.ts              # TypeScript types
├── docs/                         # Documentação
├── public/                       # Assets estáticos
├── package.json                 # Dependências
├── tsconfig.json               # TypeScript config
└── Makefile                    # Comandos de automação
```

## Workflow de Desenvolvimento

### 1. Criar Nova Feature

**Exemplo: Adicionar novo evento de horror**

```bash
# 1. Crie o tipo no arquivo apropriado
# src/config/constants.ts
export const HORROR_EVENTS = {
  ...
  FOOTSTEPS_CLOSER: 'footsteps_closer',  // Novo
}

# 2. Implemente a lógica no sistema relevante
# src/systems/horrorSystem.ts
shouldTriggerEvent(eventId, anxiety, delta) {
  if (eventId === HORROR_EVENTS.FOOTSTEPS_CLOSER) {
    // Lógica específica
  }
}

# 3. Adicione o áudio correspondente
# src/systems/audioSystem.ts
addSFX(HORROR_EVENTS.FOOTSTEPS_CLOSER, 'audio_key')

# 4. Dispare o evento em PlayerController
# src/components/game/PlayerController.tsx
if (horrorSystem.shouldTriggerEvent(...)) {
  audio.playSFX(HORROR_EVENTS.FOOTSTEPS_CLOSER)
}

# 5. Teste no dev server
npm run dev
```

### 2. Modificar Balanceamento

Todos os valores ajustáveis estão em `src/config/constants.ts`:

```typescript
// Aumentar dificuldade: reduzir ANXIETY_FALL_RATE
ANXIETY_FALL_RATE: 0.1,  // era 0.15

// Aumentar velocidade: aumentar MOVE_SPEED
MOVE_SPEED: 10,  // era 8

// Aumentar sensibilidade de mouse
MOUSE_SENSITIVITY: 0.005,  // era 0.003
```

Mudanças em constants.ts são **hot-reloaded** no dev server.

### 3. Adicionar Asset de Áudio

**Passo a passo para integrar um novo arquivo de áudio:**

```typescript
// 1. Coloque o arquivo em public/audio/
// public/audio/new_sound.mp3

// 2. Configure em audioSystem.ts
private addSFX(eventId: string, soundKey: string) {
  const sound = Howl ? new Howl({
    src: ['/audio/new_sound.mp3'],  // Path relativo ao public/
    volume: this.audioState.sfxVolume,
  }) : null
  // ...
}

// 3. Registre o novo evento
this.addSFX(HORROR_EVENTS.NEW_SOUND, 'new_sound')

// 4. Use como qualquer outro SFX
audio.playSFX(HORROR_EVENTS.NEW_SOUND, 0.5)
```

### 4. Estender o Mapa

O mapa atual está em `src/components/game/MapGeometry.tsx`.

**Para adicionar uma nova sala:**

```typescript
// Adicione geometria
<mesh position={[x, y, z]} castShadow>
  <boxGeometry args={[width, height, depth]} />
  <meshStandardMaterial color="#..." roughness={0.85} />
</mesh>

// Atualize colisão em PlayerController.tsx
// Estenda a lógica de checkCollision()
```

### 5. Testar no Mobile

```bash
# Inicie com acesso de rede
npm run dev

# Acesse de outro dispositivo na rede local
http://<seu-ip-local>:3000
```

**Nota**: Mobile tem performance reduzida. Use `useThree().gl.getSize()` para adaptar.

## Quick Reference - Snippets Úteis

### Acessar State Global

```typescript
const store = useGameStore()
const anxiety = store.gameState.anxiety
const position = store.player.position

store.updateAnxiety(5)
store.setGameState('playing')
```

### Pegar Sistemas

```typescript
const horror = horrorSystem
const audio = getAudioSystem()
const objective = objectiveSystem

audio.playSFX(HORROR_EVENTS.WHISPER, 0.5)
```

### Game Loop (useFrame)

```typescript
useFrame((state, delta) => {
  // delta = tempo desde frame anterior (segundos)
  // state.camera = câmera Three.js
  // state.scene = cena

  const audioSystem = getAudioSystem()
  const terror = horrorSystem

  // Sua lógica aqui (executa 60x/s)
})
```

### Debug Logging

```typescript
console.log('State:', useGameStore.getState())
console.log('Position:', useGameStore.getState().player.position)
console.log('Anxiety:', useGameStore.getState().gameState.anxiety)
```

## Arquivos Mais Consultados

| Arquivo                                    | Propósito             | Quando Editar                            |
| ------------------------------------------ | --------------------- | ---------------------------------------- |
| `src/config/constants.ts`                  | Configurações de jogo | Ajustar dificuldade, velocidade, volumes |
| `src/store/gameStore.ts`                   | State global          | Adicionar novo estado                    |
| `src/systems/horrorSystem.ts`              | Ansiedade & eventos   | Novos eventos de horror                  |
| `src/systems/audioSystem.ts`               | Áudio & mixer         | Mudar trilhas, volumes                   |
| `src/components/game/PlayerController.tsx` | Input & physics       | Controles, movimento, colisão            |
| `src/components/game/MapGeometry.tsx`      | Mapa 3D               | Adicionar salas/paredes                  |

## Alterações Comuns

### Mudar Velocidade do Jogador

```typescript
// src/config/constants.ts
export const PLAYER_CONFIG = {
  MOVE_SPEED: 10,  // era 8
}
```

### Ajustar Taxa de Ansiedade

```typescript
// src/config/constants.ts
ANXIETY_RISE_SAFE: -0.15,      // zona segura
ANXIETY_RISE_NORMAL: 0.5,      // corredores
ANXIETY_RISE_OPEN: 0.75,       // áreas abertas
```

## Stack Tecnológico Detalhado

### Next.js 14

- **App Router**: Roteamento moderno com Server Components
- **File-based routing**: `page.tsx` = rota automática
- **SSR/Client Components**: Use `'use client'` onde necessário

**Configuração**: `next.config.mjs`

```mjs
// Webpack externals para Howler
config.externals.push('howler')
```

### React Three Fiber

Abstração React para Three.js. Componentes renderizam em um Canvas:

```tsx
<Canvas camera={{ position: [0, 1.6, 0] }}>
  <ambientLight />
  <mesh>
    <sphereGeometry />
    <meshStandardMaterial />
  </mesh>
</Canvas>
```

**Regras importantes:**
- `useFrame` para lógica de game loop
- `useThree` para acessar camera/scene
- Componentes dentro de Canvas são "3D components"

### Zustand

State management simples e performático:

```typescript
export const useGameStore = create<GameStore>((set) => ({
  gameState: initialState,
  setGameState: (state) => set((prev) => ({...})),
}))

// Usar em componentes
const gameState = useGameStore((state) => state.gameState)
const setGameState = useGameStore((state) => state.setGameState)
```

### TypeScript

Modo strict: `noImplicitAny`, `strictNullChecks` ativados.

**Boas práticas:**
- Defina tipos para todos os parâmetros de função
- Use `interface` para objetos grandes
- Evite `any` usando `unknown` quando necessário

### Tailwind CSS

Utility-first CSS. Configuração em `tailwind.config.ts`.

```tsx
<div className="absolute bottom-8 left-8 w-48 h-4 bg-gray-900 border border-gray-700">
```

## Performance Optimization

### 1. Lazy Loading

```typescript
// AudioSystem carrega Howler apenas no cliente
const loadHowler = async () => {
  const { Howl } = await import('howler')
  return Howl
}
```

### 2. Memoization

```typescript
// Componentes 3D devem ser memoizados
const GameScene = React.memo(() => {
  // ...
})
```

### 3. useCallback

```typescript
// Evite recriação de funções em callbacks
const handleClick = useCallback(() => {
  // ...
}, [dependencies])
```

## Debugging

### Console Logging

```typescript
// Em qualquer componente ou sistema
console.log('Debug:', store.gameState)

// Com colors (dev tools)
console.log('%c HORROR SYSTEM ', 'background: red; color: white', anxiety)
```

### React DevTools

- Instale extensão React DevTools no Chrome
- Inspecione componentes e state em tempo real

### Three.js DevTools

- Use `OrbitControls` (em Drei) para inspeção visual
- Adicione eixos guia: `<axesHelper args={[5]} />`

```tsx
// Apenas em desenvolvimento
{process.env.NODE_ENV === 'development' && (
  <axesHelper args={[10]} />
)}
```

## Testes (Roadmap)

A infraestrutura de testes será adicionada em V2.
