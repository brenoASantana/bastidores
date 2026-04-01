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

- **Framework**: Next.js 14 + React 18
- **3D Rendering**: Three.js 0.160 + React Three Fiber 8
- **State Management**: Zustand 4
- **Audio**: Howler.js 2
- **Styling**: Tailwind CSS 3
- **Typing**: TypeScript 5
- **Build Tool**: Webpack/SWC

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

### 🎵 Adicionar Trilhas Sonoras

O jogo está pronto para trilhas sonoras personalizadas!

**Rápido:**
1. Coloque seus arquivos MP3 em `public/audio/`
2. Nomeie-os como:
   - `ambient-base.mp3` (som de fundo)
   - `tension-layer.mp3` (cresce com medo)
   - `footsteps.mp3` (passos distantes)
   - `whisper.mp3` (sussurro)
   - `buzz.mp3` (zumbido)
3. Pronto! O jogo carregará automaticamente

**Detalhado:** Leia [AUDIO_SETUP.md](AUDIO_SETUP.md) para guia completo com:
- Como obter áudios de qualidade
- Converter entre formatos
- Ajustar volumes
- Adicionar mais sons
- Troubleshooting

**Debug:** Use o componente `AudioDebugger` para ver qual arquivo não está carregando:
```typescript
import { AudioDebugger } from '@/components/AudioDebugger'

export default function Home() {
  return (
    <>
      {/* seu codigo */}
      <AudioDebugger /> {/* Aparece no canto inferior direito */}
    </>
  )
}
```

### Usando Makefile

```bash
make help      # Ver todos os comandos disponíveis
make dev       # Iniciar servidor de desenvolvimento
make build     # Build para produção
make clean     # Limpar artifacts
make deploy    # Deploy na Vercel
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

O jogo está 100% configurado para deploy no **Vercel** (recomendado) ou outros hostings Next.js:

### Vercel (Automático via GitHub - 3 Cliques)

1. **Push para GitHub:**
   ```bash
   git remote add origin https://github.com/seu-usuario/bastidores.git
   git push -u origin main
   ```

2. **Vercel Deploy:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique "New Project"
   - Selecione repositório `bastidores`
   - Clique "Deploy"
   - **Pronto!** Seu jogo está online 🎉

### Vercel CLI (Uma Linha)

```bash
npm install -g vercel
vercel --prod
```

### Detalhes Completos

📖 Veja [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) para:
- Guia passo a passo
- Troubleshooting
- Domínio personalizado
- Monitoramento
- Otimizações

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
