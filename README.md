# BACKROOMS - Psychological Horror Game

Uma experiência de terror psicológico baseada na creepypasta Backrooms, desenvolvida em Next.js com Three.js para renderização 3D.

## Features

- 🎮 **First-Person Exploration**: Controles FPS fluidos com câmera livre
- 😰 **Anxiety System**: Sistema dinâmico de ansiedade que afeta a gameplay
- 🎵 **Dynamic Audio**: Trilha em camadas reativa ao estado emocional
- 👁️ **Post-Processing**: Efeitos visuais que intensificam o terror (vinheta, granulado, distorção)
- 🏃 **Agoraphobia Mechanics**: Áreas abertas aumentam ansiedade
- 🎯 **Objective System**: Colete objetivos e escape antes do colapso mental

## Tech Stack

- **Framework**: Next.js 15 + React 19
- **3D Rendering**: Three.js + React Three Fiber
- **State Management**: Zustand
- **Audio**: Howler.js
- **Styling**: Tailwind CSS
- **Typing**: TypeScript

## Getting Started

### Pré-requisitos

- Node.js 18+ instalado

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Build para Produção

```bash
npm run build
npm start
```

## Como Jogar

1. **Início**: Clique em "ENTRAR" para começar
2. **Movimento**: Use WASD ou Setas para se mover
3. **Câmera**: Mova o mouse para olhar ao redor
4. **Sprint**: Segure SHIFT para correr
5. **Objetivo**: Colete 3 objetivos (esferas amarelas) e chegue à saída
6. **Cuidado**: Sua ansiedade aumenta em áreas abertas e pode causar colapso mental

## Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── Menu.tsx             # Menu screen
│   └── game/
│       ├── GameContainer.tsx     # Main game container
│       ├── GameScene.tsx         # 3D scene setup
│       ├── GameHUD.tsx           # UI overlay
│       ├── PlayerController.tsx  # Player input and physics
│       ├── MapGeometry.tsx       # Map visuals
│       └── ObjectiveMarkers.tsx  # Objective rendering
├── store/
│   └── gameStore.ts         # Zustand game state
├── systems/
│   ├── horrorSystem.ts      # Anxiety and horror events
│   ├── audioSystem.ts       # Audio management
│   └── objectiveSystem.ts   # Objective tracking
├── config/
│   └── constants.ts         # Game constants
└── types/
    └── game.ts              # TypeScript types
```

## Configurações Principais

Edite `src/config/constants.ts` para ajustar:

- Velocidade de movimento
- Taxa de aumento de ansiedade
- Distância de áreas seguras
- Volume de áudio

## Deploy

O jogo está configurado para deploy no Vercel:

```bash
npm install -g vercel
vercel
```

## Roadmap V2

- [ ] Multiplayer com aparição/desaparição de jogadores
- [ ] Vozes ecoadas por proximidade
- [ ] Procedural map generation
- [ ] Mais eventos e efeitos de horror
- [ ] Leaderboard
- [ ] Save system

## Créditos

Inspirado pela creepypasta "The Backrooms" e pela comunidade de horror psicológico.

## License

MIT
