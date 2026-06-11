
# Arquitetura do Bastidores Game

## Visão Geral

O projeto segue uma arquitetura modular, reativa e otimizada para o ecossistema WebGL no navegador. A renderização 3D é estritamente procedural, baseada em matrizes de dados numéricos, enquanto os sistemas físicos, lógicos e sonoros rodam de forma desacoplada da camada visual para garantir taxas de quadros constantes (60 FPS+).

```text
┌────────────────────────────────────────────────────────┐
│                 UI Layer (Components)                  │
│  Menu.tsx (Linear Flow) | GameHUD.tsx | StaminaBar.tsx │
└───────────────────────────┬────────────────────────────┘
                            │ (Zustand Subscribe & Pointer Lock)
┌───────────────────────────▼────────────────────────────┐
│             3D Rendering Layer (R3F)                   │
│   LevelRenderer (Instanced) | EnvironmentBounds (Giant)│
└───────────────────────────┬────────────────────────────┘
                            │ (useFrame Loop / Delta)
┌───────────────────────────▼────────────────────────────┐
│          Systems & Gameplay Logic (Heartbeat)          │
│       Game.tsx | PlayerController | AudioSystem        │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│          State Management & Data Generation            │
│ Zustand Store | ComplexGenerator.ts | Metadata.ts      │
└────────────────────────────────────────────────────────┘

```

---

## 1. Topologia e Geração Procedural do Complexo (`/src/utils/ComplexGenerator.ts`)

A lógica de criação do cenário abandonou a nomenclatura de "Mapa" para "Complexo", refletindo sua natureza caótica, instável e impiedosa. A matriz gerada obedece a uma topologia rigorosa:

* **Blindagem de Bordas**: As extremidades absolutas da matriz (`0` e `lenght-1`) são forçadas a serem blocos de Parede, criando um selamento hermético que impede vazamentos da câmera para o "vazio" 3D.
* **Algoritmo de Pruning (Veneno de Escuridão)**: Em vez de espalhar manchas escuras de forma puramente randômica, o motor varre a matriz procurando becos sem saída. Ao encontrar um, ele realiza um "Flood Fill" reverso, pintando o corredor de breu até esbarrar em uma bifurcação iluminada com 3 ou mais saídas. Isso garante que todo caminho escuro seja, por definição de *Level Design*, uma armadilha psicológica de "beco sem saída".
* **Spawn Imersivo Tridimensional**: O algoritmo de *Spawn* não escolhe um bloco vazio aleatório. Ele filtra apenas blocos de chão onde o "Norte" (frente da câmera) esteja livre e o "Sul" (costas) seja uma Parede Maciça. Isso garante que a transição da cena de introdução pareça um *Noclip* físico atravessando uma parede sólida.
* **Saída Dinâmica e Distanciamento Segurado**: A porta de saída (`EXIT`) calcula a distância de Manhattan em relação ao *Spawn*. Ela é obrigada a surgir a uma distância mínima segura, e após ser posicionada, espalha uma aura de blocos `EXIT_PATH` ao seu redor.

---

## 2. Camada de Renderização 3D (`/src/components/game`)

### `LevelRenderer.tsx` & `EnvironmentBounds.tsx`

O núcleo visual foi completamente otimizado para mitigar o gargalo de *draw calls* no navegador e evitar *Z-fighting* de texturas.

* **Macro-Planos Gigantes**: O chão (carpete) e o teto abandonaram a renderização em *grids* bloco por bloco. Agora, o `EnvironmentBounds` renderiza **dois únicos planos gigantes** que cobrem toda a área da matriz com a propriedade `THREE.RepeatWrapping`, elevando a performance massivamente.
* **Renderização por Instanciação (`<Instances>`)**: O motor agrupa paredes (`wallPositions`) e portais de saída em lotes de malhas instanciadas (`InstancedMesh`). Isso permite desenhar milhares de blocos verticais em uma única instrução enviada à GPU.
* **Lâmpadas com Culling por Distância**: O `FluorescentLight` possui corpo físico (`mesh` colado no teto). Para não sobrecarregar o motor de luzes (PointLights) da GPU, cada lâmpada usa a distância vetorial da câmera do jogador para se auto-desligar caso fique a mais de 30 metros de distância, reativando-se silenciosamente ao se aproximar.

---

## 3. Ciclo de Gameplay e Sistemas (`/src/components/game` & `/src/config`)

### `Game.tsx` (The Game Heartbeat)

Centraliza o loop de simulação física através do hook `useFrame`:

* **Física Deslizante (Sliding AABB)**: Anula vetores de eixo independentemente, permitindo que o jogador deslize por quinas.
* **Pointer Lock API Responsiva**: Em conjunção com o `Menu.tsx`, o sistema sequestra o cursor nativamente. Um `Event Listener` de `visibilitychange` foi implementado para ejetar o mouse automaticamente caso o jogador dê `Alt+Tab` ou a aba perca o foco, prevenindo travamentos indesejados no sistema operacional do usuário.
* **Motor de Probabilidade de Loucura**: Avalia a ansiedade atual do jogador e roda um dado algorítmico escalável para disparar assovios, passos fantasma ou tremedeiras físicas da câmera nas coordenadas X e Y.

---

## 4. UX Linear e Otimização Imperativa (`/src/components/ui`)

### Jornada Narrativa Contínua (`Menu.tsx`)

O projeto não possui um menu solto com abas clássicas. Ele aplica uma máquina de estados linear:
`START -> TUTORIAL -> PROSSEGUIR (Gatilho de Pointer Lock) -> INTRO (Noclip) -> JOGO -> RESUMO (Vitória/Morte) -> CRÉDITOS -> START.`

1. **A Falsa Cutscene (Geometria Líquida)**: A introdução escurece o cenário e exibe textos sobre a liquidez da geometria local, preparando o jogador para a geração procedural do complexo ("Cada entrada é única").
2. **Mix-Blend-Difference**: No clímax da introdução (11.5 segundos), a tela colapsa usando manipulação via CSS `mix-blend-difference` e `scale`, acompanhada do glitch analógico.

### `GameHUD.tsx` (Mundo Imperativo - Zero Re-render)

Para evitar que a atualização de ansiedade (60 fps) reconstrua o React DOM inteiro:

* **Bypass Reativo**: Utiliza `useGameStore.subscribe` para alterar as barras e filtros do HTML diretamente via Vanilla JS (`style.width`, `radial-gradient`), garantindo zero degradação de performance durante os momentos de maior carga 3D.

---

## 5. Fluxo de Dados Consolidado (Data Flow)

```text
Inputs do Teclado e Mouse
  │
  ▼
Game.tsx (useFrame Loop)
  │
  ├─► 1. Calcula Gasto/Regen de Estamina
  ├─► 2. Processa Colisão Deslizante e Atualiza Câmera
  ├─► 3. Aplica Tremedeira na Câmera se Ansiedade > 70%
  └─► 4. Checa Posição na Matriz do Complexo
         │
         ▼
madnessSystem (Gera Delta de Ansiedade baseado na luz/bloco atual)
  │
  ▼
Zustand Store (Atualiza Nível Global)
  │
  ├─► AudioSystem (Ajusta zumbido e RNG de gritos/assovios)
  │
  └─► GameHUD.tsx (Vanilla JS DOM Injection)

```
