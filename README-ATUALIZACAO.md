# Atualização do Protótipo

Este arquivo reúne, versão por versão, o que mudou e o que fazer pra atualizar seu ambiente local depois de puxar o código. Se você está muito atrasado (por exemplo, ainda está na 0.2 e quer chegar na 0.11), pode simplesmente seguir todas as seções abaixo em ordem — ou, mais rápido, só rodar isto dentro de `server/`, que é sempre seguro e cobre qualquer coisa pendente:
```
npx prisma migrate dev
npm run db:seed
```

---

## Versão 0.1 — Estrutura inicial do projeto
**O que mudou:** primeira versão do repositório — esqueleto do `client/` (Vite + React) e do `server/` (Express + Prisma), sem nenhuma tela ou rota funcional ainda.
**O que fazer:** esse é o ponto de partida, não tem "versão anterior" pra atualizar a partir dela. Siga o `README.md` do zero.

## Versão 0.2 — Banco de dados e models
**O que mudou:** modelagem completa do banco no `schema.prisma` (usuários, áreas, questionário, resultados, trilhas, simulados) e seed das 14 áreas profissionais.
**O que fazer:**
```
cd server
npx prisma migrate dev --name init
npm run db:seed
```

## Versão 0.3 — Autenticação e controle de acesso
**O que mudou:** cadastro, login, bcrypt, JWT, captcha e bloqueio por tentativas. O `Usuario` ganhou os campos `falhasLogin` e `bloqueadoAte` no schema.
**O que fazer:**
```
cd server
npx prisma migrate dev
```

## Versão 0.4 — Estrutura base do frontend e navegação
**O que mudou:** rotas com React Router, telas de login/cadastro conectadas de verdade na API, layout com as 7 abas, tema claro/escuro, stores do Zustand. Nenhuma mudança de banco.
**O que fazer:** só puxar o código e reiniciar o frontend (`npm run dev` em `client/`).

## Versão 0.5 — Onboarding e jornada dos 3 questionários
**O que mudou:** as 36 perguntas da jornada (Interesses, Habilidades, Perfil) foram adicionadas ao banco via um seed novo (`seedQuestionario.js`). Nenhuma mudança de schema.
**O que fazer:**
```
cd server
npm run db:seed
```

## Versão 0.6 — Cálculo dos resultados e geração das trilhas
**O que mudou:** a fórmula de compatibilidade passou a rodar de verdade, e as 42 trilhas (14 áreas × 3 faixas) foram adicionadas via seed novo (`seedTrilhas.js`). Nenhuma mudança de schema.
**O que fazer:**
```
cd server
npm run db:seed
```

## Versão 0.7 — Simulados e histórico de tentativas
**O que mudou:** 15 simulados adicionados via seed novo (`seedSimulados.js`). O schema mudou pra permitir apagar tentativas antigas em cascata (`RespostaSimulado` ganhou `onDelete: Cascade` na relação com `TentativaSimulado`).
**O que fazer:**
```
cd server
npx prisma migrate dev
npm run db:seed
```

## Versão 0.8 — Currículo, redação e demais módulos
**O que mudou:** conteúdo real nas páginas Preparação, Minha Trilha, Dashboard (virou um hub) e Meu Perfil. Nenhuma mudança de banco.
**O que fazer:** só puxar o código e reiniciar o frontend.

## Versão 0.9 — Administração técnica e configurações
**O que mudou:** nova tabela `ConfiguracaoSistema` no banco (duração de sessão, tentativas de login, bloqueio e limiar de captcha, todos editáveis em runtime). Também entrou exclusão em cascata pra permitir apagar a própria conta (`RespostaQuestionario`, `ResultadoArea` e `TentativaSimulado` ganharam `onDelete: Cascade` na relação com `Usuario`).
**O que fazer:**
```
cd server
npx prisma migrate dev
```

## Versão 0.10 — Refinamento visual, animações e responsividade
**O que mudou:** paleta de cores ampliada, fonte Nunito (via Google Fonts, carregada no `client/index.html`), sombras, animações de entrada e um breakpoint mobile extra. Tudo em CSS, nenhuma mudança de banco.
**O que fazer:** só puxar o código e reiniciar o frontend. Precisa de internet no navegador pra carregar a fonte (se não carregar, o site usa a fonte padrão do sistema como reserva, sem quebrar nada).

## Versão 0.11 — Testes, correções e preparação para apresentação
**O que mudou:** a lógica de negócio crítica (fórmula de resultado, regras de desbloqueio de etapa, nota de simulado) foi separada em funções puras e ganhou testes automatizados com `node:test` (pasta `server/tests/`, novo script `npm test`). Nenhuma mudança de schema ou seed.
**O que fazer:**
```
cd server
npm test
```
(só pra confirmar que está tudo certo — não é obrigatório, mas é recomendado)

---

## Regra geral, se você não tiver certeza de nada

Rodar isso dentro de `server/` sempre resolve, nunca apaga dados existentes:
```
npx prisma migrate dev
npm run db:seed
```
Depois disso, siga o `README-INICIALIZACAO.md` pra subir o projeto.
