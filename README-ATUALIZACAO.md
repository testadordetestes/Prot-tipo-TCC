# Atualização do Protótipo

Este arquivo diz o que fazer **depois de puxar uma nova versão do código**, antes de rodar o projeto de novo. É reescrito a cada versão com os passos atuais — não é um histórico de mudanças de código, é um checklist de ação.

## Passos para atualizar (versão atual: 0.7)

1. Puxe o código mais recente do repositório.
2. Dentro de `server/`, rode:
   ```
   npx prisma migrate dev
   ```
   (O schema do banco mudou nessa versão — isso aplica a mudança sem apagar seus dados existentes.)
3. Ainda dentro de `server/`, rode:
   ```
   npm run db:seed
   ```
   (Adicionou os 15 simulados novos ao banco — seguro rodar de novo, não duplica nada.)
4. Pronto. Agora siga o `README-INICIALIZACAO.md` pra subir o projeto.

## Histórico rápido (contexto, não é checklist)

- **0.7:** schema mudou (exclusão em cascata nas tentativas de simulado) + seed de 15 simulados.
- **0.6:** novo seed de trilhas.
- **0.5:** novo seed de perguntas do questionário.
- **0.3:** schema mudou (campos de bloqueio de login) — precisou `npx prisma migrate dev`.

Se algum dia você não tiver certeza se está tudo em dia, rodar `npx prisma migrate dev` seguido de `npm run db:seed` sempre é seguro — nenhum dos dois apaga dados existentes.
