# Protótipo TCC — Plataforma de Orientação Vocacional

Protótipo full-stack construído como teste comparativo (Claude vs GPT) para o TCC do CEDUP 2026.

Este é o guia de **instalação do zero**, atualizado pra versão **0.11** (funcionalidade completa: cadastro/login, jornada de 3 etapas, cálculo de resultados, trilhas, simulados, administração técnica e testes automatizados). Ele não muda a cada versão — só quando algo estrutural muda de verdade.

- Pra saber **o que rodar depois de puxar uma atualização** (migrations, seeds novos, de qualquer versão), veja `README-ATUALIZACAO.md`.
- Pra saber **como subir o projeto num dia normal**, veja `README-INICIALIZACAO.md`.

## Sobre o projeto

Plataforma de orientação vocacional para estudantes do ensino médio. O estudante faz uma jornada de questionário em 3 etapas (Interesses, Habilidades, Perfil), recebe um resultado com áreas profissionais ranqueadas por compatibilidade, trilhas de desenvolvimento personalizadas, pode praticar simulados de processos seletivos e tem acesso a conteúdo orientativo de currículo e redação.

## Stack
- **Frontend:** React + Vite + React Router + Zustand
- **Backend:** Node.js + Express + Prisma
- **Banco de dados:** PostgreSQL (local)
- **Testes:** `node:test` (nativo do Node, sem dependência extra)

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
`JWT_SECRET` pode ser qualquer texto longo aleatório.

```
npm install
npx prisma migrate dev --name init
npm run db:seed
```

`npm run db:seed` roda 4 arquivos em sequência e popula: as 14 áreas profissionais, as 36 perguntas do questionário, as 42 trilhas (14 áreas × 3 faixas) e os 15 simulados. É seguro rodar de novo a qualquer momento, não duplica dados.

**(Opcional, mas recomendado)** confira se está tudo certo rodando os testes automatizados antes de subir o servidor:
```
npm test
```
Esses testes cobrem a fórmula de cálculo do resultado, as regras de desbloqueio da jornada, a correção de simulados, a validação de cadastro e o captcha — e não precisam do banco rodando pra funcionar.

Agora suba o servidor:
```
npm run dev
```
Deve aparecer `Servidor rodando na porta 3333`.

### Passo 5 — Configurar e rodar o frontend (client)

Em outro terminal (deixe o do backend aberto):
```
cd client
cp .env.example .env
npm install
npm run dev
```

### Passo 6 — Testar se está tudo funcionando

- **http://localhost:5173** → landing page do protótipo
- Crie uma conta e complete a Jornada (3 etapas) — ao terminar, você é levado direto pra **Resultados**
- Confira **Minha Trilha** e faça um **Simulado**
- Vá em **Meu Perfil** → confira a seção **Administração Técnica** (dá pra reduzir a duração da sessão ali, útil na hora de apresentar o TCC)
- **http://localhost:3333/api/health** → deve retornar `{"status":"ok"}`

Se tudo isso funcionar, a instalação está completa.

---

## Variáveis de ambiente

### `server/.env`
| Variável | Pra que serve |
|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL |
| `JWT_SECRET` | Chave usada pra assinar os tokens de sessão |
| `PORT` | Porta do servidor (padrão 3333) |
| `CLIENT_URL` | URL do frontend, usada na configuração de CORS |

**Nota:** duração da sessão, tentativas de login antes do bloqueio, tempo de bloqueio e limiar de captcha **não são mais configurados por variável de ambiente** desde a versão 0.9 — eles ficam salvos no banco e são editáveis a qualquer momento dentro do próprio app, em **Meu Perfil → Administração Técnica**, sem precisar reiniciar o servidor.

### `client/.env`
| Variável | Pra que serve |
|---|---|
| `VITE_API_URL` | URL do backend que o frontend vai chamar |

---

## Funcionalidades atuais (versão 0.11)

- Cadastro e login com bcrypt, JWT, captcha e bloqueio por tentativas
- Jornada vocacional em 3 etapas sequenciais (36 perguntas), com progresso e retomada automática
- Cálculo automático do resultado (fórmula 35/35/20/10), com seção separada de áreas a desenvolver
- 42 trilhas de desenvolvimento personalizadas por área e faixa de compatibilidade
- 15 simulados de processos seletivos com gabarito comentado e histórico de até 5 tentativas
- Conteúdo orientativo de currículo e redação
- Administração técnica configurável em runtime, trocar senha e excluir conta
- Tema claro/escuro, layout responsivo, testes automatizados nas regras de negócio críticas

---

## Problemas comuns (troubleshooting)

**"psql: command not found"** — adicione o PostgreSQL ao PATH ou use o "SQL Shell (psql)" do menu iniciar (Windows).

**"password authentication failed for user"** — senha errada no `.env` ou no `CREATE USER`.

**"connection refused" / "could not connect to server"** — o serviço do PostgreSQL não está rodando.

**"port 5432 already in use"** — já existe outro PostgreSQL rodando na mesma porta.

**Erro do Prisma tipo "P1001"** — o banco não está acessível com os dados do `.env`.

**Tela em branco no frontend** — confirme que o backend está rodando em `http://localhost:3333` e que `client/.env` aponta pra lá.

**`npm test` dá erro de módulo não encontrado** — confirme que rodou `npm install` dentro de `server/` antes.

**Mudei a duração da sessão em Administração Técnica e não fez efeito** — a mudança vale pra sessões novas (login seguinte); uma sessão já aberta usa o valor de quando foi criada até a próxima renovação.

---

## Estrutura do projeto

```
client/
  src/
    pages/            → Landing, Login, Cadastro, Dashboard, Jornada, JornadaEtapa,
                         Resultados, Trilha, Simulados, SimuladoTentativa, Preparacao,
                         Perfil, NaoEncontrado
    components/       → RotaProtegida.jsx, layout/AppShell.jsx
    stores/           → useAuthStore, useThemeStore, usePerfilStore (Zustand)
    lib/              → api.js
server/
  prisma/             → schema.prisma, seed.js (áreas), seedQuestionario.js (perguntas),
                         seedTrilhas.js (trilhas), seedSimulados.js (simulados)
  src/
    routes/           → auth.routes.js, questionario.routes.js, resultados.routes.js,
                         simulados.routes.js, configuracoes.routes.js
    services/         → questionario.service.js, resultados.service.js,
                         simulados.service.js, configuracoes.service.js
    middlewares/      → auth.js
    lib/               → prisma.js, captchaStore.js
    utils/            → usuario.js
  tests/              → usuario.test.js, captcha.test.js, resultados.test.js,
                         questionario.test.js, simulados.test.js
```
