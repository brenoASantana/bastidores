## 🎵 Resumo das Alterações - Sistema de Áudio

Data: 1 de abril de 2026
Mudanças: Refatoração completa do sistema de áudio para suportar trilhas sonoras personalizadas

---

## ✅ O que foi alterado

### 1. Estrutura de Pastas
```
+ public/audio/                    # Nova pasta para arquivos de áudio
  ├── README.md                    # Documentação técnica
  ├── PLACEHOLDER.md               # Guia rápido
  └── (seus arquivos MP3 aqui)
```

### 2. Arquivos Criados
- **src/config/audioFiles.ts** - Mapeamento centrado de todos os arquivos de áudio
- **src/components/AudioDebugger.tsx** - Componente para debug de carregamento de áudio
- **AUDIO_SETUP.md** - Guia completo e detalhado com passo a passo
- **public/audio/README.md** - Técnico e referência
- **public/audio/PLACEHOLDER.md** - Guia visual rápido

### 3. Arquivos Modificados
- **src/systems/audioSystem.ts**
  - Adicionado import: `AUDIO_FILES` de `audioFiles.ts`
  - Adicionado import: `SILENT_AUDIO_FALLBACK`
  - Método `initializeTracks()`: Agora carrega URLs reais de `/audio/`
  - Método `addSFX()`: Usa parâmetro `soundUrl` em vez de `soundKey`
  - Adicionado suporte `html5: true` para streaming de arquivos grandes
  - Adicionado error handlers com `onloaderror` callbacks

- **README.md**
  - Nova seção "🎵 Adicionar Trilhas Sonoras"
  - Instruções rápidas (3 passos)
  - Referência para `AUDIO_SETUP.md`
  - Exemplo de uso de `AudioDebugger`

---

## 🚀 Como Usar Agora

### Opção 1: Rápido (3 minutos)

```bash
# 1. Coloque seus arquivos em public/audio/
cp seus-audios/* public/audio/

# 2. Nomeie exatamente como:
# - ambient-base.mp3
# - tension-layer.mp3
# - footsteps.mp3
# - whisper.mp3
# - buzz.mp3

# 3. Iniciar jogo
npm run dev

# 4. Você ouve áudio automaticamente!
```

### Opção 2: Completo (com guia)

Leia **AUDIO_SETUP.md** para:
- Onde encontrar áudios de qualidade
- Como converter entre formatos (FFmpeg)
- Como ajustar volumes
- Como adicionar novos sons
- Troubleshooting se algo não funcionar

---

## 📊 Arquitetura do Sistema

```
┌─────────────────────────────┐
│   Seu Arquivo Áudio (MP3)   │
│   public/audio/ambient-.mp3 │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  audioFiles.ts (Mapeamento)     │
│  AUDIO_FILES.ambient.base       │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  AudioSystem (src/systems/)         │
│  - Carrega com Howler.js            │
│  - Aplica volume/mixer              │
│  - Dispara eventos de som           │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  GameContainer (inicializa)         │
│  PlayerController (controla)        │
│  Resultado: 🎵 Som no jogo!         │
└─────────────────────────────────────┘
```

---

## 🔧 Configurações Importantes

Editar conforme necessário:

### Volumes (src/config/constants.ts)
```typescript
MASTER_VOLUME: 0.8,      // Geral
AMBIENT_BASE: 0.4,       // Som de fundo
TENSION_MIN: 0.1,        // Mínimo de tensão
TENSION_MAX: 0.8,        // Máximo de tensão
SFX_VOLUME: 0.6,         // Efeitos sonoros
```

### Arquivos (src/config/audioFiles.ts)
```typescript
export const AUDIO_FILES = {
  ambient: {
    base: '/audio/ambient-base.mp3',      // ← Coloque seu arquivo
    tension: '/audio/tension-layer.mp3',  // ← ou aqui
  },
  sfx: {
    distantFootsteps: '/audio/footsteps.mp3',  // ← ou aqui
    // ... etc
  },
}
```

---

## 🧪 Testar Carregamento

### Método 1: AudioDebugger (Visual)
```typescript
// Em src/app/page.tsx
import { AudioDebugger } from '@/components/AudioDebugger'

export default function Home() {
  return (
    <>
      {/* seu código */}
      <AudioDebugger /> {/* Mostra no canto inferior direito */}
    </>
  )
}
```

### Método 2: Console (Programático)
```typescript
import { validateAudioFiles } from '@/config/audioFiles'

useEffect(() => {
  validateAudioFiles().then(ok => {
    console.log(ok ? '✅ Áudio OK' : '❌ Áudio faltando')
  })
}, [])
```

---

## 📝 Próximas Etapas

1. **Obter Áudios** (2-4 horas)
   - Procurar em Freesound, Zapsplat, BBC Sound Library
   - Ou comissionar a um artista

2. **Converter para MP3** (30 min)
   ```bash
   ffmpeg -i seu-audio.wav -b:a 192k output.mp3
   ```

3. **Colocar em public/audio/** (5 min)
   - 5 arquivos, nomes exatos

4. **Testar** (10 min)
   - `npm run dev`
   - Clique em "ENTRAR"
   - Você ouve áudio? ✅

5. **Ajustar Volumes** (1-2 horas iterativo)
   - Modifique constants.ts
   - Reinicie dev server
   - Escuta de novo até ficar perfeito

---

## 🎮 Status do Jogo

✅ **Servidor**: Rodando em http://localhost:3002 (portas 3000-3001 em uso)
✅ **Compilação**: Sem erros TypeScript
✅ **Áudio**: Sistema preparado, aguardando seus arquivos
⏳ **Trilhas**: Prontas para serem colocadas

---

## 📚 Referências

- **AUDIO_SETUP.md** - Guia detalhado e passo a passo
- **public/audio/README.md** - Technical reference
- **public/audio/PLACEHOLDER.md** - Quick visual guide
- **src/config/audioFiles.ts** - Code documentation
- **src/systems/audioSystem.ts** - Implementation details

---

**Próximo passo:** Leia [AUDIO_SETUP.md](AUDIO_SETUP.md) para começar! 🎵👻
