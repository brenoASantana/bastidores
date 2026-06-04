# 🎵 Audio Setup Guide

Este guia explica como adicionar trilhas sonoras e efeitos personalizados ao jogo bastidores.

## 📋 Sumário Rápido

1. **Prepare seus arquivos de áudio** (MP3, WAV, OGG)
2. **Coloque em `public/audio/`**
3. **Registre em `src/config/audioFiles.ts`**
4. **Pronto!** O jogo usará automaticamente

## 🎬 Passo a Passo

### Passo 1: Obter Arquivos de Áudio

Você precisa de **5 arquivos de áudio**:

| Arquivo             | Tipo | Duração | Descrição                                        |
| ------------------- | ---- | ------- | ------------------------------------------------ |
| `ambient-base.mp3`  | Loop | 30-120s | Som ambiental base (industrial, assustador)      |
| `tension-layer.mp3` | Loop | 30-120s | Trilha que cresce com medo (drones, dissonância) |
| `footsteps.mp3`     | SFX  | 1-3s    | Passos distantes                                 |
| `whisper.mp3`       | SFX  | 2-4s    | Sussurro incompreensível                         |
| `buzz.mp3`          | SFX  | 3-5s    | Zumbido de luz fluorescente                      |

**Onde encontrar:**
- **Freesound.org** - Áudios criativos commons
- **Zapsplat.com** - Efeitos sonoros grátis
- **BBC Sound Library** - Acervo público
- **YouTube Audio Library** - Som criativo royalty-free

### Passo 2: Converter para MP3 (se necessário)

Se seus arquivos estão em formato diferente, use **FFmpeg**:

```bash
# Instalar FFmpeg (macOS)
brew install ffmpeg

# Converter WAV → MP3
ffmpeg -i seu-arquivo.wav -b:a 192k ambient-base.mp3

# Normalizar volume (recomendado)
ffmpeg -i seu-arquivo.mp3 -af "loudnorm" ambient-base-normalized.mp3

# Cortar duração (reduzir para 60 segundos)
ffmpeg -i seu-arquivo.mp3 -t 60 ambient-base-60s.mp3

# Reduzir bitrate (economizar banda)
ffmpeg -i seu-arquivo.mp3 -b:a 128k ambient-base-128.mp3
```

### Passo 3: Colocar Arquivos na Pasta Correta

```bash
# Navegue até a pasta do projeto
cd /Users/breno.santana/Coding/Pessoal/bastidores

# Copie seus arquivos para public/audio/
cp ~/Downloads/ambient-base.mp3 public/audio/
cp ~/Downloads/tension-layer.mp3 public/audio/
cp ~/Downloads/footsteps.mp3 public/audio/
cp ~/Downloads/whisper.mp3 public/audio/
cp ~/Downloads/buzz.mp3 public/audio/
```

**Resultado esperado:**
```
public/audio/
├── README.md
├── PLACEHOLDER.md
├── ambient-base.mp3 ✓
├── tension-layer.mp3 ✓
├── footsteps.mp3 ✓
├── whisper.mp3 ✓
└── buzz.mp3 ✓
```

### Passo 4: Verificar Registro em audioFiles.ts

Abra `src/config/audioFiles.ts` e verifique se os caminhos estão corretos:

```typescript
export const AUDIO_FILES = {
  ambient: {
    base: '/audio/ambient-base.mp3',      // Certifique-se que existe
    tension: '/audio/tension-layer.mp3',  // Certifique-se que existe
  },
  sfx: {
    distantFootsteps: '/audio/footsteps.mp3',  // Certifique-se que existe
    whisper: '/audio/whisper.mp3',             // Certifique-se que existe
    buzzingLight: '/audio/buzz.mp3',           // Certifique-se que existe
  },
}
```

### Passo 5: Testar

No terminal:

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:3000
# Clique em "ENTRAR"
# Você deve ouvir a trilha ambiente
```

**Se não escutar:**
1. Verifique DevTools (F12) → Console
2. Procure por erro: `Failed to load audio track`
3. Confirme que os arquivos existem em `public/audio/`
4. Verifique se o volume do navegador está ligado

## 🎛 Ajustar Volumes

Edite `src/config/constants.ts`:

```typescript
export const AUDIO_CONFIG = {
  MASTER_VOLUME: 0.8,      // Volume geral (0 = mudo, 1 = máximo)
  AMBIENT_BASE: 0.4,       // Volume da trilha ambiente
  TENSION_MIN: 0.1,        // Volume mínimo da tensão (quando calmo)
  TENSION_MAX: 0.8,        // Volume máximo da tensão (quando com medo)
  SFX_VOLUME: 0.6,         // Volume dos efeitos (passos, sussurros)
}
```

**Exemplo de ajuste:**
```typescript
// Jogo mais silencioso
MASTER_VOLUME: 0.5,
AMBIENT_BASE: 0.2,

// Jogo mais assustador
TENSION_MAX: 0.95,
SFX_VOLUME: 0.8,
```

## 🔌 Adicionar Novas Trilhas (Avançado)

Se quiser mais de 5 áudios:

### 1. Adicione em audioFiles.ts:

```typescript
export const AUDIO_FILES = {
  ambient: {
    base: '/audio/ambient-base.mp3',
    tension: '/audio/tension-layer.mp3',
    variant2: '/audio/ambient-variant.mp3', // ← Nova trilha
  },
}
```

### 2. Use no AudioSystem:

```typescript
// Em src/systems/audioSystem.ts, método initializeTracks()
const ambientVariant = new HowlerClass({
  src: [AUDIO_FILES.ambient.variant2],
  loop: true,
  html5: true,
})

// Depois use: ambientVariant.play(), ambientVariant.stop(), etc
```

## 📊 Formatos Recomendados

### Trilhas Contínuas
- **Formato**: MP3 128-192 kbps
- **Taxa de amostragem**: 44.1 kHz ou 48 kHz
- **Canais**: Estéreo
- **Duração**: 30-120 segundos (será feita loop)
- **Tamanho**: ~1 MB para 60s estimado

### Efeitos Sonoros
- **Formato**: MP3 96-128 kbps ou WAV
- **Taxa de amostragem**: 44.1 kHz
- **Canais**: Mono ou Estéreo
- **Duração**: 1-5 segundos
- **Tamanho**: 12-64 KB cada

**Total estimado do jogo com áudio**: 2-3 MB

## ❓ Troubleshooting

### "Failed to load audio"
- [ ] Arquivo existe em `public/audio/`?
- [ ] Nome exato corresponde em `audioFiles.ts`?
- [ ] Arquivo não está corrompido?
- [ ] Servidor está rodando (`npm run dev`)?

### "Áudio carrega mas não toca"
- [ ] Volume do navegador está 100%?
- [ ] MASTER_VOLUME em constants.ts > 0?
- [ ] Autoplay está bloqueado pelo navegador?
  → Clique em qualquer lugar da página para desbloquear

### "Áudio distorcido ou muito pesado"
```bash
# Reduza bitrate de 192 para 128 kbps
ffmpeg -i original.mp3 -b:a 128k output.mp3

# Ou normalize volume
ffmpeg -i original.mp3 -af "loudnorm" output.mp3
```

## ✅ Checklist Final

- [ ] 5 arquivos de áudio obtidos
- [ ] Arquivos convertidos para MP3 (se necessário)
- [ ] Arquivos copiados para `public/audio/`
- [ ] Nomes correspondem exatamente a `audioFiles.ts`
- [ ] Servidor rodando (`npm run dev`)
- [ ] Jogo toca som ao entrar
- [ ] Console não mostra erros de "Failed to load"
