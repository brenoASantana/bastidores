# Changelog - bastidores

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-04-01

### Added (Adicionado)

#### Core Gameplay
- ✅ First-person exploration com controles FPS (WASD + Mouse)
- ✅ Sistema dinâmico de ansiedade (0-100) reativo à zona do mapa
- ✅ Coleta de 3 objetivos para vitória
- ✅ Condição de derrota: colapso mental (ansiedade 95+ por 5s)
- ✅ Objetivo de saída após coleta completa

#### Horror Systems
- ✅ `HorrorSystem` com cálculo de ansiedade por zona
  - Zona segura: -0.15/s
  - Zona normal: +0.5/s
  - Zona aberta: +0.75/s
- ✅ Eventos de horror aleatórios (passos distantes, sussurros)
- ✅ Efeitos visuais por limiares de ansiedade
  - Vinheta preta
  - Granulado
  - Blur
  - Aberração cromática
  - Zoom leve

#### Audio & Music
- ✅ `AudioSystem` com Howler.js
- ✅ Trilha em 2 camadas (ambient + tension)
- ✅ Mixer dinâmico reativo à ansiedade
- ✅ SFX posicionais (placeholder com data URIs)
- ✅ Lazy loading de Howler para evitar SSR issues

#### 3D Rendering
- ✅ React Three Fiber com Three.js
- ✅ Mapa com corredores, paredes, piso, teto
- ✅ Iluminação fluorescente instável
- ✅ Colisão AABB simples
- ✅ Neblina para efeito de profundidade
- ✅ Marcadores de objetivos (esferas amarelas com luz)

#### State Management
- ✅ Zustand store com `useGameStore`
- ✅ Rastreamento de estado do jogo (boot → menu → playing → failed/completed)
- ✅ Posição e rotação do player em tempo real
- ✅ Progressão de objetivos
- ✅ Temporizador de sessão

#### UI & UX
- ✅ Menu inicial com instruções
- ✅ HUD in-game com:
  - Barra de ansiedade
  - Contador de objetivos
  - Instruções de controle
  - Indicador de distorção por ansiedade
- ✅ Tela de fim (vitória com tempo / derrota com ansiedade final)
- ✅ Responsive design (desktop + mobile basic)
- ✅ Pointer lock para câmera imersiva

#### Development & Tooling
- ✅ Next.js 14 com TypeScript
- ✅ Tailwind CSS para styling
- ✅ ESLint & Prettier
- ✅ Makefile com comandos úteis
- ✅ `next.config.mjs` otimizado
- ✅ `.npmrc` com legacy-peer-deps para compatibilidade

#### Documentation
- ✅ README.md com overview
- ✅ ARCHITECTURE.md com design técnico
- ✅ GAMEPLAY.md com guia do jogo
- ✅ DEVELOPMENT.md com guia dev
- ✅ CONTRIBUTING.md com diretrizes
- ✅ CHANGELOG.md (este arquivo)

### Changed (Alterado)

- Downgrade de Next.js 15 → 14.1 (estabilidade)
- Downgrade de React 19 → 18.2 (compatibilidade com R3F 8)
- Removed `next.config.ts` → `next.config.mjs`
- Refactored audioSystem para lazy-load Howler
- Removido dynamic import de GameContainer (causava erros React)

### Fixed (Corrigido)

- ❌ "Fog is not exported from @react-three/drei" → Usado `<fog attach="fog" />`
- ❌ "Howler is not defined" → Lazy loading com getAudioSystem()
- ❌ "Cannot read properties of undefined (ReactCurrentOwner)" → Downgrade Next.js 15 → 14
- ❌ "Metadata viewport unsupported" → Separado viewport export
- ❌ Incompatibilidade React 19 + R3F 8 → Usar React 18

### Removed (Removido)

- Removido tipo Three.js `Fog` (importado erroneamente de Drei)
- Removido dynamic import de GameContainer (SSR issues)
- Removido tipo genérico não tipado `any` em audioSystem

## Versionamento

**Versão Atual: 0.1.0** (MVP)

```
MAJOR.MINOR.PATCH
  0  .  1   .  0
  │     │     └─ Bug fixes
  │     └─ Novas features
  └─ Breaking changes
```

### Próximas Versões (Planejadas)

- **0.2.0**: Mais eventos, balanceamento avançado, mobile optimization
- **0.5.0**: Procedural maps básico
- **1.0.0**: Multiplayer beta
- **1.5.0**: Voz posicional
- **2.0.0**: Sistema completo de leaderboard, eventos sazonais

## Pipeline de Release

```
Development (main branch)
    ↓
Feature branches com PRs
    ↓
Code review & tests
    ↓
Merge para main
    ↓
Tag de versão (v0.1.0)
    ↓
Auto-deploy Vercel
    ↓
Production
```

## Known Issues (Bugs Conhecidos)

Nenhum crítico no MVP.

**Melhorias Futuras:**
- [ ] Mobile performance (reduzir efeitos post-processing)
- [ ] Multi-language support
- [ ] Configurações de acessibilidade (font size, contrast)
- [ ] Settings menu in-game (volume, sensibilidade)

## Roadmap V2 (Post-MVP)

### Gameplay
- [ ] Multiplayer com sincronização de posição
- [ ] Aparição/desaparição de jogadores ("fase" separadas)
- [ ] Vozes ecoadas por proximidade
- [ ] Mais eventos de horror (visões, glitches, entidades)
- [ ] Procedural map generation (controlada por seed)
- [ ] Upgrades/power-ups (antipsicóticos, lanternas)

### Tech
- [ ] WebRTC para voz posicional
- [ ] Backend Node.js para sincronização
- [ ] Database para leaderboard
- [ ] Analytics avançadas
- [ ] Shaders customizados para visual único

### Content
- [ ] Ativos de áudio profissionais (trilhas reais)
- [ ] Texturas de alta qualidade
- [ ] Cinemáticas iniciais
- [ ] Lore expandido (diários, mensagens)

## Contributors

**Versão 0.1.0 (MVP)**
- [@brenoASantana](https://github.com/brenoASantana) - Creator & Lead Developer
- Copilot Assistant - Estrutura, implementação e documentação

---

**Última atualização**: 2026-04-01

**Status**: MVP Completo ✅
