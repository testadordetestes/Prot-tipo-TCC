import { useAuthStore } from '../stores/useAuthStore.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function api(path, { method = 'GET', body, autenticado = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (autenticado) {
    const token = useAuthStore.getState().token
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const resposta = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const novoToken = resposta.headers.get('x-renewed-token')
  if (novoToken) {
    useAuthStore.getState().atualizarToken(novoToken)
  }

  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    const erro = new Error(dados?.erro || 'Erro na requisição.')
    erro.dados = dados
    erro.status = resposta.status
    throw erro
  }

  return dados
}
