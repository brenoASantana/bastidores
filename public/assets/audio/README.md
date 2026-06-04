## 🎵 Audio Assets - Trilhas Sonoras

Esta pasta contém os arquivos de áudio do jogo BACKROOMS.

### Estrutura Esperada

```
public/audio/
├── ambient-base.mp3          # Trilha ambiente base (loop)
├── tension-layer.mp3         # Trilha de tensão (loop)
└── sfx/
    ├── footsteps.mp3         # Passos distantes
    ├── whisper.mp3           # Sussurro
    └── buzz.mp3              # Zumbido fluorescente
```

### Como Adicionar Suas Trilhas

#### 1. **Formatos Suportados**
- `MP3` (recomendado - melhor compressão)
- `WAV` (qualidade lossless)
- `OGG` (alternativa livre)
- `OPUS` (melhor compressão)

Howler.js carregará o primeiro formato disponível da lista.

#### 2. **Requisitos de Cada Trilha**

**Trilhas Contínuas (Ambient):**
- Duração: 30-120 segundos (será feita loop)
- Formato: 44.1kHz ou 48kHz, estéreo
- Volume: normalizado a -3dB (pico máximo)
- Características:
  - `ambient-base`: Som industrial, ambiguidade assustadora
  - `tension-layer`: Drones crescentes, dissonância

**Efeitos Sonoros (SFX):**
- Duração: 0.5-5 segundos
- Formato: 44.1kHz ou 48kHz
- Características:
  - `footsteps.mp3`: Passos lentos e distantes (1-3s)
  - `whisper.mp3`: Voz sussurrada indistinta (2-4s)
  - `buzz.mp3`: Zumbido elétrico (3-5s)

#### 3. **Convertendo Áudio**

Se você tem arquivos em outros formatos, use FFmpeg:

```bash
# WAV → MP3
ffmpeg -i original.wav -b:a 192k output.mp3

# Normalizar volume
ffmpeg -i input.mp3 -af "loudnorm" output.mp3

# Reduzir tamanho (64kbps stream)
ffmpeg -i input.mp3 -b:a 64k output-small.mp3
```

#### 4. **Registrar Nova Trilha**

Edite `src/config/audioFiles.ts`:

```typescript
export const AUDIO_FILES = {
  ambient: {
    base: '/audio/ambient-base.mp3',
    tension: '/audio/tension-layer.mp3',
    custom: '/audio/custom-ambient.mp3', // ← Adicione aqui
  },
  sfx: {
    distantFootsteps: '/audio/footsteps.mp3',
    whisper: '/audio/whisper.mp3',
    buzzingLight: '/audio/buzz.mp3',
    newSfx: '/audio/new-effect.mp3', // ← Ou aqui
  },
}
```

Depois registre o uso no arquivo de constantes ou diretamente ao instanciar:

```typescript
// Em src/systems/audioSystem.ts
this.addSFX('new_event_id', AUDIO_FILES.sfx.newSfx)
```

#### 5. **Validar Carregamento**

Para debugar se os áudios foram carregados corretamente:

```typescript
import { validateAudioFiles } from '@/config/audioFiles'

// No seu componente ou useEffect
validateAudioFiles().then(success => {
  if(!success) console.log('❌ Some audio files are missing')
})
```

### 📊 Recomendações de Qualidade

| Arquivo           | Bitrate      | Duração | Tamanho Est. |
| ----------------- | ------------ | ------- | ------------ |
| ambient-base.mp3  | 128-192 kbps | 60s     | 0.96-1.4 MB  |
| tension-layer.mp3 | 128-192 kbps | 60s     | 0.96-1.4 MB  |
| footsteps.mp3     | 96-128 kbps  | 2s      | 24-32 KB     |
| whisper.mp3       | 96-128 kbps  | 3s      | 36-48 KB     |
| buzz.mp3          | 96-128 kbps  | 4s      | 48-64 KB     |

**Total estimado:** 2-3 MB (gzip: ~0.5-1 MB)

### 🔧 Ajustes em Código

Se precisar modificar volumes ou tempos de fade:

```typescript
// Em src/config/constants.ts
export const AUDIO_CONFIG = {
  MASTER_VOLUME: 0.8, // Volume geral (0-1)
  AMBIENT_BASE: 0.4,  // Volume base do ambiente
  TENSION_MIN: 0.1,   // Mínimo de tensão
  TENSION_MAX: 0.8,   // Máximo de tensão
  SFX_VOLUME: 0.6,    // Volume dos efeitos
}
```

### 🎮 Testando

1. Coloque os arquivos em `public/audio/`
2. Run `npm run dev`
3. Abra o DevTools (F12) → Console
4. Clique em "ENTRAR" no menu
5. Você deve ouvir a trilha ambiente logo abaixo

Se não escutar, verifique no Console:
```
✗ Failed to load ambient track: /audio/ambient-base.mp3
```

### 📚 Recursos Recomendados

**Onde encontrar áudio:**
- Freesound.org - Sons livres e royalty-free
- Zapsplat.com - Efeitos sonoros grátis
- BBC Sound Library - Audio royalty-free da BBC
- Artistas locais - Comissione trilhas originais

**Editing & Mixing:**
- Audacity (grátis, open-source)
- Reaper (trial gratuito 60 dias)
- Adobe Audition (por assinatura)

---

✅ Depois de adicionar seus arquivos, o jogo usará automaticamente!
