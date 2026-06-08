# Arquitetura do Bastidores Game

## Visão Geral

O projeto segue uma arquitetura modular e reativa. A renderização é procedural, baseada em matrizes de dados, e os sistemas de gameplay são desacoplados da camada visual.

graph TD
    %% Definição de Estilos
    classDef layer fill:#f9f9f9,stroke:#333,stroke-width:2px;

    UI[UI Layer: Components<br/>Menu.tsx | GameHUD.tsx | CreditsScreen.tsx]
    Render[3D Rendering Layer: R3F<br/>LevelRenderer | Block | AssetLoader]
    Logic[Systems & Gameplay Logic<br/>PlayerController | HorrorSystem | AudioSystem]
    State[State Management & Configuration<br/>Zustand Store | Namespaced Constants]

    UI --> Render
    Render --> Logic
    Logic --> State

    %% Aplicando estilos
    class UI,Render,Logic,State layer;

---

## 1. Camada de Renderização 3D (`/src/components/game`)

### `LevelRenderer.tsx` (Procedural Engine)

É o núcleo visual do jogo. Ele não hardcoda paredes; ele consome uma `mapMatrix` e itera sobre ela.

* **Responsabilidade**: Converter dados (números) em objetos 3D.
* **Mecanismo**: Utiliza `useMemo` para evitar re-renderizações custosas da geometria do mapa.

### `Block.tsx` (Factory Pattern)

Resolve o problema de "Hook Condicional" no React.

* **TexturedBlock**: Chama `useTexture` para blocos que possuem texturas.
* **PlainBlock**: Renderiza apenas cor sólida (performance).
* **Factory**: O componente `Block` decide qual desses renderizar, garantindo que o Hook de textura nunca seja chamado em blocos que não o utilizam.

---

## 2. Sistemas de Gameplay (`/src/systems` e `hooks`)

### `PlayerController.tsx`

Gerencia a física e a imersão.

* **Física**: Implementa colisão AABB (*Axis-Aligned Bounding Box*) com deslizamento.
* **Loop**: Utiliza o `useFrame` do Fiber para processar inputs, calcular deltas de movimento e atualizar o estado do jogador.

### `AudioSystem.ts` (Service Locator)

Sistema robusto baseado em `Howler.js` com *Lazy Loading*.

* **Auto-Registration**: Lê o objeto `ASSETS` do arquivo de constantes e registra todos os sons automaticamente via `Object.entries`.
* **Mixer Reativo**: O método `updateAnxietyLayer` ajusta volumes globalmente em tempo real baseando-se na ansiedade.

### `HorrorSystem.ts`

Gerencia o clima psicológico.

* **Cálculo de Ansiedade**: Usa multiplicadores baseados no tipo de bloco (ex: corredores vs. áreas abertas).
* **Event Dispatcher**: Determina quando disparar efeitos sonoros (whispers, footsteps) com base na taxa de ansiedade atual.

---

## 3. Configuração (Config-as-Code)

Centralizamos todo o balanceamento e endereçamento de assets em `src/config/constants.ts` usando **Namespacing**.

* **WORLD**: Dimensões (`BLOCK_SIZE`, `WALL_HEIGHT`).
* **GAME**: Variáveis de gameplay (ansiedade, velocidade).
* **ASSETS**: Mapeamento completo de texturas e áudios.

**Vantagem**: Alterar um caminho de arquivo ou uma velocidade de movimento não exige alterar a lógica dos componentes, apenas o arquivo de configuração.

---

## 4. Gerenciamento de Estado (`/src/store`)

### `gameStore.ts` (Zustand)

Mantém o *Source of Truth* do jogo.

* **Granularidade**: O estado é dividido em `gameState` (anxiety, objectives) e `player` (position, rotation).
* **Reatividade**: O `GameHUD` e o `GameContainer` assinam apenas as fatias do estado que precisam para renderizar, evitando renderizações desnecessárias.

---

## 5. Fluxo de Dados (Data Flow)

```text
Input (Keyboard/Mouse)
  ↓
PlayerController (Update Position)
  ↓
HorrorSystem (Calculate Anxiety based on Position)
  ↓
Zustand Store (Update Game State)
  ↓
AudioSystem / GameHUD (React to Store Changes)
  ↓
UI & Audio Update (Reactive Render)

```
