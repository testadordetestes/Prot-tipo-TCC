# Protótipo TCC — Plataforma de Orientação Vocacional

**Versão: 0.6**

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
`npm run db:seed` roda 3 arquivos em sequência: áreas → perguntas do questionário → trilhas. Seguro rodar de novo a qualquer momento.

### Passo 5 — Frontend
```
cd client
cp .env.example .env
npm install
npm run dev
```

### Passo 6 — Testar
- **http://localhost:5173** → landing, cadastro, Jornada
- Complete as 3 etapas → ao terminar a última pergunta, você é levado direto pra aba **Resultados**
- **http://localhost:3333/api/health** → `{"status":"ok"}`

---

## Atualizando após puxar uma nova versão
Se o `schema.prisma` mudou, rode `npx prisma migrate dev`. Nesta versão (0.6) o schema não mudou, mas há um seed novo (trilhas) — rode `npm run db:seed` de novo.

---

## O que tem nessa versão (0.6)

- **Fórmula de compatibilidade rodando de verdade:** `Interesse × 0,35 + Habilidade × 0,35 + Competência × 0,20 + Preferência × 0,10`, calculada automaticamente assim que a última etapa (Perfil) é concluída.
- **3 faixas de visibilidade:** score ≥ 60 aparece em destaque, 40–59 fica atrás de "ver mais", abaixo de 40 não aparece.
- **Seção separada "Áreas a desenvolver":** quando interesse ≥ 70 e habilidade ≤ 30 numa área, ela sai do ranking normal e cai numa seção própria, com mensagem específica.
- **Trilhas geradas para as 14 áreas × 3 faixas** (42 no total), cada uma com título, descrição e conteúdo personalizado com o nome da área e suas sub-áreas.
- **Página de Resultados completa:** destaque, "ver mais" expansível, e áreas a desenvolver, cada uma com sua trilha.
- Ao concluir a jornada, o sistema redireciona automaticamente pra Resultados.

---

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Verifica se o servidor está no ar |
| GET/POST | `/api/auth/*` | Cadastro, login, captcha, `/me` |
| GET/POST | `/api/questionario/*` | Progresso, perguntas por etapa, registrar resposta |
| GET | `/api/resultados` | Resultados calculados (destaque, ver mais, desenvolver) |
| POST | `/api/resultados/calcular` | Força recalcular os resultados do usuário logado |

---

## Problemas comuns (troubleshooting)

**"psql: command not found"** — adicione o PostgreSQL ao PATH.
**"password authentication failed"** — senha errada no `.env`.
**"connection refused"** — serviço do Postgres não está rodando.
**Resultados vazios mesmo com jornada completa** — confira se rodou `npm run db:seed` após essa versão (precisa das trilhas no banco).

---

## Estrutura do projeto

```
client/
  src/
    pages/            → Landing, Login, Cadastro, Dashboard, Jornada, JornadaEtapa, Resultados...
    components/       → RotaProtegida.jsx, layout/AppShell.jsx
    stores/           → useAuthStore, useThemeStore, usePerfilStore
    lib/              → api.js
server/
  prisma/             → schema.prisma, seed.js, seedQuestionario.js, seedTrilhas.js
  src/
    routes/           → auth.routes.js, questionario.routes.js, resultados.routes.js
    services/         → questionario.service.js, resultados.service.js
    middlewares/      → auth.js
    lib/               → prisma.js, captchaStore.js
    utils/            → usuario.js
```

## Status do protótipo (versão 0.6)

**Concluído:**
- Estrutura inicial do projeto
- Banco de dados modelado + seed das 14 áreas
- Autenticação completa
- Estrutura base do frontend e navegação
- Onboarding e jornada dos 3 questionários
- Cálculo dos resultados e geração das trilhas

**Próxima etapa:** simulados e histórico de tentativas.
