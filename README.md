# Protótipo TCC — Plataforma de Orientação Vocacional

**Versão: 0.3**

Protótipo full-stack construído como teste comparativo (Claude vs GPT) para o TCC do CEDUP 2026.

## Sobre o projeto

Plataforma de orientação vocacional para estudantes do ensino médio: questionário em 3 etapas (Interesses, Habilidades, Perfil), cálculo de compatibilidade com áreas profissionais, trilhas de desenvolvimento e simulados de processos seletivos.

## Stack
- **Frontend:** React + Vite + React Router + Zustand
- **Backend:** Node.js + Express + Prisma
- **Banco de dados:** PostgreSQL (local)

---

## Guia completo para rodar localmente (do zero)

Esse guia assume que você não tem nada instalado ainda. Se algum passo já estiver feito na sua máquina, pule.

### Passo 1 — Instalar o Node.js

1. Acesse https://nodejs.org
2. Baixe a versão **LTS** — testado com Node 20.
3. Instale normalmente.
4. Confirme rodando:
   ```
   node -v
   npm -v
   ```

### Passo 2 — Instalar o PostgreSQL

**Windows:**
1. https://www.postgresql.org/download/windows/
2. Baixe e execute o instalador.
3. Anote a senha do usuário `postgres` definida na instalação.
4. Deixe a porta padrão (5432).

**macOS:**
```
brew install postgresql@16
brew services start postgresql@16
```

**Linux (Ubuntu/Debian):**
```
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Passo 3 — Criar o banco de dados

**Via terminal (psql):**
```
psql -U postgres
```
```sql
CREATE DATABASE prototipo_tcc;
CREATE USER prototipo_user WITH ENCRYPTED PASSWORD 'escolha_uma_senha_aqui';
GRANT ALL PRIVILEGES ON DATABASE prototipo_tcc TO prototipo_user;
\q
```

**Via pgAdmin:** crie o banco `prototipo_tcc`, crie o usuário `prototipo_user` com senha e login habilitado, e conceda privilégios completos a ele sobre o banco.

### Passo 4 — Configurar e rodar o backend (server)

```
cd server
cp .env.example .env
```

Ajuste `DATABASE_URL` no `.env` com seu usuário/senha:
```
DATABASE_URL="postgresql://prototipo_user:escolha_uma_senha_aqui@localhost:5432/prototipo_tcc?schema=public"
```

`JWT_SECRET` pode ser qualquer texto longo aleatório. `SESSAO_DURACAO_MINUTOS` controla quanto tempo de inatividade derruba a sessão (padrão: 30).

```
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

### Passo 5 — Configurar e rodar o frontend (client)

```
cd client
cp .env.example .env
npm install
npm run dev
```

### Passo 6 — Testar

- **http://localhost:5173** → tela inicial
- **http://localhost:3333/api/health** → `{"status":"ok"}`

---

## Atualizando o projeto após puxar uma nova versão

Sempre que o `schema.prisma` mudar entre versões (como aconteceu agora, na 0.3), rode dentro de `server/`:
```
npx prisma migrate dev
```
Isso aplica as mudanças novas no seu banco local sem apagar os dados existentes.

---

## Endpoints disponíveis (versão 0.3)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Verifica se o servidor está no ar |
| GET | `/api/auth/captcha` | Gera um captcha simples (soma de dois números) |
| POST | `/api/auth/cadastro` | Cria um usuário novo (`username`, `senha`) |
| POST | `/api/auth/login` | Login (`username`, `senha`, e `captchaToken`/`captchaResposta` a partir da 2ª tentativa errada) |
| GET | `/api/auth/me` | Retorna o usuário autenticado (precisa do header `Authorization: Bearer <token>`) |

**Regras de segurança implementadas:**
- Senha nunca armazenada em texto puro (bcrypt, 10 salt rounds).
- Nome de usuário único e case-insensitive.
- A partir da 2ª tentativa de login incorreta, passa a exigir captcha.
- Após 5 tentativas incorretas, a conta fica bloqueada por 15 minutos.
- Sessão (JWT) com expiração deslizante: toda requisição autenticada válida renova o prazo, então só expira por inatividade real.

---

## Problemas comuns (troubleshooting)

**"psql: command not found"** — adicione o PostgreSQL ao PATH ou use o "SQL Shell (psql)" do menu iniciar (Windows).

**"password authentication failed for user"** — senha errada no `.env` ou no `CREATE USER`.

**"connection refused"** — serviço do Postgres não está rodando.

**"port 5432 already in use"** — outro Postgres já está na mesma porta.

**Erro do Prisma "P1001"** — banco inacessível com os dados do `.env`.

---

## Estrutura do projeto

```
client/          → frontend (React)
server/
  ├─ prisma/
  │   ├─ schema.prisma
  │   └─ seed.js
  └─ src/
      ├─ index.js
      ├─ lib/            → prisma.js, captchaStore.js
      ├─ middlewares/    → auth.js
      ├─ routes/         → auth.routes.js
      └─ utils/          → usuario.js
```

## Status do protótipo (versão 0.3)

**Concluído:**
- Estrutura inicial do projeto
- Modelagem completa do banco de dados + seed das 14 áreas
- Autenticação: cadastro, login, captcha, bloqueio por tentativas, sessão deslizante

**Próxima etapa:** estrutura base do frontend e navegação (React Router + Zustand + telas iniciais).
