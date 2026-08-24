# Atualização do Protótipo

Este arquivo diz o que fazer **depois de puxar uma nova versão do código**, antes de rodar o projeto de novo. É reescrito a cada versão com os passos atuais — não é um histórico de mudanças de código, é um checklist de ação.

## Passos para atualizar (versão atual: 0.8)

1. Puxe o código mais recente do repositório.
2. Nenhuma migration ou seed novo nessa versão — só reinicie os servidores (veja `README-INICIALIZACAO.md`).

## Histórico rápido (contexto, não é checklist)

- **0.8:** só código novo no frontend (Preparação, Minha Trilha, Dashboard, Meu Perfil) — nenhuma mudança de banco.
- **0.7:** schema mudou (exclusão em cascata nas tentativas de simulado) + seed de 15 simulados.
- **0.6:** novo seed de trilhas.
- **0.5:** novo seed de perguntas do questionário.
- **0.3:** schema mudou (campos de bloqueio de login) — precisou `npx prisma migrate dev`.

Se algum dia você não tiver certeza se está tudo em dia, rodar `npx prisma migrate dev` seguido de `npm run db:seed` sempre é seguro — nenhum dos dois apaga dados existentes.
