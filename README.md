# Protótipo TCC — Plataforma de Orientação Vocacional

**Versão: 0.5**

Protótipo full-stack construído como teste comparativo (Claude vs GPT) para o TCC do CEDUP 2026.

## Sobre o projeto

Plataforma de orientação vocacional para estudantes do ensino médio: questionário em 3 etapas (Interesses, Habilidades, Perfil), cálculo de compatibilidade com áreas profissionais, trilhas de desenvolvimento e simulados de processos seletivos.

## Stack
- **Frontend:** React + Vite + React Router + Zustand
- **Backend:** Node.js + Express + Prisma
- **Banco de dados:** PostgreSQL (local)

---

## Guia completo para rodar localmente (do zero)

### Passo 1 — Node.js
https://nodejs.org (versão LTS). Confirme com `node -v` e `npm -v`.

### Passo 2 — PostgreSQL
**Windows:** https://www.postgresql.org/download/windows/ (anote a senha do usuário `postgres`).
**macOS:** `brew install postgresql@16 && brew services start postgresql@16`
**Linux:** `sudo apt install postgresql postgresql-contrib && sudo systemctl start postgresql`

### Passo 3 — Criar o banco
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
Ajuste `DATABASE_URL` com seu usuário/senha.
```
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```
`npm run db:seed` roda dois arquivos em sequência: popula as 14 áreas e depois as 36 perguntas do questionário (14 Interesses + 14 Habilidades + 8 Perfil). É seguro rodar de novo a qualquer momento, não duplica dados.

### Passo 5 — Frontend
```
cd client
cp .env.example .env
npm install
npm run dev
```

### Passo 6 — Testar
- **http://localhost:5173** → landing, cadastro, e depois de logado a aba **Jornada**
- Comece a etapa "Interesses" — as outras duas ficam bloqueadas até você concluir a anterior
- **http://localhost:3333/api/health** → `{"status":"ok"}`

---

## Atualizando após puxar uma nova versão
Se o `schema.prisma` mudou, rode `npx prisma migrate dev` dentro de `server/`. Nesta versão (0.5) o schema não mudou, mas há um seed novo — rode `npm run db:seed` de novo pra popular as perguntas.

---

## O que tem nessa versão (0.5)

- **36 perguntas no banco:** 14 de Interesses e 14 de Habilidades (uma por área profissional, escala de 5 pontos), e 8 de Perfil (4 de Competência + 4 de Preferência, cada alternativa impactando várias áreas ao mesmo tempo, pra manter a etapa curta).
- **Jornada em 3 etapas sequenciais**, com desbloqueio real validado no backend (não dá pra pular etapa nem manipulando a URL).
- **Barra de progresso** por etapa e dentro de cada etapa (pergunta X de Y).
- **Retomada automática:** se você sair no meio, ao voltar o questionário abre exatamente na próxima pergunta não respondida.
- **Possível revisar/trocar respostas** dentro da etapa usando o botão "Voltar".
- **Selo "Concluída"** e botão "Continuar"/"Começar"/"Revisar respostas" conforme o status de cada etapa.

A pontuação e o resultado final (áreas ranqueadas, seção de "áreas a desenvolver") ainda não são calculados — isso é a próxima etapa do cronograma.

---

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Verifica se o servidor está no ar |
| GET/POST | `/api/auth/*` | Cadastro, login, captcha, `/me` (versão 0.3) |
| GET | `/api/questionario/progresso` | Progresso das 3 etapas do usuário logado |
| GET | `/api/questionario/:etapa` | Perguntas da etapa (`interesses`, `habilidades` ou `perfil`) — 403 se a etapa ainda estiver bloqueada |
| POST | `/api/questionario/resposta` | Registra/atualiza uma resposta (`perguntaId`, `alternativaId`) |

---

## Problemas comuns (troubleshooting)

**"psql: command not found"** — adicione o PostgreSQL ao PATH.
**"password authentication failed"** — senha errada no `.env`.
**"connection refused"** — serviço do Postgres não está rodando.
**Etapa aparece bloqueada mesmo respondendo tudo** — confira se rodou `npm run db:seed` após puxar essa versão; sem as perguntas no banco, a etapa nunca fecha 100%.

---

## Estrutura do projeto

```
client/
  src/
    pages/            → Landing, Login, Cadastro, Dashboard, Jornada, JornadaEtapa...
    components/       → RotaProtegida.jsx, layout/AppShell.jsx
    stores/           → useAuthStore, useThemeStore, usePerfilStore
    lib/              → api.js
server/
  prisma/             → schema.prisma, seed.js (áreas), seedQuestionario.js (perguntas)
  src/
    routes/           → auth.routes.js, questionario.routes.js
    services/         → questionario.service.js
    middlewares/      → auth.js
    lib/               → prisma.js, captchaStore.js
    utils/            → usuario.js
```

## Status do protótipo (versão 0.5)

**Concluído:**
- Estrutura inicial do projeto
- Banco de dados modelado + seed das 14 áreas
- Autenticação completa
- Estrutura base do frontend e navegação
- Onboarding e jornada dos 3 questionários (36 perguntas, desbloqueio sequencial, progresso, retomada)

**Próxima etapa:** cálculo dos resultados e geração das trilhas (a fórmula 35/35/20/10 que já fechamos, incluindo a seção separada de "áreas a desenvolver" para interesse alto + habilidade baixa).
