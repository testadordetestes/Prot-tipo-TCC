import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuthStore } from '../stores/useAuthStore.js'

function Cadastro() {
  const navigate = useNavigate()
  const definirSessao = useAuthStore((s) => s.definirSessao)

  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')
  const [erros, setErros] = useState([])
  const [carregando, setCarregando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setErros([])
    setCarregando(true)

    try {
      const dados = await api('/api/auth/cadastro', {
        method: 'POST',
        autenticado: false,
        body: { username, senha },
      })
      definirSessao(dados.usuario, dados.token)
      navigate('/dashboard')
    } catch (erroRequisicao) {
      setErros(erroRequisicao.dados?.erros || [erroRequisicao.dados?.erro || erroRequisicao.message])
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="tela-auth">
      <h1>Criar conta</h1>
      <form onSubmit={enviar}>
        <label>
          Usuário
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </label>

        {erros.length > 0 && (
          <ul className="erro">
            {erros.map((erro) => (
              <li key={erro}>{erro}</li>
            ))}
          </ul>
        )}

        <button type="submit" disabled={carregando}>
          {carregando ? 'Criando...' : 'Criar conta'}
        </button>
      </form>
      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  )
}

export default Cadastro
