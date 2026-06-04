# 🚀 Deployment Guide - Vercel

Este guia acompanha você no processo de colocar o bastidores Horror em produção no Vercel.

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
git commit -m "chore: initialize bastidores with vercel ready configs"
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

- [ ] **Git está limpo**
  ```bash
  git status
  # Deve estar "On branch main, nothing to commit"
  ```

## 🔧 Configurações do Vercel (Já Feitas)

O projeto já está pré-configurado:

✅ **vercel.json**
- Framework: Next.js
- Node: 18.x
- Build command: `npm run build`
- Output: `.next` (standalone)
- Headers de segurança

✅ **.vercelignore**
- Ignora documentação desnecessária
- Ignora arquivos de dev
- Acelera deploy (500KB menor)

✅ **next.config.mjs**
- `output: 'standalone'` (recomendado Vercel)
- Howler.js corretamente configurado
- Compressão ativada
- Cache de áudio otimizado

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

## 🧪 Testar Após Deploy

1. Acesse sua URL Vercel
2. Clique em "ENTRAR" no menu
3. Ouça a trilha sonora
4. Teste os controles (WASD, Mouse)
5. Verifique DevTools (F12 → Network) para erros

**Se houver erro de áudio:**
```
Failed to load audio track: /audio/ambient-base.mp3
```
→ Verifique que arquivos em `public/audio/` estão no repositório

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

## 🔍 Troubleshooting Deploy

### "Build failed"
- Verifique `npm run build` funciona localmente
- Veja logs detalhados no Vercel Dashboard
- Procure por erro de TypeScript/import

### "Áudio não toca em produção"
- [ ] Arquivos estão em `public/audio/`?
- [ ] Caminhos em `src/config/audioFiles.ts` correspondem?
- [ ] Git tracking de audio files OK?
  ```bash
  git ls-tree -r HEAD public/audio/
  ```

### "Performance ruim / Slow cold starts"
- Reduz tamanho do bundle:
  ```bash
  npm run build:analyze
  ```
- Verifique que Howler.js lazy-loading funciona
- Comprima áudio em bitrate menor

## 🔄 Atualizações Contínuas

Após o deploy inicial, o Vercel automático redeploy em cada push:

```bash
# Fazer mudanças localmente
git add .
git commit -m "feat: add new horror event"
git push origin main

# Vercel detecta e faz auto-deploy (2-3 min)
# Monitore em Dashboard
```

## ✅ Deployment Success!

Parabéns! Seu jogo está online e pronto para o mundo 🚀

**Próximos passos:**
- Compartilhe URL com amigos
- Monitore performance
- Recolha feedback
- Plane V2 features
