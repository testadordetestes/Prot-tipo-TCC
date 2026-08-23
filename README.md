# Protótipo TCC — Plataforma de Orientação Vocacional

**Versão: 0.2**

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
2. Baixe a versão **LTS** (recomendada) — no protótipo, foi testado com Node 20.
3. Instale normalmente (next, next, finish).
4. Confirme que funcionou abrindo o terminal e rodando:
   ```
   node -v
   npm -v
   ```
   Deve aparecer um número de versão em cada comando (ex: `v20.x.x`).

### Passo 2 — Instalar o PostgreSQL

**Windows:**
1. Acesse https://www.postgresql.org/download/windows/
2. Baixe o instalador e execute.
3. Durante a instalação, ele vai pedir uma **senha para o usuário `postgres`** — anote essa senha, você vai precisar dela.
4. Deixe a porta padrão (**5432**).
5. No final, ele pode abrir o "Stack Builder" — pode fechar, não precisa dele.

**macOS:**
```
brew install postgresql@16
brew services start postgresql@16
```
(Se não tiver o Homebrew, instale antes em https://brew.sh)

**Linux (Ubuntu/Debian):**
```
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Passo 3 — Criar o banco de dados do projeto

**Opção A — via terminal (psql):**

1. Abra o terminal e entre no psql:
   - Windows: procure "SQL Shell (psql)" no menu iniciar e abra.
   - Mac/Linux: rode `psql -U postgres` (ou `sudo -u postgres psql` no Linux, se pedir permissão).
2. Vai pedir a senha do usuário `postgres` — digite a que você definiu no Passo 2.
3. Dentro do psql (o prompt vira algo tipo `postgres=#`), rode, uma linha por vez:
   ```sql
   CREATE DATABASE prototipo_tcc;
   CREATE USER prototipo_user WITH ENCRYPTED PASSWORD 'escolha_uma_senha_aqui';
   GRANT ALL PRIVILEGES ON DATABASE prototipo_tcc TO prototipo_user;
   ```
4. Saia do psql:
   ```sql
   \q
   ```

**Opção B — via pgAdmin (interface gráfica, se você instalou junto no Windows):**

1. Abra o pgAdmin, conecte no servidor local (senha do `postgres`).
2. Clique com botão direito em "Databases" → "Create" → "Database".
3. Nome: `prototipo_tcc`. Salvar.
4. Clique com botão direito em "Login/Group Roles" → "Create" → "Login/Group Role". Nome: `prototipo_user`, aba "Definition" define a senha, aba "Privileges" liga "Can login?".
5. Volte no banco `prototipo_tcc` → Properties → aba "Security" → adicione `prototipo_user` com todos os privilégios.

### Passo 4 — Configurar e rodar o backend (server)

```
cd server
cp .env.example .env
```

Abra o arquivo `server/.env` e ajuste a linha `DATABASE_URL` com o usuário/senha que você criou no Passo 3:

```
DATABASE_URL="postgresql://prototipo_user:escolha_uma_senha_aqui@localhost:5432/prototipo_tcc?schema=public"
```

O `JWT_SECRET` pode ser qualquer texto longo e aleatório por enquanto (ex: `troque-por-um-texto-aleatorio-grande-123`).

Agora instale as dependências e crie as tabelas no banco:

```
npm install
npx prisma migrate dev --name init
```

Esse comando lê o `prisma/schema.prisma` e cria todas as tabelas no banco `prototipo_tcc` automaticamente. Se der certo, você vai ver uma mensagem confirmando a migration.

Agora popule o banco com as áreas profissionais (dado inicial necessário pro sistema funcionar):

```
npm run db:seed
```

Por fim, suba o servidor:

```
npm run dev
```

Deve aparecer `Servidor rodando na porta 3333` no terminal.

### Passo 5 — Configurar e rodar o frontend (client)

Em outro terminal (deixe o do backend rodando):

```
cd client
cp .env.example .env
npm install
npm run dev
```

### Passo 6 — Testar se está tudo funcionando

- Acesse **http://localhost:5173** → deve aparecer a tela inicial do protótipo.
- Acesse **http://localhost:3333/api/health** → deve retornar `{"status":"ok"}`.

Se os dois funcionarem, está tudo certo.

---

## Problemas comuns (troubleshooting)

**"psql: command not found"**
O PostgreSQL não foi adicionado ao PATH do sistema. No Windows, procure a pasta de instalação (ex: `C:\Program Files\PostgreSQL\16\bin`) e adicione ao PATH, ou use o "SQL Shell (psql)" que já vem configurado.

**"password authentication failed for user"**
Senha errada no `.env` ou no comando `CREATE USER`. Confira se digitou a mesma senha nos dois lugares.

**"connection refused" / "could not connect to server"**
O serviço do PostgreSQL não está rodando. No Windows, procure "Services" e veja se "postgresql-x64-16" está como "Running". No Mac: `brew services start postgresql@16`. No Linux: `sudo systemctl start postgresql`.

**"port 5432 already in use"**
Já existe outro PostgreSQL rodando na mesma porta. Pode parar o outro serviço ou mudar a porta no `.env` (ex: `:5433`) e na instalação.

**Erro do Prisma tipo "P1001" ou "Can't reach database server"**
O banco não está acessível com os dados do `.env`. Revise usuário, senha, porta e se o serviço do Postgres está mesmo rodando.

---

## Estrutura do projeto

```
client/          → frontend (React)
server/          → backend (Express + Prisma)
  ├─ prisma/
  │   ├─ schema.prisma   → modelagem do banco de dados
  │   └─ seed.js          → popula áreas profissionais iniciais
  └─ src/
      └─ index.js          → ponto de entrada do servidor
```

## Status do protótipo (versão 0.2)

**Concluído:**
- Estrutura inicial do projeto (client + server)
- Modelagem completa do banco de dados (usuários, áreas, questionário, resultados, trilhas, simulados)
- Seed com as 14 áreas profissionais e subcategorias

**Próxima etapa:** autenticação e controle de acesso (cadastro/login com hash de senha e JWT).
