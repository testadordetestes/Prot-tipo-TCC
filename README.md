# Protótipo TCC — Plataforma de Orientação Vocacional

Protótipo full-stack construído como teste comparativo (Claude vs GPT) para o TCC do CEDUP 2026.

## Stack
- Frontend: React + Vite + React Router + Zustand
- Backend: Node.js + Express + Prisma
- Banco de dados: PostgreSQL (local)

## Como rodar localmente

### 1. Banco de dados
Crie um banco PostgreSQL local chamado `prototipo_tcc` (ou outro nome, ajustando o `.env`).

### 2. Backend
```
cd server
cp .env.example .env
npm install
npx prisma generate
npm run dev
```

### 3. Frontend
```
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend em `http://localhost:5173`, backend em `http://localhost:3333`.

## Status
Estrutura inicial do projeto. Banco de dados, autenticação, questionário, simulados etc. serão adicionados incrementalmente, seguindo o cronograma combinado.
