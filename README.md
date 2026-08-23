# Protótipo TCC — Plataforma de Orientação Vocacional

**Versão: 0.4**

Protótipo full-stack construído como teste comparativo (Claude vs GPT) para o TCC do CEDUP 2026.

## Sobre o projeto

Plataforma de orientação vocacional para estudantes do ensino médio: questionário em 3 etapas (Interesses, Habilidades, Perfil), cálculo de compatibilidade com áreas profissionais, trilhas de desenvolvimento e simulados de processos seletivos.

## Stack
- **Frontend:** React + Vite + React Router + Zustand
- **Backend:** Node.js + Express + Prisma
- **Banco de dados:** PostgreSQL (local)

---

## Guia completo para rodar localmente (do zero)

### Passo 1 — Instalar o Node.js
1. https://nodejs.org — versão LTS (testado com Node 20).
2. Confirme: `node -v` e `npm -v`.

### Passo 2 — Instalar o PostgreSQL
**Windows:** https://www.postgresql.org/download/windows/ — anote a senha do usuário `postgres` na instalação.
**macOS:** `brew install postgresql@16 && brew services start postgresql@16`
**Linux:** `sudo apt install postgresql postgresql-contrib && sudo systemctl start postgresql`

### Passo 3 — Criar o banco de dados
```
psql -U postgres
```
```sql
CREATE DATABASE prototipo_tcc;
CREATE USER prototipo_user WITH ENCRYPTED PASSWORD 'escolha_uma_senha_aqui';
GRANT ALL PRIVILEGES ON DATABASE prototipo_tcc TO prototipo_user;
\q
```

### Passo 4 — Backend
```
cd server
cp .env.example .env
```
Ajuste `DATABASE_URL` com seu usuário/senha do banco.
```
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

### Passo 5 — Frontend
```
cd client
cp .env.example .env
npm install
npm run dev
```

### Passo 6 — Testar
- **http://localhost:5173** → landing page do protótipo, com botões "Começar agora" e "Já tenho conta"
- Crie uma conta pela tela de cadastro → deve te levar direto pro Dashboard
- **http://localhost:3333/api/health** → `{"status":"ok"}`

---

## Atualizando após puxar uma nova versão
Se o `schema.prisma` mudou, rode dentro de `server/`: `npx prisma migrate dev`

---

## O que tem nessa versão (0.4)

- **Navegação completa:** landing pública, login, cadastro, e 7 abas autenticadas (Dashboard, Jornada, Resultados, Minha Trilha, Simulados, Preparação, Meu Perfil), todas com rota própria via React Router.
- **Rotas protegidas:** quem não está logado é redirecionado pro login automaticamente.
- **Login e cadastro conectados de verdade na API** (versão 0.3): captcha aparece sozinho se errar a senha, mensagens de erro do backend aparecem na tela.
- **Sessão persistente:** o token fica salvo no `localStorage` do navegador, então dar refresh na página não desloga o estudante; a cada ação, o token é renovado automaticamente (sessão desliza por inatividade).
- **Tema claro/escuro:** alternável pelo botão na barra lateral, salvo no navegador, com variáveis de cor prontas pra evoluir o visual depois.
- **3 stores do Zustand:** autenticação, tema, e progresso/resultado do perfil (esse último ainda vazio — será populado na etapa da jornada).
- **Responsivo:** a barra lateral vira uma barra horizontal em telas pequenas.

As 7 páginas internas ainda são placeholders — cada uma ganha conteúdo real na etapa correspondente do cronograma.

---

## Endpoints da API (backend, inalterados desde a 0.3)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Verifica se o servidor está no ar |
| GET | `/api/auth/captcha` | Gera um captcha simples |
| POST | `/api/auth/cadastro` | Cria um usuário novo |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Usuário autenticado |

---

## Problemas comuns (troubleshooting)

**"psql: command not found"** — adicione o PostgreSQL ao PATH ou use o "SQL Shell (psql)".
**"password authentication failed"** — senha errada no `.env` ou no `CREATE USER`.
**"connection refused"** — serviço do Postgres não está rodando.
**Tela em branco no frontend** — confirme que o backend está rodando em `http://localhost:3333` e que `client/.env` aponta pra lá.

---

## Estrutura do projeto

```
client/
  src/
    pages/           → telas (Landing, Login, Cadastro, Dashboard, Jornada...)
    components/      → RotaProtegida.jsx, layout/AppShell.jsx
    stores/          → useAuthStore, useThemeStore, usePerfilStore (Zustand)
    lib/             → api.js (wrapper de fetch com autenticação)
server/
  prisma/            → schema.prisma, seed.js
  src/
    routes/          → auth.routes.js
    middlewares/     → auth.js
    lib/              → prisma.js, captchaStore.js
    utils/           → usuario.js
```

## Status do protótipo (versão 0.4)

**Concluído:**
- Estrutura inicial do projeto
- Banco de dados modelado + seed das 14 áreas
- Autenticação (cadastro, login, captcha, bloqueio, sessão deslizante)
- Estrutura base do frontend e navegação (rotas, proteção de rotas, tema, stores)

**Próxima etapa:** onboarding e jornada dos 3 questionários vocacionais (Interesses, Habilidades, Perfil).
