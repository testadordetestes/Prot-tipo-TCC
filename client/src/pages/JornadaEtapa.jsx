import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { usePerfilStore } from '../stores/usePerfilStore.js'

const TITULOS = {
  interesses: 'Interesses',
  habilidades: 'Habilidades',
  perfil: 'Perfil',
}

function JornadaEtapa() {
  const { etapa } = useParams()
  const navigate = useNavigate()
  const definirEtapaConcluida = usePerfilStore((s) => s.definirEtapaConcluida)

  const [perguntas, setPerguntas] = useState([])
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [resultadoPronto, setResultadoPronto] = useState(false)

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const dados = await api(`/api/questionario/${etapa}`)
        setPerguntas(dados.perguntas)
        const indicePrimeiraNaoRespondida = dados.perguntas.findIndex((p) => !p.respostaAtual)
        setIndiceAtual(
          indicePrimeiraNaoRespondida === -1
            ? Math.max(0, dados.perguntas.length - 1)
            : indicePrimeiraNaoRespondida
        )
      } catch (erroRequisicao) {
        if (erroRequisicao.status === 403) {
          navigate('/jornada')
          return
        }
        setErro(erroRequisicao.dados?.erro || erroRequisicao.message)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [etapa, navigate])

  async function escolherAlternativa(perguntaId, alternativaId) {
    setEnviando(true)
    setErro('')

    setPerguntas((atual) =>
      atual.map((p) => (p.id === perguntaId ? { ...p, respostaAtual: alternativaId } : p))
    )

    try {
      const dados = await api('/api/questionario/resposta', {
        method: 'POST',
        body: { perguntaId, alternativaId },
      })

      const etapaEnum = etapa.toUpperCase()
      if (dados.progresso[etapaEnum]?.concluida) {
        definirEtapaConcluida(etapa)
      }
      if (dados.resultadoCalculado) {
        setResultadoPronto(true)
      }
    } catch (erroRequisicao) {
      setErro(erroRequisicao.dados?.erro || erroRequisicao.message)
    } finally {
      setEnviando(false)
    }
  }

  function avancar() {
    if (indiceAtual < perguntas.length - 1) {
      setIndiceAtual((i) => i + 1)
    } else if (resultadoPronto) {
      navigate('/resultados')
    } else {
      navigate('/jornada')
    }
  }

  function voltar() {
    if (indiceAtual > 0) setIndiceAtual((i) => i - 1)
  }

  if (carregando) {
    return (
      <div className="pagina-placeholder">
        <p>Carregando...</p>
      </div>
    )
  }

  if (perguntas.length === 0) {
    return (
      <div className="pagina-placeholder">
        <p>Nenhuma pergunta encontrada para essa etapa ainda.</p>
        <Link to="/jornada">Voltar</Link>
      </div>
    )
  }

  const pergunta = perguntas[indiceAtual]
  const progresso = ((indiceAtual + 1) / perguntas.length) * 100

  return (
    <div className="quiz-etapa">
      <div className="quiz-cabecalho">
        <Link to="/jornada" className="quiz-voltar-link">← Jornada</Link>
        <h1>{TITULOS[etapa]}</h1>
        <span>{indiceAtual + 1} de {perguntas.length}</span>
      </div>

      <div className="barra-progresso">
        <div className="barra-progresso-preenchida" style={{ width: `${progresso}%` }} />
      </div>

      <p className="quiz-enunciado">{pergunta.enunciado}</p>

      <div className="quiz-alternativas">
        {pergunta.alternativas.map((alt) => (
          <button
            key={alt.id}
            className={`quiz-alternativa ${pergunta.respostaAtual === alt.id ? 'selecionada' : ''}`}
            onClick={() => escolherAlternativa(pergunta.id, alt.id)}
            disabled={enviando}
          >
            {alt.texto}
          </button>
        ))}
      </div>

      {erro && <p className="erro">{erro}</p>}

      <div className="quiz-navegacao">
        <button onClick={voltar} disabled={indiceAtual === 0} className="botao-secundario">
          Voltar
        </button>
        <button onClick={avancar} disabled={!pergunta.respostaAtual} className="botao-primario">
          {indiceAtual === perguntas.length - 1 ? 'Concluir' : 'Próxima'}
        </button>
      </div>
    </div>
  )
}

export default JornadaEtapa
