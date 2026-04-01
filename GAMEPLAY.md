# Gameplay Guide - BACKROOMS

## Objetivo do Jogo

Você acordou em um lugar que não deveria existir: os Backrooms. Um labirinto infinito de corredores vazios, iluminação fluorescente instável e um silêncio que ressoa. Seu único objetivo é sobreviver à sua própria mente.

**Missão**: Colete 3 objetivos e encontre a saída antes que o colapso mental a devore.

## Mecânicas de Jogo

### 1. Sistema de Ansiedade (Core Mechanic)

A **ansiedade** é a mecânica central do jogo. Ela representa sua saúde mental e determina o sucesso ou falha.

#### Como funciona:

**Níveis de Ansiedade:**
- **0-30%**: Calmo. Ambiente claro, áudio ambiente relaxante.
- **30-60%**: Tenso. Trilha de tensão começa a aparecer, efeitos visuais sutis.
- **60-90%**: Crítico. Visão distorcida, áudio intenso, possibilidade de eventos assustadores.
- **90-100%**: Colapso. 5 segundos a 100% = derrota por colapso mental.

#### O que aumenta ansiedade:

- **Estar em áreas abertas/vazias**: +0.75/s
- **Longe de referências visuais**: +0.5/s
- **Correr/sprint prolongado**: Mantém ansiedade alta

#### O que diminui ansiedade:

- **Estar em zona segura** (próximo da origem): -0.15/s
- **Permanecer parado**: Recuperação gradual

### 2. Agorafobia - A Mecânica de Terror Psicológico

Os Backrooms exploram agorafobia: o medo de espaços abertos e vazios.

```
Distância do Centro:
├─ <5 metros:   ZONA SEGURA (quarto inicial)
├─ 5-15 metros: ZONA NORMAL (corredores)
└─ >15 metros:  ZONA ABERTA (muito perigoso)
```

**Efeitos visuais por ansiedade:**

- **Vinheta preta**: Aumenta conforme ansiedade sobe
- **Granulado**: Distorção visual, como TV quebrada
- **Blur**: Visão fica turva em ansiedade alta
- **Aberração cromática**: Cores desalinhadas (colapso próximo)
- **Zoom leve**: Player "encolhe" de nervoso

### 3. Objetivos - Coleta Estratégica

Você precisa coletar **3 objetivos** para poder escapar.

**Onde estão:**
- Posição 1: [8, 1.5, 5] - Ramificação leste
- Posição 2: [-10, 1.5, -15] - Ramificação oeste
- Posição 3: [15, 1.5, 10] - Fundo da ramificação leste

**Coleta:**
- Aproxime-se a menos de 1.5m de distância
- Automaticamente coletado (não há input necessário)
- HUD mostrará caixas numeradas preenchidas em amarelo

**Estratégia:**
- Coleta 1: Rápida (próxima, baixa ansiedade)
- Coleta 2: Mais afastada (risco de ansiedade média)
- Coleta 3: Muito afastada (zona aberta, risco alto)

### 4. Saída - Vitória

Após coletar os 3 objetivos, dirija-se para a **saída** (fundo do corredor principal, Z > 10).

**Condições para vitória:**
- [ ] 3/3 objetivos coletados
- [ ] Posição Z > 10 (frente do mapa)
- [ ] Ansiedade não crítica during walk

**Tela de Vitória:**
- "VOCÊ ESCAPOU"
- Tempo total de sessão
- Ansiedade final

## Eventos Psicológicos

Durante o jogo, eventos assustadores ocorrem aleatoriamente conforme sua ansiedade sobe:

### 1. Passos Distantes
- **Probabilidade**: Aumenta com ansiedade
- **Cooldown**: 20 segundos entre ocorrências
- **Efeito**: Som de passos ecoando nos corredores
- **Significado**: Você está sozinho... ou está?

### 2. Sussurro
- **Probabilidade**: Aumenta com ansiedade > 50%
- **Áudio**: Som ininteligível e perturbador
- **Efeito psicológico**: Sensação de presença

### 3. Buzz de Fluorescente
- **Probabilidade**: Aleatória, independente de ansiedade
- **Áudio**: Buzz elétrico intermitente
- **Realismo**: Comum em salas abandonnées

## Controles

| Ação           | Input                    |
| -------------- | ------------------------ |
| Mover frente   | W / ↑                    |
| Mover trás     | S / ↓                    |
| Mover esquerda | A / ←                    |
| Mover direita  | D / →                    |
| Sprint         | Shift + WASD             |
| Olhar ao redor | Mover mouse              |
| Travar câmera  | Click mouse (automático) |

**Dica**: Clique na janela de jogo para ativar pointer lock (câmera presa ao mouse).

## Estratégia de Vitória

### Rota Recomendada:

```
Início (0,0)
├─ Objetivo 1 [8, 1.5, 5] (LESTE) - Ansiedade: 15-30%
├─ Voltar ao corredor principal
├─ Objetivo 2 [-10, 1.5, -15] (OESTE) - Ansiedade: 40-60%
├─ Voltar ao corredor principal RÁPIDO
├─ Objetivo 3 [15, 1.5, 10] (LESTE) - Ansiedade: 70-85%
└─ Correr para a SAÍDA (Z > 10) - Ansiedade: 90%+ (perigoso!)
```

### Dicas de Gameplay:

1. **Não corra sem parar**: Sprint aumenta ansiedade. Use em curtos bursts.
2. **Volte frequentemente ao início**: A zona segura reduz ansiedade rapidamente.
3. **Escute o áudio**: Trilha de tensão te dá feedback real-time de perigo.
4. **Observe o HUD**: Vinheta preta = você está em risco.
5. **Planejamento**: Colete objetivos em ordem de distância para gerenciar ansiedade.

## Derrota

### Colapso Mental

Se sua **ansiedade atingir 95+** por **5 segundos contínuos**, você sofre um colapso mental:

**Tela de Derrota:**
- "COLAPSO MENTAL"
- "Sua mente não resistiu ao vazio"
- Objetivos coletados (0-3)
- Opção para "TENTAR NOVAMENTE"

### Como evitar:

- Passe tempo em zonas seguras
- Reduza a corrida
- Domine o mapa e saiba o caminho
- Gerencie a progressão dos objetivos

## Estatísticas Finais

Após vitória ou derrota, você verá:

```
Tempo de Sessão: X segundos
Ansiedade Final: Y/100
Objetivos: Z/3
```

Tente melhorar seu tempo e seus objetivos!

## Atmosfera & Direção de Design

### Por quê esse design funciona:

1. **Simplicidade Visual**: Corredores vazios e iguais = desorientação
2. **Áudio Dinâmico**: Trilha cresce com você, não te deixa relaxar
3. **Espaço Aberto**: Agorafobia real - quanto mais longe, mais perigoso
4. **Objetivos Estratégicos**: Te forçam a explorar e enfrentar o medo
5. **Sem Inimigos**: O terror é **psicológico**, não físico

### Temas Explorados:

- **Isolamento**: Você está completamente sozinho
- **Desorientação**: O mapa repete, você nunca está seguro
- **Ansiedade**: Um inimigo invisível que cresce dentro de você
- **Colapso Mental**: Seu próprio medo é o boss final

## Replayability

- Cada sessão é única em tempo
- Consegue vencer em menos de 8 minutos?
- Consegue manter ansiedade <50%?
- Objetivos sempre nas mesmas posições (no MVP)

**V2 Future**: Mapa procedural, eventos aleatórios, multiplayer para mais paranoia.

---

**LEMBRETE**: Isso é ficção. Os Backrooms são um meme creepy. Durma bem depois! 😴
