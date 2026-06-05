# Bastidores: Um jogo de Terror

Uma experiência de terror psicológico baseada em Backrooms, desenvolvida em Next.js com Three.js para renderização 3D.

## 🛠️ Tech Stack

| Categoria        | Tecnologia                     |
| ---------------- | ------------------------------ |
| **Framework**    | Next.js 14 + React 18          |
| **3D Rendering** | Three.js + React Three Fiber 8 |
| **State**        | Zustand 4                      |
| **Audio**        | Howler.js 2                    |
| **Styling**      | Tailwind CSS 3                 |
| **Language**     | TypeScript 5                   |

## 📖 Documentação

### 🚀 Para Começar

- **[Como Jogar](docs/gameplay/GAMEPLAY.md)** - Aprenda o objetivo, controles e estratégia
- **[Desenvolvimento](docs/guides/DEVELOPMENT.md)** - Setup, workflow, stack tecnológico
- **[Arquitetura](docs/technical/ARCHITECTURE.md)** - Design técnico, fluxo de dados, módulos

### 🔧 Operacional

- **[Deploy (Vercel)](docs/guides/DEPLOYMENT.md)** - Guia passo a passo para produção
- **[Setup de Áudio](docs/audio/AUDIO_SETUP.md)** - Como adicionar trilhas personalizadas
- **[Contribuir](docs/guides/CONTRIBUTING.md)** - Style guide, PR process, roadmap

### 📝 Histórico

- **[Changelog](docs/changelog/CHANGELOG.md)** - V0.1.0 features, fixes, roadmap V2

## ⚙️ Configurações Principais

Edite `src/config/constants.ts` para ajustar:

```typescript
// Velocidade do jogador
MOVE_SPEED: 8,

// Rates de ansiedade
ANXIETY_RISE_SAFE: -0.15,      // zona segura
ANXIETY_RISE_NORMAL: 0.5,      // corredores
ANXIETY_RISE_OPEN: 0.75,       // áreas abertas

// Volumes de áudio
MASTER_VOLUME: 0.8,
AMBIENT_BASE: 0.4,
SFX_VOLUME: 0.6,
```

## 🎵 Adicionar Trilhas Sonoras

O jogo suporta trilhas personalizadas!

**Rápido (3 passos)**:

1. Coloque arquivos MP3 em `public/audio/`
2. Nomeie como: `ambient-base.mp3`, `tension-layer.mp3`, `footsteps.mp3`, `whisper.mp3`, `buzz.mp3`
3. **Pronto!** O jogo carregará automaticamente

**Detalhado**: [Audio Setup Guide](docs/audio/AUDIO_SETUP.md)

## 📁 Estrutura do Projeto

```
bastidores/
├── src/
│   ├── app/                      # Next.js App Router
│   ├── components/
│   │   ├── ui/                  # UI components (Menu.tsx)
│   │   └── game/                # Game components (3D, gameplay)
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions
│   ├── store/                   # Zustand state (gameStore.ts)
│   ├── systems/                 # Game systems (horror, audio, objectives)
│   ├── config/                  # Constants and configuration
│   └── types/                   # TypeScript types
├── docs/                         # Documentação organizada
│   ├── guides/                  # Desenvolvimento, Deploy, Contribuição
│   ├── technical/               # Arquitetura, design detalhado
│   ├── gameplay/                # Guias de gameplay
│   ├── audio/                   # Setup de áudio
│   └── changelog/               # Histórico de versões
├── public/
│   └── audio/                   # Trilhas sonoras (colocar aqui!)
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
```

📖 [Estrutura completa em DEVELOPMENT.md](docs/guides/DEVELOPMENT.md#estrutura-de-projeto)

## 🔧 Arquitetura (Resumo)

O jogo segue arquitetura em camadas com separação clara de responsabilidades:

```
┌─ UI Layer (Menu, HUD, Components)
├─ 3D Rendering Layer (Three.js, MapGeometry)
├─ Game Systems (PlayerController, Horror, Audio)
├─ Business Logic (HorrorSystem, AudioSystem, ObjectiveSystem)
└─ State Management (Zustand Store + Constants)
```

**Data Flow**: Input → PlayerController → Systems → Store → UI Updates

📖 [Arquitetura detalhada em ARCHITECTURE.md](docs/technical/ARCHITECTURE.md)

🔗 [Roadmap completo em CHANGELOG.md](docs/changelog/CHANGELOG.md#roadmap-v2-post-mvp)

## 🐛 Troubleshooting

### "Áudio não toca"

- Verifique DevTools (F12) → Console
- Confirme que arquivos estão em `public/audio/`
- Volume do navegador está ligado?

### "Build falha localmente"

- Rode `npm run lint` para ver erros TypeScript
- Limpe `node_modules`: `rm -rf node_modules && npm install`

### "Jogo roda lento"

- Reduz efeitos post-processing em `src/config/constants.ts`
- Verifique DevTools → Performance tab

📖 [Mais troubleshooting em DEVELOPMENT.md](docs/guides/DEVELOPMENT.md#debugging)