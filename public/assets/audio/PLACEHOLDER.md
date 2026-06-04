# Audio Files - Placeholder Guide

Este arquivo documenta onde cada trilha deve ser colocada.

## 📁 Estrutura Esperada

Depois de adicionar seus áudios, a pasta ficará assim:

```
public/audio/
├── README.md                  # Esta documentação
├── ambient-base.mp3          # ← Coloque aqui (trilha ambiente base)
├── tension-layer.mp3         # ← Coloque aqui (trilha de tensão/medo)
├── footsteps.mp3             # ← Coloque aqui (passos distantes)
├── whisper.mp3               # ← Coloque aqui (sussurro)
└── buzz.mp3                  # ← Coloque aqui (zumbido fluorescente)
```

## ✏️ Recomendações para Cada Trilha

### ambient-base.mp3
**Descrição:** Trilha contínua que toca ao fundo durante o jogo
- **Duração:** 30-120 segundos (será repetida em loop)
- **Tom:** Industrial, assustador, vazio
- **Exemplos de sons:** Máquinas ssurrando, ventiladores, silêncio perturbador
- **Faixa de frequência:** Grave/médio (20-8000 Hz)

### tension-layer.mp3
**Descrição:** Trilha que cresce com a ansiedade do jogador
- **Duração:** 30-120 segundos (será repetida em loop)
- **Tom:** Tenso, crescente, dissonante
- **Exemplos de sons:** Drones distorcidos, batidas sincopadas, ruído modulado
- **Faixa de frequência:** Toda (20-20000 Hz)

### footsteps.mp3
**Descrição:** Passos distantes e lentos
- **Duração:** 1-3 segundos
- **Tom:** Metálico ou madeira, distante
- **Tempo:** Um passo a cada 0.5-1 segundo

### whisper.mp3
**Descrição:** Sussurro incompreensível e assustador
- **Duração:** 2-4 segundos
- **Tom:** Voz humana distorcida, ininteligível
- **Características:** Deve soar inquietante, não comforting

### buzz.mp3
**Descrição:** Zumbido de fluorescente ou eletrônico
- **Duração:** 3-5 segundos
- **Tom:** Frequência constante (50-60 Hz típico)
- **Características:** Pode ter pulsos ou variações de volume

## 🎯 Como Proceder

1. **Procure ou crie áudios** que correspondam à descrição acima
2. **Converta para MP3** se necessário (FFmpeg ou Audacity)
3. **Coloque os arquivos** nesta pasta (`public/audio/`)
4. **Test no navegador** - abra o jogo e verifique se os áudios tocam

O arquivo está vinculado em `src/config/audioFiles.ts` - se colocar os arquivos aqui, o jogo usará automaticamente!

---

**Dúvida?** Veja [../../../AUDIO_SETUP.md](../../../AUDIO_SETUP.md) para mais detalhes.
