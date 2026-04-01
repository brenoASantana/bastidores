# ✅ Checklist de Produção - BACKROOMS Horror

Use este checklist antes de fazer deploy na Vercel.

---

## 🔍 Pré-Deploy Local

### Código e Compilação
- [ ] TypeScript compila sem erros: `npm run lint`
- [ ] Build local funciona: `npm run build`
- [ ] Aplicação roda localmente: `npm start`
- [ ] Nenhum console.error ou warning crítico
- [ ] `eslint` passa sem falhas críticas

### Assets e Mídia
- [ ] Arquivos de áudio existem em `public/audio/`:
  - [ ] `ambient-base.mp3`
  - [ ] `tension-layer.mp3`
  - [ ] `footsteps.mp3`
  - [ ] `whisper.mp3`
  - [ ] `buzz.mp3`
- [ ] Arquivos não superiores a 5MB cada
- [ ] Formatos suportados (MP3, WAV, OGG)

### Git Repository
- [ ] Repositório inicializado: `git status` sem erros
- [ ] Todos arquivos adicionados: `git add .`
- [ ] Commit inicial feito: `git log` mostra commits
- [ ] Repositório remoto configurado: `git remote -v`
- [ ] Branch principal é `main` (não `master`)

### Documentação
- [ ] README.md está atualizado
- [ ] Nenhum TODO pendente nos files principais
- [ ] Comments e docstrings estão claros
- [ ] Instruções de setup funcionam

---

## 🌐 Configuração Vercel

### Arquivos Obrigatórios
- [ ] ✅ `vercel.json` - Configuração do Vercel
- [ ] ✅ `.vercelignore` - Arquivos ignorados em deploy
- [ ] ✅ `next.config.mjs` - Configuração Next.js otimizada
- [ ] ✅ `package.json` - Scripts corretos
- [ ] ✅ `.env.example` - Template de variáveis

### Configurações next.config.mjs
- [ ] ✅ `output: 'standalone'` configurado
- [ ] ✅ Howler.js em externals
- [ ] ✅ Compressão ativada
- [ ] ✅ Headers de segurança configurados

### Environment Variables
- [ ] `.env.local` criado (local dev)
- [ ] `.env.example` preenchido (template)
- [ ] Nenhuma secret no código hardcoded
- [ ] NEXT_PUBLIC_* prefixadas variáveis públicas

---

## 🧪 Teste Funcional Completo

### Gameplay
- [ ] Menu inicial ("BACKROOMS") exibe corretamente
- [ ] Clique em "ENTRAR" inicia o jogo
- [ ] WASD move o jogador
- [ ] Mouse look funciona
- [ ] Shift para sprint funciona
- [ ] Pointer lock ativa ao clicar na tela

### Game Mechanics
- [ ] Ansiedade aumenta quando vê áreas abertas
- [ ] HUD mostra barra de ansiedade em tempo real
- [ ] Objetivo counter mostra 0/3 no início
- [ ] Colidir com esferas amarelas as faz desaparecer
- [ ] Contador muda para 1/3, 2/3, 3/3
- [ ] Tela de vitória aparece quando completa objetivos

### Audio (Se adicionou)
- [ ] Trilha ambiente toca ao entrar no jogo
- [ ] Volume inicial está agradável (não muito alto)
- [ ] Trilha de tensão cresce com ansiedade
- [ ] Efeitos sonoros disparam em eventos
- [ ] AudioDebugger mostra ✅ se tudo carregou

### Visual
- [ ] 3D scene renderiza sem lag
- [ ] FPS mantém-se acima de 30 (60 ideal)
- [ ] Efeitos pós-processamento disparam
- [ ] Vinheta aparece em alta ansiedade
- [ ] Nenhum artefato visual aparente

---

## 🔐 Segurança e Performance

### Segurança
- [ ] Nenhuma senha ou API key no código
- [ ] Nenhuma console.log com dados sensíveis
- [ ] Headers de segurança configurados
- [ ] Input sanitizado (se houver input de usuário)
- [ ] CORS configurado (se usar APIs externas)

### Performance
- [ ] Build size aceito (< 500MB instalado)
- [ ] Nenhum módulo desnecessário em dependencies
- [ ] Tree-shaking ativo (`npm run build` sem warnings)
- [ ] Imagens otimizadas (se houver)
- [ ] Código TypeScript compila sem errors

### Tamanho de Arquivo
- [ ] `npm install` baixa < 500MB
- [ ] Build output < 1GB
- [ ] Áudios comprimidos (128-192 kbps MP3)

---

## 📝 Before Push to GitHub

```bash
# Final check
npm run build          # Sem erros
npm start              # Executa
git status             # Clean
git log --oneline      # Mostra commits

# Push tudo
git add .
git commit -m "fix: final production checks"
git push origin main
```

- [ ] Build passa sem erros
- [ ] Aplicação inicia
- [ ] Git está limpo (nada pendente)
- [ ] Commits fazem sentido
- [ ] Push para GitHub completado

---

## 🚀 Deploy Vercel

### Setup Vercel
- [ ] Account Vercel criado (vercel.com)
- [ ] Projeto conectado ao GitHub
- [ ] Node version: 18.x (automático)
- [ ] Build command: `npm run build` (padrão)
- [ ] Start command: `npm start` (padrão)

### First Deploy
- [ ] Deploy iniciado em Vercel Dashboard
- [ ] Build completa com sucesso
- [ ] URL fornecida (algo como `https://bastidores.vercel.app`)
- [ ] Deploy preview está ativo

### Verificação Pós-Deploy
- [ ] Site abre na URL fornecida
- [ ] Menu inicial exibe
- [ ] Clique "ENTRAR" funciona
- [ ] Jogo renderiza sem erros
- [ ] Áudio toca (se presente)
- [ ] DevTools → Network mostra requests OK (200)
- [ ] Console não mostra errors críticos (warnings OK)

---

## 📊 Verificação Performance

### Speed
- [ ] Página carrega em < 3 segundos
- [ ] Jogo inicia em < 2 segundos após "ENTRAR"
- [ ] Mantém 60 FPS durante gameplay

### Coverage
- [ ] Sem 404s no console
- [ ] Sem CORS errors
- [ ] Sem undefined variable errors
- [ ] Sem missing asset errors

---

## 🎮 Teste em Múltiplos Navegadores

- [ ] Chrome: Funciona
- [ ] Firefox: Funciona
- [ ] Safari: Funciona
- [ ] Edge: Funciona (se possível)

---

## 🌍 Domínio Personalizado (Opcional)

Se quer usar seu próprio domínio:

- [ ] Domínio registrado (Godaddy, Namecheap, etc)
- [ ] DNS apontando para Vercel
- [ ] SSL automático (Vercel configura)
- [ ] Site acessível em novo domínio

---

## 📈 Monitoring (Pós-Deploy)

### Vercel Dashboard
- [ ] Deployments mostram histórico correto
- [ ] Última build foi bem-sucedida
- [ ] Performance é aceitável
- [ ] Sem deploys com erro recentes

### Logs
- [ ] Monitor → Saw no critical errors
- [ ] Edge logs limpos
- [ ] Build logs sem warnings significativos

---

## ✅ Final Sign-Off

- [ ] Checklist completamente preenchido (todas caixas ✓)
- [ ] Nenhum item "não aplicável"
- [ ] Aplicação está em produção
- [ ] URL de produção testada e funcionando

---

## 🎉 Parabéns!

Seu jogo BACKROOMS Horror está em produção! 🚀👻

**Próximas etapas sugeridas:**
1. Compartilhe o link com amigos
2. Coleta feedback de usuários
3. Monitore performance/erros no Vercel
4. Planeje features V2.0 (multiplayer, mais content)
5. Configure analytics (Vercel Analytics opcional)

---

## 📞 Troubleshooting Rápido

| Problema        | Solução                                                                |
| --------------- | ---------------------------------------------------------------------- |
| Build falha     | Execute `npm run build` localmente; corrija erros antes de push        |
| Áudio não toca  | Verifique `public/audio/` existe no Git; use `git add public/audio/`   |
| 404 em arquivos | Verifique `.vercelignore` não está ignorando assets; clean cache       |
| Lento           | Verifique size do node_modules; reduza áudio quality; optimize imports |
| Erro TypeScript | Run `npm run lint`; corrija warnings; commit + push                    |

---

**Última atualização:** 1º de abril de 2026

Boa sorte! 🎭✨
