# Bastidores: Um jogo de Terror

Uma experiência de terror psicológico e exploração de espaços liminares baseada nas Backrooms. Desenvolvido com React Three Fiber, o jogo combina estética retro analógica, distorções em *glitch art* e mecânicas de sobrevivência para criar uma atmosfera imersiva e sufocante diretamente no navegador.

## ✨ Principais Funcionalidades

* **Renderização de Alta Performance:** Utilização de matrizes e `InstancedMesh` para desenhar milhares de blocos procedurais de geometria 3D com uma única *draw call*.
* **Motor de Loucura (Madness Engine):** Sistema dinâmico de probabilidade (RNG) que escala alucinações auditivas, gritos e tremores de câmera com base no nível de ansiedade do jogador.
* **Física e Sobrevivência:** Movimentação tática com colisão deslizante (AABB), gerenciamento de estamina para corridas e armadilhas ambientais de queda livre (abismos).
* **Interface Imperativa (HUD):** Atualizações visuais de pânico e filtros de vinheta vermelha pulsante injetados diretamente no DOM (Vanilla JS), garantindo zero re-renders no React.
* **Transições Narrativas:** Introdução guiada por poemas dramáticos, culminando em um colapso audiovisual que arremessa o jogador para dentro do jogo sem telas de carregamento tradicionais.

---

## 🚀 Como Rodar

```bash
# Clone o projeto
git clone https://github.com/brenoASantana/bastidores.git

# Instale as dependências
make install

# Inicie o servidor de desenvolvimento
make dev

```

---

## 🛠️ Tech Stack

| Categoria | Tecnologia |
| --- | --- |
| **Framework** | Next.js 14 + React 18 |
| **3D Rendering** | Three.js + React Three Fiber 8 + Drei |
| **State** | Zustand 4 |
| **Audio** | Howler.js 2 (Modular Singleton) |
| **Styling** | Tailwind CSS 3 |
| **Language** | TypeScript 5 |

> **Documentação Técnica:** Para entender o fluxo de dados, a renderização imperativa e a organização dos sistemas lógicos, veja o nosso [Guia de Arquitetura](https://www.google.com/search?q=docs/ARCHITECTURE.md).

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
│   ├── data/           # Matrizes de Mapa e Metadados (Metadata.ts)
│   ├── store/          # Zustand State Management (GameStore)
│   └── utils/          # Interfaces e Helpers
├── docs/               # Documentação de Arquitetura e Engenharia
└── public/             # Assets estáticos (Áudio, Texturas, Vídeos, Imagens)

```

---

## 🐛 Troubleshooting

* **Áudio não toca imediatamente:** O navegador exige interação do usuário (clique) antes de liberar o `AudioContext`. O nosso motor força o desbloqueio no primeiro clique da tela de Menu.
* **Queda de Performance/FPS:** Verifique se não há novos blocos instanciando componentes individuais em vez de utilizar o agrupamento lógico dentro do `<Instances>` no `LevelRenderer`.
* **Erro no Build Local:** Rode `make lint` para checar tipagens estritas do TypeScript antes de realizar o deploy.

---

### Desenvolvido por Breno Santana
