# BACKROOMS - Psychological Horror Game

Uma experiência de terror psicológico baseada na creepypasta Backrooms, desenvolvida em Next.js com Three.js para renderização 3D.

## 🎮 Quick Start

### Instalação (30s)

```bash
git clone https://github.com/brenoASantana/bastidores.git
cd bastidores
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). **Pronto!**

### Deploy (3 Cliques - Vercel)

1. Push para GitHub
2. Conecte em [vercel.com](https://vercel.com)
3. Clique "Deploy"

📖 [Guia completo em `/docs/guides/DEPLOYMENT.md`](docs/guides/DEPLOYMENT.md)

## ✨ Features

- 🎮 **First-Person Exploration**: Controles FPS fluidos com câmera livre
- 😰 **Anxiety System**: Sistema dinâmico que afeta a gameplay
- 🎵 **Dynamic Audio**: Trilha em camadas reativa ao estado emocional
- 👁️ **Post-Processing**: Efeitos visuais que intensificam o terror (vinheta, granulado, distorção)
- 🏃 **Agoraphobia Mechanics**: Áreas abertas aumentam ansiedade
- 🎯 **Objective System**: Colete objetivos e escape antes do colapso mental
- 🎨 **Responsive Design**: Desktop + Mobile

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

## 🎮 Como Jogar (Resumo)

**Objetivo**: Colete 3 objetivos (esferas amarelas) e encontre a saída antes que seu colapso mental.

**Controles**:

| Ação      | Input        |
| --------- | ------------ |
| Movimento | WASD / Setas |
| Sprint    | SHIFT        |
| Câmera    | Mouse        |

**Mecânica Principal - Ansiedade**:

- **Zona Segura** (origem): -0.15/s
- **Corredores Normais**: +0.5/s
- **Áreas Abertas**: +0.75/s
- **Colapso**: Ansiedade > 95% por 5s = Derrota

📖 [Guia completo em GAMEPLAY.md](docs/gameplay/GAMEPLAY.md)

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

## 🚀 Desenvolvimento

### Comandos Principais

```bash
npm run dev        # Iniciar servidor de desenvolvimento
npm run build      # Build para produção
npm start          # Iniciar servidor de produção
npm run lint       # Validar TypeScript
make help          # Ver todos os comandos (Makefile)
```

### Workflow Típico

1. **Feature Branch**: `git checkout -b feat/minha-feature`
2. **Desenvolvimento**: `npm run dev` + editar código
3. **Testing**: Teste localmente, sem erros TypeScript
4. **Commit**: `git commit -m "feat: descrição clara"`
5. **Push**: `git push origin feat/minha-feature`
6. **PR**: Abra Pull Request com descrição

📖 [Guia completo em DEVELOPMENT.md](docs/guides/DEVELOPMENT.md)

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

## 🤝 Contribuir

Bem-vindo! Leia [`CONTRIBUTING.md`](docs/guides/CONTRIBUTING.md) para:

- Como reportar bugs
- Como sugerir features
- Style guide (TypeScript/React)
- Checklist de PR

## 📊 Roadmap V2

- [ ] Multiplayer com sincronização
- [ ] Procedural map generation
- [ ] Mais eventos de horror
- [ ] Voz posicional 3D
- [ ] Leaderboard global
- [ ] Settings menu in-game

🔗 [Roadmap completo em CHANGELOG.md](docs/changelog/CHANGELOG.md#roadmap-v2-post-mvp)

## 🎓 Aprender Mais

- **Gameplay Mechanics**: [docs/gameplay/GAMEPLAY.md](docs/gameplay/GAMEPLAY.md)
- **Technical Deep Dive**: [docs/technical/ARCHITECTURE.md](docs/technical/ARCHITECTURE.md)
- **Development Guide**: [docs/guides/DEVELOPMENT.md](docs/guides/DEVELOPMENT.md)
- **Contributing**: [docs/guides/CONTRIBUTING.md](docs/guides/CONTRIBUTING.md)

## ⚡ Performance

- **Bundle Size**: ~2.5 MB (otimizado com Vercel)
- **Audio Size**: ~2 MB (trilhas + SFX)
- **FPS Target**: 60 FPS em desktop, 30+ em mobile
- **Load Time**: <5s em Vercel

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

## 📜 License

MIT - Sinta-se livre para usar, modificar e distribuir.

## 🙏 Créditos

**Inspirado pela creepypasta "The Backrooms"** - Uma comunidade de horror psicológico.

**Desenvolvido com** ❤️ em Next.js, Three.js e muito café.

---

**Versão**: 0.1.0 (MVP)
**Status**: ✅ Completo e Pronto para Produção
**Última Atualização**: 31 de maio de 2026

**Links Rápidos:**

- 🌐 [Deploy em Vercel](https://vercel.com)
- 📖 [Docs Completas](docs/)
- 🐛 [Reportar Bug](https://github.com/brenoASantana/bastidores/issues)
- ⭐ [Star no GitHub](https://github.com/brenoASantana/bastidores)
