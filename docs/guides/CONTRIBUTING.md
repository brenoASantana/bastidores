# Contributing to bastidores

Obrigado por considerar contribuir para o projeto bastidores! Aqui estão as diretrizes para manter o projeto saudável e organizado.

## Como Contribuir

### Reportar Bugs

Abra uma issue com:

```
Título: [Bug] Descrição curta

## Comportamento Esperado
O jogo deveria...

## Comportamento Atual
O jogo faz...

## Para Reproduzir
1. Faça X
2. Faça Y
3. Veja Z

## Ambiente
- Browser: Chrome 120
- Sistema: Windows 11
- Deploy: localhost / Vercel
```

### Sugerir Features

```
Título: [Feature] Título da sugestão

## Descrição
Explique a feature detalhadamente.

## Caso de Uso
Por que isso seria útil?

## Implementação Sugerida (opcional)
Como você poderia implementar?
```

### Pull Requests

1. **Fork** the repository
2. **Create branch**: `git checkout -b feat/feature-name`
3. **Make changes** mantendo as conventions
4. **Commit**: Use conventional commits
5. **Push**: `git push origin feat/feature-name`
6. **Open PR** com descrição clara

#### Checklist para PR

- [ ] Código segue as conventions do projeto
- [ ] Testei a feature implementada
- [ ] Não quebrei nenhuma feature existente
- [ ] Atualizei a documentação relevante
- [ ] Mensagem de commit é clara
- [ ] Sem console.log() ou debug code
- [ ] TypeScript está sem erros

## Código

### Style Guide

**TypeScript/React:**
```typescript
// Use tipos explícitos
const calculateAnxiety = (delta: number, isSafe: boolean): number => {
  return isSafe ? -0.15 * delta : 0.5 * delta
}

// Use nomes descritivos
const updatePlayerAnxietyLevel = () => {}  // ✅
const updateAnx = () => {}                // ❌

// Use const por padrão
const MAX_ANXIETY = 100  // ✅
let anxiety = 0          // ✅ quando necessário

// Use arrow functions
const handleClick = () => {}  // ✅
function handleClick() {}     // ❌ em componentes
```

**React Components:**
```typescript
// Use 'use client' em client components
'use client'

import { FC } from 'react'

interface Props {
  anxiety: number
  onZoneChange: (isOpen: boolean) => void
}

const GameHUD: FC<Props> = ({ anxiety, onZoneChange }) => {
  return (
    <div>
      {/* conteúdo */}
    </div>
  )
}

export default GameHUD
```

### Conventions

- **Nomes de arquivo**: PascalCase para componentes (`GameHUD.tsx`), camelCase para utilities (`gameStore.ts`)
- **Imports**: Organize como: React → Libraries → @/ imports → Local imports
- **Exports**: Use `export default` para componentes, `export const` para utilities
- **Types**: Defina em `src/types/game.ts`, reutilize em todo o projeto

### Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add new horror event type
fix: Resolve audio not loading on Vercel
docs: Update DEVELOPMENT.md with new API
refactor: Simplify anxiety calculation logic
chore: Update dependencies
```

## Roadmap & Prioridades

### V2 Roadmap

- [ ] **Multiplayer**: Coop/PvP com outro jogador
- [ ] **Procedural Maps**: Geração dinâmica de corredores
- [ ] **Advanced Audio**: Voice chat e audio 3D posicional
- [ ] **Leaderboard**: Ranking global de tempos
- [ ] **Save System**: Persistência de progresso
- [ ] **Mobile Optimization**: Performance em mobile

### Prioridades Atuais

1. 🔴 **Critical**: Bugs de gameplay, crashes
2. 🟠 **High**: Novos eventos, balanceamento
3. 🟡 **Medium**: UI improvements, audio ajustes
4. 🟢 **Low**: Otimizações, refactoring

## Performance Guidelines

- Manter FPS > 60 em desktop
- Manter < 5s de load time em Vercel
- Audio bundle < 500KB

## Documentação

- Atualize `docs/` quando adicionar features
- Mantenha `CHANGELOG.md` sincronizado
- Adicione comentários em código complexo (3+ linhas)

## Code Review

- Mínimo 1 review aprovado antes de merge
- CI (TypeScript lint) deve passar
- Sem breaking changes sem discussão prévia

Obrigado por contribuir! 🎉
