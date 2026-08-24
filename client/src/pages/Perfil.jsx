import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { useAuthStore } from '../stores/useAuthStore.js'

function Perfil() {
  const usuario = useAuthStore((s) => s.usuario)
  const [detalhes, setDetalhes] = useState(null)

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await api('/api/auth/me')
        setDetalhes(dados.usuario)
      } catch {
        // segue com o que já tem no store, sem quebrar a página
      }
    }
    carregar()
  }, [])

  const criadoEm = detalhes?.criadoEm
    ? new Date(detalhes.criadoEm).toLocaleDateString('pt-BR')
    : null

  return (
    <div className="pagina-placeholder">
      <h1>Meu Perfil</h1>
      <div className="dashboard-card">
        <p><strong>Usuário:</strong> {usuario?.username}</p>
        {criadoEm && <p><strong>Conta criada em:</strong> {criadoEm}</p>}
      </div>
      <p>Configurações de conta (trocar senha, editar dados) chegam numa etapa mais à frente.</p>
    </div>
  )
}

export default Perfil
