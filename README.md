# Protótipo TCC — Plataforma de Orientação Vocacional

Protótipo full-stack construído como teste comparativo (Claude vs GPT) para o TCC do CEDUP 2026.

Este é o guia de **instalação do zero**, pra quando você estiver configurando o projeto num computador novo pela primeira vez. Ele não muda a cada versão — só quando algo estrutural muda de verdade (nova dependência, novo passo de instalação etc.).

- Pra saber **o que rodar depois de puxar uma atualização** (migrations, seeds novos), veja `README-ATUALIZACAO.md`.
- Pra saber **como subir o projeto num dia normal** (ambiente já configurado), veja `README-INICIALIZACAO.md`.

## Sobre o projeto

Plataforma de orientação vocacional para estudantes do ensino médio: questionário em 3 etapas (Interesses, Habilidades, Perfil), cálculo de compatibilidade com áreas profissionais, trilhas de desenvolvimento e simulados de processos seletivos.

## Stack
- **Frontend:** React + Vite + React Router + Zustand
- **Backend:** Node.js + Express + Prisma
- **Banco de dados:** PostgreSQL (local)

---

## Guia completo para rodar localmente (do zero)

### Passo 1 — Instalar o Node.js
1. Acesse https://nodejs.org
2. Baixe a versão **LTS** (testado com Node 20).
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

`npm run db:seed` popula o banco com: as 14 áreas profissionais, as 36 perguntas do questionário, as 42 trilhas (14 áreas × 3 faixas) e os 15 simulados. É seguro rodar de novo a qualquer momento.

### Passo 5 — Configurar e rodar o frontend (client)

```
cd client
cp .env.example .env
npm install
npm run dev
```

### Passo 6 — Testar

- **http://localhost:5173** → landing page do protótipo
- Crie uma conta, faça a Jornada completa e confira Resultados e Simulados
- **http://localhost:3333/api/health** → `{"status":"ok"}`

---

## Problemas comuns (troubleshooting)

**"psql: command not found"** — adicione o PostgreSQL ao PATH ou use o "SQL Shell (psql)" do menu iniciar (Windows).

**"password authentication failed for user"** — senha errada no `.env` ou no `CREATE USER`.

**"connection refused" / "could not connect to server"** — o serviço do PostgreSQL não está rodando.

**"port 5432 already in use"** — já existe outro PostgreSQL rodando na mesma porta.

**Erro do Prisma tipo "P1001"** — o banco não está acessível com os dados do `.env`.

**Tela em branco no frontend** — confirme que o backend está rodando em `http://localhost:3333` e que `client/.env` aponta pra lá.

---

## Estrutura do projeto

```
client/
  src/
    pages/            → Landing, Login, Cadastro, Dashboard, Jornada, JornadaEtapa, Resultados, Simulados, SimuladoTentativa...
    components/       → RotaProtegida.jsx, layout/AppShell.jsx
    stores/           → useAuthStore, useThemeStore, usePerfilStore
    lib/              → api.js
server/
  prisma/             → schema.prisma, seed.js, seedQuestionario.js, seedTrilhas.js, seedSimulados.js
  src/
    routes/           → auth.routes.js, questionario.routes.js, resultados.routes.js, simulados.routes.js
    services/         → questionario.service.js, resultados.service.js, simulados.service.js
    middlewares/      → auth.js
    lib/               → prisma.js, captchaStore.js
    utils/            → usuario.js
```
