# Atualização do Protótipo

Este arquivo diz o que fazer **depois de puxar uma nova versão do código**, antes de rodar o projeto de novo. É reescrito a cada versão com os passos atuais — não é um histórico de mudanças de código, é um checklist de ação.

## Passos para atualizar (versão atual: 0.11)

1. Puxe o código mais recente do repositório.
2. Nenhuma migration ou seed novo nessa versão.
3. (Opcional, mas recomendado) Dentro de `server/`, rode os testes automatizados pra confirmar que nada quebrou:
   ```
   npm test
   ```
4. Reinicie os servidores (veja `README-INICIALIZACAO.md`).

## Histórico rápido (contexto, não é checklist)

- **0.11:** testes, correções e preparação pra apresentação — testes automatizados nas partes críticas (`npm test` em `server/`), sem mudança de banco.
- **0.10:** refinamento visual, animações e responsividade — só CSS/frontend.
- **0.9:** schema mudou (tabela `ConfiguracaoSistema` + exclusão em cascata do usuário).
- **0.8:** só código novo no frontend, sem mudança de banco.
- **0.7:** schema mudou (exclusão em cascata nas tentativas de simulado) + seed de 15 simulados.
- **0.6:** novo seed de trilhas.
- **0.5:** novo seed de perguntas do questionário.
- **0.3:** schema mudou (campos de bloqueio de login).

Se algum dia você não tiver certeza se está tudo em dia, rodar `npx prisma migrate dev` seguido de `npm run db:seed` sempre é seguro — nenhum dos dois apaga dados existentes.
