# Arquitetura do Bastidores Game

## Visão Geral

O projeto segue uma arquitetura modular, reativa e otimizada para o ecossistema WebGL no navegador. A renderização 3D é estritamente procedural, baseada em matrizes de dados numéricos, enquanto os sistemas físicos, lógicos e sonoros rodam de forma desacoplada da camada visual para garantir taxas de quadros constantes (60 FPS+).

```text
┌────────────────────────────────────────────────────────┐
│                 UI Layer (Components)                  │
│ Menu.tsx (Poetic Intro) | GameHUD.tsx | StaminaBar.tsx │
└───────────────────────────┬────────────────────────────┘
                            │ (Zustand Subscribe)
┌───────────────────────────▼────────────────────────────┐
│             3D Rendering Layer (R3F)                   │
│  LevelRenderer (InstancedMesh) | FluorescentLight      │
└───────────────────────────┬────────────────────────────┘
                            │ (useFrame Loop / Delta)
┌───────────────────────────▼────────────────────────────┐
│          Systems & Gameplay Logic (Heartbeat)          │
│       Game.tsx | PlayerController | AudioSystem        │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│          State Management & Configuration              │
│ Zustand Store (Selector Middleware) | Constants        │
└────────────────────────────────────────────────────────┘

```

---

## 1. Camada de Renderização 3D (`/src/components/game`)

### `LevelRenderer.tsx` (Procedural Instancing Engine)

O núcleo visual foi completamente otimizado para mitigar o gargalo de *draw calls* no navegador. O componente lê a matriz global e agrupa os blocos por tipo geométrico em um único ciclo de execução controlado por um `useMemo`.

* **Renderização por Instanciação (`<Instances>`)**: Em vez de renderizar componentes individuais para cada bloco, o motor agrupa paredes (`wallPositions`), vidros (`glassPositions`) e abismos (`holePositions`) em lotes de malhas instanciadas (`InstancedMesh`). Isso permite desenhar milhares de blocos em uma única instrução enviada à GPU.
* **Isolamento de Tipos de Materiais**:
* **Paredes**: Utilizam `meshLambertMaterial` para agilizar o cálculo de iluminação difusa.
* **Vidros**: Utilizam `meshPhysicalMaterial` com propriedades de transmissão e refração (`ior`) para simular transparência realista.
* **Buracos/Abismos**: Utilizam `meshBasicMaterial` puramente preto e plano deitado com rotação no eixo X. Ele ignora o sistema de iluminação do jogo, gerando o efeito visual de escuridão absoluta ("Vantablack").


* **Filtro de Blocos Invisíveis**: Blocos configurados com a propriedade `isInvisible: true` (como as zonas de pânico "Sem Saída") ou portais lógicos são ignorados pelo renderizador geométrico, existindo apenas na camada matemática de colisão e teleporte.

---

## 2. Ciclo de Gameplay e Sistemas (`/src/components/game` & `/src/config`)

### `Game.tsx` (The Game Heartbeat)

Centraliza o loop de simulação física e lógica através do hook `useFrame` do React Three Fiber, processando as seguintes etapas por quadro baseado no tempo real (`delta`):

* **Física de Movimento e Colisão Deslizante (Sliding AABB)**: Calcula o deslocamento do jogador de forma independente nos eixos X e Z. Caso haja uma colisão iminente detectada pelo raio do jogador contra um bloco não caminhável (`!walkable`), o sistema anula o movimento daquele eixo específico, permitindo que o jogador deslize suavemente pelas quinas das paredes.
* **Gerenciamento Dinâmico de Estamina**: Monitora o estado de corrida do jogador. Se as teclas de movimento e o *Shift* estiverem pressionados simultaneamente e houver estamina disponível, a velocidade de deslocamento aumenta e a estamina é depletada baseada na taxa `STAMINA_DEPLETION_RATE`. Caso contrário, o jogador é forçado a caminhar e o fôlego se recupera via `STAMINA_REGEN_RATE`.
* **Simulação Física de Gravidade (Queda no Abismo)**: Se o detector de posição ler que o jogador pisou em um bloco com a tag `isHole: true`, os inputs de teclado são completamente cortados, a velocidade dos passos é interrompida e a câmera inicia uma animação física de queda livre acelerada (subtração constante no eixo Y) combinada com uma rotação de tontura no eixo Z.
* **Motor de Probabilidade de Loucura (RNG Engine)**: Avalia a cada 4 segundos a taxa de ansiedade atual do jogador. Acima de 20% de ansiedade, o sistema roda um dado algorítmico escalável: quanto mais perto de 100%, maior a probabilidade de disparar sons assustadores aleatórios. Entre 20% e 60% são priorizados assovios e sussurros (`entity_whisper`); acima de 60%, há 50% de chance de ecoar um grito aterrorizante da criatura (`entity_scream`).
* **Consequência Física de Pânico**: Se a ansiedade ultrapassar o patamar crítico de 70%, o loop injeta um deslocamento caótico e oscilatório nas coordenadas X e Y da câmera, simulando uma tremedeira física de pavor proporcional à intensidade do pânico.

### `AudioSystem.ts` (Service Locator de Áudio Modular)

Gerencia o carregamento de áudio baseado em `Howler.js`, blindado contra vazamento de memória e gargalos de carregamento em ambientes de produção (Next.js SSR).

* **Carregamento em Estágios (Lazy Loading)**: Dividido em fases para poupar a memória do navegador. O método `initializeEssential` carrega apenas a trilha do menu e o glitch de transição. O método `initializeGameplay` faz o download sob demanda dos passos, efeitos de ambiente e eventos de terror no momento do início da partida.
* **Singleton à Prova de Hot-Reload**: Utiliza o escopo `globalThis` do Node/Navegador para persistir a mesma instância de áudio entre alterações de código, evitando a multiplicação indesejada de contextos de áudio.
* **Controle de Concorrência (Anti-Flood)**: Implementa uma tabela de memória (`lastPlayTimes`) que barra a reprodução do mesmo efeito sonoro caso o intervalo entre os disparos seja menor que 100ms, impedindo distorções ou estouros de áudio acumulados.

---

## 3. Interface do Usuário e Otimização Imperativa (`/src/components/ui`)

O desenvolvimento da interface de usuário adota uma separação estrita de escopos: **O mundo 3D roda isolado dentro do `<Canvas>`, e os elementos 2D (HUD, barras, menus) flutuam por cima em HTML convencional.**

### `GameHUD.tsx` (Mundo Imperativo - Zero Re-render)

Para evitar que a atualização constante da ansiedade (que muda a cada quadro) force o React a reconstruir a árvore de componentes da tela inteira 60 vezes por segundo, o HUD foi projetado utilizando o **padrão imperativo**.

* **Assinatura Seletiva via Zustand**: Através do método `useGameStore.subscribe`, o HUD escuta silenciosamente apenas a variável numérica de ansiedade, contornando o ciclo tradicional de re-render do React.
* **Manipulação Direta do DOM**: Ao capturar a mudança de valor, o sistema altera diretamente o estilo das referências HTML (`useRef`) via Vanilla JavaScript (`style.width`, `innerText`).
* **Filtros Visuais de Consequência Crítica**: Conforme o nível de ansiedade passa dos 70%, o HUD manipula o elemento de distorção de tela de forma imperativa:
1. Altera o fundo de um túnel escuro padrão para um gradiente radial vermelho-sangue (`radial-gradient`).
2. Aumenta a opacidade da vinheta proporcionalmente ao desespero do jogador.
3. Acelera progressivamente a velocidade da animação CSS de pulso (`pulse`) do filtro CRT, tornando o ambiente visualmente sufocante e frenético.



---

## 4. Fluxo Narrativo e Transições Liminares

O início do jogo utiliza uma técnica de **Fumaça e Espelhos** para criar uma narrativa imersiva sem desperdiçar processamento renderizando cenários externos complexos.

### A Falsa Cutscene Poética (`Menu.tsx`)

1. **A Estática Visual**: O menu inicial renderiza uma fotografia estática estilizada em alta definição (`next/image` configurada com `fill` e `priority` para carregamento imediato) que simula o mundo real/beco industrial.
2. **A Linha do Tempo Poética**: Ao clicar em iniciar, o menu desaparece e um encadeamento de cronômetros (`setTimeout`) gerencia uma linha do tempo. A imagem sofre um desfoque suave (`blur-sm`) e escurece, enquanto versos de poemas dramáticos e impactantes emergem de forma cadenciada na tela em estilo manuscrito/diário.
3. **O Colapso e Transição**: No clímax do último verso (11.5 segundos), a tela sofre um efeito de inversão e clarão branco através da classe `mix-blend-difference`, enquanto o `AudioSystem` dispara o som de distorção analógica (`events.glitch`).
4. **O Despertar**: Meio segundo depois, o mapa 3D das Backrooms é montado em segundo plano e a câmera do jogador é teleportada instantaneamente para a coordenada tridimensional calculada pela função de varredura de Spawn (`getSpawnPosition`), fazendo o jogador "acordar" no labirinto com a respiração ofegante, garantindo uma transição sem emendas.

---

## 5. Fluxo de Dados Atualizado (Data Flow)

```text
Inputs do Teclado (W,A,S,D + Shift)
  │
  ▼
Game.tsx (useFrame Loop)
  │
  ├─► 1. Calcula Gasto/Regen de Estamina ──► Salva player.stamina na Store
  ├─► 2. Processa Colisão Deslizante e Atualiza Posição da Câmera
  ├─► 3. Se pisar no ID do Buraco ──► Inicia Queda Física (Y) ──► Trava Morte ──► Estado 'failed'
  └─► 4. Se pisar no Chão ──► Calcula Multiplicador de Bloco (Ex: Bloco Sem Saída = 6x Ansiedade)
  │
  ▼
madnessSystem (Gera Delta de Ansiedade)
  │
  ▼
Zustand Store (Atualiza Nível de Ansiedade Global)
  │
  ├─► AudioSystem (Ajusta volume do zumbido da lâmpada e roda RNG de gritos/assovios)
  │
  └─► GameHUD.tsx (Zustand .subscribe Escuta Silenciosa)
        │
        ▼ (Vanilla JS / DOM Bypass React)
        ├─► Atualiza tamanho e cor da barra de pânico
        └─► Altera vinheta de tela para gradiente Vermelho Sangue e acelera pulso CRT

```
