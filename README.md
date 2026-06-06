# Bastidores: Um jogo de Terror

Uma experiência de terror psicológico baseada em Backrooms, desenvolvida em Next.js com Three.js para renderização 3D.

## 🚀 Como Rodar

```bash
# Clone o projeto
git clone [seu-link]

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

```

## 🛠️ Tech Stack

| Categoria | Tecnologia |
| --- | --- |
| **Framework** | Next.js 14 + React 18 |
| **3D Rendering** | Three.js + React Three Fiber 8 |
| **State** | Zustand 4 |
| **Audio** | Howler.js 2 |
| **Styling** | Tailwind CSS 3 |
| **Language** | TypeScript 5 |

> **Documentação Técnica:** Para entender o fluxo de dados e a organização dos sistemas, veja o nosso [guia de arquitetura](docs/ARCHITECTURE.md).

## ⚙️ Configurações (Config/Constants)

A maioria das alterações de balanceamento é feita em `src/config/constants.ts`.

```typescript
import { GAME, ASSETS } from '@/config/constants';

// Ajuste de gameplay
console.log(GAME.ANXIETY.MAX);

// Acesso a assets
const wallpaper = ASSETS.TEXTURES.WALLPAPER;

```

## 🎵 Sistema de Áudio

O jogo utiliza o `AudioSystem` com *lazy loading*. Para adicionar novos sons:

1. Coloque o arquivo MP3 em `public/assets/audio/...`
2. Adicione a constante no objeto `ASSETS.AUDIO` em `src/config/constants.ts`.
3. O sistema registrará automaticamente o arquivo.

## 📁 Estrutura do Projeto

```text
bastidores/
├── src/
│   ├── app/            # Next.js App Router
│   ├── components/     # UI e Game (3D/Canvas)
│   ├── hooks/          # Hooks customizados
│   ├── systems/        # Lógica (Audio, Madness, Objectives)
│   ├── config/         # Constantes centralizadas
│   └── utils/          # Helpers
├── docs/               # Documentação técnica
└── public/             # Assets estáticos

```

## 🐛 Troubleshooting

* **Áudio não toca:** Verifique se o caminho no `constants.ts` está sem o prefixo `/public/`.
* **Performance:** Verifique os limites de `LIGHT_INTENSITY` no arquivo de constantes.
* **Build Local:** Rode `npm run lint` para checar erros de TypeScript.

---

### Desenvolvido por Breno Santana
