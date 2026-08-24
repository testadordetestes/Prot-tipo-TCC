import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuthStore } from '../stores/useAuthStore.js'

function Perfil() {
  const usuario = useAuthStore((s) => s.usuario)
  const encerrarSessao = useAuthStore((s) => s.encerrarSessao)
  const navigate = useNavigate()

  const [detalhes, setDetalhes] = useState(null)

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [mensagemSenha, setMensagemSenha] = useState('')
  const [erroSenha, setErroSenha] = useState('')

  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)

  const [config, setConfig] = useState(null)
  const [mensagemConfig, setMensagemConfig] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const [meDados, configDados] = await Promise.all([
          api('/api/auth/me'),
          api('/api/configuracoes'),
        ])
        setDetalhes(meDados.usuario)
        setConfig(configDados.configuracoes)
      } catch {
        // página segue funcionando mesmo se algo aqui falhar
      }
    }
    carregar()
  }, [])

  async function trocarSenha(e) {
    e.preventDefault()
    setErroSenha('')
    setMensagemSenha('')
    try {
      await api('/api/auth/senha', { method: 'PUT', body: { senhaAtual, novaSenha } })
      setMensagemSenha('Senha atualizada com sucesso.')
      setSenhaAtual('')
      setNovaSenha('')
    } catch (erroRequisicao) {
      setErroSenha(erroRequisicao.dados?.erro || erroRequisicao.message)
    }
  }

  async function excluirConta() {
    await api('/api/auth/conta', { method: 'DELETE' })
    encerrarSessao()
    navigate('/')
  }

  async function salvarConfiguracoes(e) {
    e.preventDefault()
    setMensagemConfig('')
    await Promise.all(
      Object.entries(config).map(([chave, valor]) =>
        api('/api/configuracoes', { method: 'PUT', body: { chave, valor } })
      )
    )
    setMensagemConfig('Configurações salvas.')
  }

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

      <section className="preparacao-secao">
        <h2>Segurança da conta</h2>
        <form onSubmit={trocarSenha} className="tela-auth form-estreito">
          <label>
            Senha atual
            <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} required />
          </label>
          <label>
            Nova senha
            <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required />
          </label>
          {erroSenha && <p className="erro">{erroSenha}</p>}
          {mensagemSenha && <p className="simulado-explicacao">{mensagemSenha}</p>}
          <button type="submit" className="botao-primario">Trocar senha</button>
        </form>

        {!confirmandoExclusao ? (
          <button className="botao-secundario" onClick={() => setConfirmandoExclusao(true)}>
            Excluir minha conta
          </button>
        ) : (
          <div className="dashboard-card">
            <p>
              Tem certeza? Isso apaga sua conta e todos os seus dados (respostas, resultados,
              tentativas) permanentemente.
            </p>
            <div className="acoes-linha">
              <button className="botao-secundario" onClick={() => setConfirmandoExclusao(false)}>
                Cancelar
              </button>
              <button className="botao-primario" onClick={excluirConta}>
                Sim, excluir
              </button>
            </div>
          </div>
        )}
      </section>

      {config && (
        <section className="preparacao-secao">
          <h2>Administração técnica</h2>
          <p>
            Parâmetros técnicos do sistema — útil, por exemplo, pra reduzir o tempo de sessão na
            hora de apresentar o TCC.
          </p>
          <form onSubmit={salvarConfiguracoes} className="tela-auth form-estreito">
            <label>
              Duração da sessão (minutos)
              <input
                type="number"
                min="1"
                value={config.sessao_duracao_minutos}
                onChange={(e) => setConfig({ ...config, sessao_duracao_minutos: e.target.value })}
              />
            </label>
            <label>
              Tentativas de login antes do bloqueio
              <input
                type="number"
                min="1"
                value={config.limite_tentativas_login}
                onChange={(e) => setConfig({ ...config, limite_tentativas_login: e.target.value })}
              />
            </label>
            <label>
              Duração do bloqueio (minutos)
              <input
                type="number"
                min="1"
                value={config.bloqueio_minutos}
                onChange={(e) => setConfig({ ...config, bloqueio_minutos: e.target.value })}
              />
            </label>
            <label>
              Tentativas antes de exigir captcha
              <input
                type="number"
                min="0"
                value={config.tentativas_para_captcha}
                onChange={(e) => setConfig({ ...config, tentativas_para_captcha: e.target.value })}
              />
            </label>
            {mensagemConfig && <p className="simulado-explicacao">{mensagemConfig}</p>}
            <button type="submit" className="botao-primario">Salvar configurações</button>
          </form>
        </section>
      )}
    </div>
  )
}

export default Perfil
