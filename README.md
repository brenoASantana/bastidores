# Bastidores: Um jogo de Terror

Uma experiência de terror psicológico e exploração de espaços liminares baseada nas Backrooms. Desenvolvido com React Three Fiber, o jogo combina estética retro analógica, distorções em *glitch art* e mecânicas de sobrevivência para criar uma atmosfera imersiva e sufocante diretamente no navegador.

## ✨ Principais Funcionalidades

* **Geração de Complexo Topológico:** O labirinto não é apenas aleatório; ele utiliza algoritmos de *Backtracking*, *Braiding* (criação de loops) e *Pruning* (poda reversa) para transformar corredores sem saída em zonas de escuridão profunda e aterrorizante.
* **Renderização de Alta Performance:** Utilização de `InstancedMesh` para desenhar as paredes do complexo em uma única *draw call*, acompanhado de planos gigantes únicos para o teto e carpete, eliminando *Z-fighting* e otimizando a GPU.
* **Motor de Loucura (Madness Engine):** Sistema dinâmico de probabilidade (RNG) que escala alucinações auditivas, gritos e tremores de câmera com base no nível de ansiedade do jogador.
* **Física e Imersão Fluida:** Movimentação tática com colisão deslizante (AABB), gerenciamento de estamina e uso da *Pointer Lock API* com ejetor automático via `visibilitychange` (suporte perfeito a Alt+Tab).
* **Interface Imperativa (HUD):** Atualizações visuais de pânico e filtros de vinheta vermelha pulsante injetados diretamente no DOM (Vanilla JS), garantindo zero re-renders no React.
* **Jornada Linear Narrativa:** O fluxo de UI abandona menus soltos em prol de uma experiência cinematográfica ininterrupta: do Tutorial, passando pela distorção do *Noclip*, direto para as costas do jogador coladas na parede do Complexo.

---

## 🚀 Como Rodar

```bash
# Clone o projeto
git clone [https://github.com/brenoASantana/bastidores.git](https://github.com/brenoASantana/bastidores.git)

# Instale as dependências
make install

# Inicie o servidor de desenvolvimento
make dev

```

---

## 🛠️ Tech Stack

| Categoria        | Tecnologia                            |
| ---------------- | ------------------------------------- |
| **Framework**    | Next.js 14 + React 18                 |
| **3D Rendering** | Three.js + React Three Fiber 8 + Drei |
| **State**        | Zustand 4                             |
| **Audio**        | Howler.js 2 (Modular Singleton)       |
| **Styling**      | Tailwind CSS 3                        |
| **Language**     | TypeScript 5                          |

> **Documentação Técnica:** Para entender o fluxo de dados, a renderização imperativa e a organização dos sistemas lógicos, veja o nosso [Guia de Arquitetura](https://www.google.com/search?q=./docs/ARCHITECTURE.md).

---

## ⚙️ Configurações (Config/Constants)

A arquitetura adota a filosofia de *Config-as-Code*. A imensa maioria das alterações de balanceamento é feita de forma centralizada em `src/config/Constants.ts`.

```typescript
import { GAME, ASSETS, MADNESS } from '@/config/Constants';

// Exemplo: Ajuste de gameplay e limite de estamina
console.log(GAME.PLAYER.STAMINA_MAX);

// Exemplo: Acesso a assets de texturas e imagens
const wallpaper = ASSETS.TEXTURES.WALLPAPER;

```

---

## 🎵 Sistema de Áudio Modular

O jogo utiliza uma classe `AudioSystem` otimizada com *lazy loading* e proteção contra recarregamentos acidentais durante o Hot-Reload do Next.js. Para adicionar novos sons:

1. Coloque o arquivo de áudio (`.ogg`) na pasta `public/assets/audio/`.
2. Adicione a constante no objeto `ASSETS.AUDIO` dentro do `Constants.ts`.
3. O sistema fará o pré-carregamento automático no estágio correto (`initializeEssential` ou `initializeGameplay`).

---

## 📁 Estrutura do Projeto

```text
bastidores/
├── src/
│   ├── app/            # Next.js App Router (Páginas principais)
│   ├── components/     # UI (DOM Imperativo) e Geometria R3F
│   ├── config/         # Constantes centralizadas (Assets, Balanceamento)
│   ├── data/           # Configurações Estáticas e Metadados
│   ├── store/          # Zustand State Management (GameStore)
│   └── utils/          # Geração Procedural do Complexo e Helpers
├── docs/               # Documentação de Arquitetura e Engenharia
└── public/             # Assets estáticos (Áudio, Texturas, Vídeos)

```

---

## 🐛 Troubleshooting

* **Áudio não toca imediatamente:** O navegador exige interação do usuário (clique) antes de liberar o `AudioContext`. O nosso motor força o desbloqueio no primeiro clique do jogador.
* **Mouse travado ou solto em horas erradas:** A `Pointer Lock API` só pode ser disparada após um clique intencional do usuário (ex: botão "Prosseguir" no Tutorial).
* **Erro no Build Local:** Rode `make lint` para checar tipagens estritas do TypeScript antes de realizar o deploy.

---

### Desenvolvido por Breno Santana
