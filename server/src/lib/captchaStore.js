import { randomUUID } from 'crypto'

// Armazenamento em memória: suficiente para o protótipo (processo único, uso local).
// Se o servidor reiniciar, os captchas pendentes são perdidos - o usuário só precisa gerar um novo.
const captchas = new Map()
const VALIDADE_MS = 5 * 60 * 1000 // 5 minutos

function limparExpirados() {
  const agora = Date.now()
  for (const [token, dados] of captchas) {
    if (dados.expiraEm < agora) captchas.delete(token)
  }
}

export function gerarCaptcha() {
  limparExpirados()
  const a = Math.floor(Math.random() * 9) + 1
  const b = Math.floor(Math.random() * 9) + 1
  const token = randomUUID()
  captchas.set(token, { resposta: String(a + b), expiraEm: Date.now() + VALIDADE_MS })
  return { token, pergunta: `Quanto é ${a} + ${b}?` }
}

export function validarCaptcha(token, resposta) {
  limparExpirados()
  const dados = captchas.get(token)
  if (!dados) return false
  captchas.delete(token) // uso único
  return dados.resposta === String(resposta ?? '').trim()
}
