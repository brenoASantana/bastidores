# 🚀 Deploy no Vercel - Guia Completo

Este guia acompanha você no processo de colocar o BACKROOMS Horror em produção no Vercel.

---

## ⚡ Deployment Rápido (5-10 minutos)

### Opção 1: Via GitHub (Recomendado - Automático)

#### 1. Prepare o Repositório
```bash
# Verifique se o projeto está no Git
cd /Users/breno.santana/Coding/Pessoal/bastidores
git status

# Se NÃO está em git, inicialize:
git init
git add .
git commit -m "chore: initialize backrooms mvp with vercel ready configs"
```

#### 2. Envio para GitHub
```bash
# Crie um repositório em GitHub: github.com/novo-repo

# Configure repositório remoto
git remote add origin https://github.com/seu-usuario/bastidores.git
git branch -M main
git push -u origin main
```

#### 3. Deploy no Vercel (3 cliques)
1. Acesse [vercel.com](https://vercel.com)
2. Clique "New Project"
3. Selecione seu repositório `bastidores`
4. **Clique "Deploy"** → Vercel faz tudo automaticamente
   - Detecta Next.js ✓
   - Usa `npm install` ✓
   - Roda `npm run build` ✓
   - Inicia `npm start` ✓

**Resultado:** Seu jogo está online em minutos! 🎉

---

### Opção 2: Vercel CLI (Para Linha de Comando)

#### 1. Instale Vercel CLI
```bash
npm i -g vercel
```

#### 2. Deploy Uma Linha
```bash
cd /Users/breno.santana/Coding/Pessoal/bastidores
vercel --prod
```

Siga as instruções na tela:
- Conecte seu account Vercel
- Escolha nome do projeto
- Defina diretório raiz: `.` (Enter)
- **Deploy automático!**

---

## 📋 Checklist Pré-Deploy

Antes de fazer deploy, verifique:

- [ ] **Build local funciona**
  ```bash
  npm run build
  npm start
  ```
  Acesse http://localhost:3000 e teste

- [ ] **Arquivos de áudio existem**
  ```bash
  ls public/audio/
  # Deve listar: ambient-base.mp3, tension-layer.mp3, etc
  ```

- [ ] **Não há erros TypeScript**
  ```bash
  npm run lint
  # Sem warnings críticos
  ```

- [ ] **Variáveis de ambiente configuradas** (se usar)
  ```bash
  # Verifique .env.example está presente
  ls .env.example
  ```

- [ ] **Git está limpo**
  ```bash
  git status
  # Deve estar "On branch main, nothing to commit"
  ```

---

## 🔧 Configurações do Vercel (Já Feitas)

O projeto já está pré-configurado:

✅ **vercel.json**
- Framework: Next.js
- Node: 18.x
- Build command: `npm run build`
- Output: `.next` (standalone)
- Headers de segurança

✅ **.vercelignore**
- Ignora documentação (README, ARCHITECTURE, etc)
- Ignora arquivos desnecessários
- Acelera deploy (500KB menor)

✅ **next.config.mjs**
- `output: 'standalone'` (recomendado Vercel)
- Howler.js corretamente configurado
- Compressão ativada
- Cache de áudio otimizado

✅ **.env.example**
- Variáveis de ambiente documentadas
- Fácil replicação

---

## 🌐 Após o Deploy

### Seu URL será algo como:
```
https://bastidores.vercel.app
https://seu-nome-projeto.vercel.app
```

### Domínio Personalizado (Opcional)
1. Vá para projeto no Vercel
2. Settings → Domains
3. Adicione seu domínio (bastidores.com, etc)
4. Configure DNS do seu registrador
5. **Pronto:** seu-dominio.com está ativo

---

## 🧪 Testar Após Deploy

1. Acesse sua URL Vercel
2. Clique em "ENTRAR" no menu
3. Ouça a trilha sonora (se adicionou `public/audio/`)
4. Teste os controles (WASD, Mouse)
5. Verifique DevTools (F12 → Network) para erros

**Se houver erro de áudio:**
```
Failed to load audio track: /audio/ambient-base.mp3
```
→ Verifique files em `public/audio/` estão presentes no repositório

---

## 📊 Monitoramento em Produção

### Vercel Dashboard
1. Log in em [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione projeto `bastidores`
3. Veja:
   - ✅ Build status (verde = OK)
   - 📊 Performance metrics
   - 📝 Deployment history
   - 🐛 Error logs

### Analytics (Opcional)
```bash
# Dentro do projeto:
npm install @vercel/analytics

# Em src/app/layout.tsx:
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🔍 Troubleshooting Deploy

### ❌ "Build failed: Command 'npm run build' failed"

**Solução:**
```bash
# Teste localmente
npm run build

# Se houver erro, corrija localmente primeiro
# Depois faça git push
git add .
git commit -m "fix: build error"
git push origin main
```

### ❌ "Arquivos de áudio não carregam"

**Solução:**
```bash
# Certifique-se que os áudios estão no Git
git add public/audio/
git commit -m "feat: add audio files"
git push

# Se ainda não funcionar:
# 1. Verifique nomes dos arquivos (case-sensitive)
# 2. Confirme em vercel.json que não estão em .vercelignore
# 3. No Vercel Dashboard → Deployments → Ver logs
```

### ❌ "Next.js compilation failed"

**Solução:**
```bash
# Limpe cache local
rm -rf .next node_modules
npm install

# Teste build
npm run build

# Se OK, faça push
git add .
git commit -m "fix: clear cache"
git push
```

### ⚠️ "Slow deploy time (>1 min)"

**Dicas:**
- Vercel caches dependências entre deploys (2º deploy é rápido)
- Reduza tamanho de `node_modules` removendodevDependencies não usadas
- Use `npm ci` em vez de `npm install` no Vercel (automático)

---

## 📈 Otimizações Pós-Deploy

### 1. Habilitar Gzip (Automático no Vercel)
✅ Já feito em `next.config.mjs` (`compress: true`)

### 2. Cache de Áudio (30 dias)
✅ Já configurado em `vercel.json`:
```json
"Cache-Control": "public, max-age=86400, immutable"
```

### 3. Reduzir Tamanho de Build
- Áudios em compressão (MP3 128-192 kbps)
- Documentação ignorada em `.vercelignore`
- Próximo: considerar lazy-load de modelos 3D

---

## 🔐 Segurança em Produção

### Headers de Segurança (Já Configurados)
```json
✅ X-Content-Type-Options: nosniff
✅ X-Frame-Options: SAMEORIGIN
✅ X-XSS-Protection: 1; mode=block
✅ Referrer-Policy: strict-origin-when-cross-origin
```

### Environment Secrets (Se Usar)
1. Vercel Dashboard → Settings → Environment Variables
2. Adicione secrets (ex: API keys, tokens)
3. Acesse em código via `process.env.CHAVE_SECRETA`

---

## 📱 Integração Git Contínua

**Fluxo automático:**
1. Faça alterações localmente
2. `git commit` e `git push` para main
3. Vercel **detecta automaticamente**
4. **Build e deploy** em ~2-3 minutos
5. Nova versão está **online**

**Exemplo:**
```bash
# Atualizou volume de áudio
nano src/config/constants.ts

# Commit
git add src/config/constants.ts
git commit -m "feat: increase master volume to 0.9"
git push origin main

# ✨ Vercel auto-builds e seu site tem a mudança!
```

---

## 🎮 Próximas Etapas

1. **Agora:** Deploy primeira versão via GitHub/Vercel CLI
2. **Depois:** Adicione domínio personalizado
3. **Depois:** Considere analytics para rastrear jogadores
4. **Depois:** Versão 2 com multiplayer

---

## 📞 Suporte

**Se algo der errado:**
1. Verifique [Vercel Docs](https://vercel.com/docs)
2. Olhe logs em Vercel Dashboard → Deployments
3. Abra issue no GitHub do projeto

---

## ✅ Resumo Pronto para Produção

| Item                | Status      | Link              |
| ------------------- | ----------- | ----------------- |
| Configuração Vercel | ✅ Pronto    | `vercel.json`     |
| Next.js Config      | ✅ Otimizado | `next.config.mjs` |
| Ignores Setup       | ✅ Pronto    | `.vercelignore`   |
| Env Template        | ✅ Pronto    | `.env.example`    |
| Build Scripts       | ✅ Pronto    | `package.json`    |
| Segurança Headers   | ✅ Pronto    | `next.config.mjs` |

**Você está 100% preparado para deploy!** 🚀

---

## 🎯 Deploy em 1 Minuto (TL;DR)

```bash
# 1. Crie repositório GitHub
# 2. Push do código
git push origin main

# 3. Vercel Setup
# → vercel.com → New Project
# → Selecione repositório
# → Deploy

# 4. Pronto! 🎉
# https://seu-projeto.vercel.app
```

**Próximo:** Escreva as Respostas abaixo:

- Qual seu usuário GitHub?
- Qual nome do repositório?
- Qual domínio personalizado quer usar?

Depois, posso criar um guia específico para seu setup!
