import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuthStore } from '../stores/useAuthStore.js'

function Login() {
  const navigate = useNavigate()
  const definirSessao = useAuthStore((s) => s.definirSessao)

  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')
  const [captcha, setCaptcha] = useState(null)
  const [respostaCaptcha, setRespostaCaptcha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function carregarCaptcha() {
    try {
      const dados = await api('/api/auth/captcha', { autenticado: false })
      setCaptcha(dados)
      setRespostaCaptcha('')
    } catch {
      // se falhar ao gerar captcha, o usuário só tenta de novo ao reenviar o form
    }
  }

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const dados = await api('/api/auth/login', {
        method: 'POST',
        autenticado: false,
        body: {
          username,
          senha,
          captchaToken: captcha?.captchaToken,
          captchaResposta: respostaCaptcha,
        },
      })
      definirSessao(dados.usuario, dados.token)
      navigate('/dashboard')
    } catch (erroRequisicao) {
      setErro(erroRequisicao.dados?.erro || erroRequisicao.message)
      if (erroRequisicao.dados?.exigeCaptcha) {
        carregarCaptcha()
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="tela-auth">
      <h1>Entrar</h1>
      <form onSubmit={enviar}>
        <label>
          Usuário
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </label>

        {captcha && (
          <label>
            {captcha.pergunta}
            <input
              value={respostaCaptcha}
              onChange={(e) => setRespostaCaptcha(e.target.value)}
              required
            />
          </label>
        )}

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p>
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  )
}

export default Login
