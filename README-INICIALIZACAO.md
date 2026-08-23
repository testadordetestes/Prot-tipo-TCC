# Inicialização do Protótipo

Use este guia sempre que for **abrir o projeto num dia normal**, com o ambiente já configurado e as atualizações em dia (veja `README-ATUALIZACAO.md` se acabou de puxar uma versão nova, ou `README.md` se é a primeira vez nessa máquina).

## Passo 1 — Backend

Em um terminal:
```
cd server
npm run dev
```
Deve aparecer: `Servidor rodando na porta 3333`.

## Passo 2 — Frontend

Em outro terminal (deixe o do backend aberto):
```
cd client
npm run dev
```

## Passo 3 — Acessar

Abra **http://localhost:5173** no navegador.

## Conferindo se está tudo certo

- **http://localhost:3333/api/health** deve retornar `{"status":"ok"}`
- A landing page do protótipo deve aparecer normalmente em `http://localhost:5173`

Se algo não funcionar, confira a seção de problemas comuns no `README.md` principal ou revise o `README-ATUALIZACAO.md`.
