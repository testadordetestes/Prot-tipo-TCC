import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api.js'

function SimuladoTentativa() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [fase, setFase] = useState('carregando')
  const [tentativaId, setTentativaId] = useState(null)
  const [questoes, setQuestoes] = useState([])
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [respostas, setRespostas] = useState({})
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    async function iniciar() {
      try {
        const dados = await api(`/api/simulados/${id}/iniciar`, { method: 'POST' })
        setTentativaId(dados.tentativaId)
        setQuestoes(dados.questoes)
        setFase('perguntas')
      } catch (erroRequisicao) {
        if (erroRequisicao.status === 403) {
          navigate('/simulados')
          return
        }
        setErro(erroRequisicao.dados?.erro || erroRequisicao.message)
        setFase('erro')
      }
    }
    iniciar()
  }, [id, navigate])

  async function escolher(questaoId, alternativaId) {
    setRespostas((atual) => ({ ...atual, [questaoId]: alternativaId }))
    try {
      await api(`/api/simulados/tentativas/${tentativaId}/responder`, {
        method: 'POST',
        body: { questaoSimuladoId: questaoId, alternativaId },
      })
    } catch (erroRequisicao) {
      setErro(erroRequisicao.dados?.erro || erroRequisicao.message)
    }
  }

  async function avancar() {
    if (indiceAtual < questoes.length - 1) {
      setIndiceAtual((i) => i + 1)
      return
    }

    setEnviando(true)
    try {
      const dados = await api(`/api/simulados/tentativas/${tentativaId}/finalizar`, { method: 'POST' })
      setResultado(dados)
      setFase('resultado')
    } catch (erroRequisicao) {
      setErro(erroRequisicao.dados?.erro || erroRequisicao.message)
    } finally {
      setEnviando(false)
    }
  }

  function voltar() {
    if (indiceAtual > 0) setIndiceAtual((i) => i - 1)
  }

  if (fase === 'carregando') {
    return (
      <div className="pagina-placeholder">
        <p>Carregando...</p>
      </div>
    )
  }

  if (fase === 'erro') {
    return (
      <div className="pagina-placeholder">
        <p className="erro">{erro}</p>
        <Link to="/simulados">Voltar</Link>
      </div>
    )
  }

  if (fase === 'resultado') {
    return (
      <div className="quiz-etapa">
        <h1>Resultado: {resultado.nota}%</h1>
        <p>{resultado.acertos} de {resultado.total} questões corretas.</p>

        <div className="simulado-gabarito">
          {resultado.detalhes.map((d, i) => (
            <div key={d.questaoId} className="simulado-gabarito-item">
              <p className="quiz-enunciado">{i + 1}. {d.enunciado}</p>
              {d.alternativas.map((a) => {
                const escolhida = a.id === d.alternativaEscolhidaId
                const classe = a.correta
                  ? 'simulado-alternativa-correta'
                  : escolhida
                    ? 'simulado-alternativa-errada'
                    : ''
                return (
                  <div key={a.id} className={`simulado-alternativa-resultado ${classe}`}>
                    <p>
                      {a.texto}{' '}
                      {escolhida && !a.correta ? '(sua resposta)' : ''}
                      {a.correta ? '(correta)' : ''}
                    </p>
                    {a.explicacao && <p className="simulado-explicacao">{a.explicacao}</p>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <Link to="/simulados" className="botao-primario">Voltar aos simulados</Link>
      </div>
    )
  }

  const questao = questoes[indiceAtual]
  const progresso = ((indiceAtual + 1) / questoes.length) * 100

  return (
    <div className="quiz-etapa">
      <div className="quiz-cabecalho">
        <Link to="/simulados" className="quiz-voltar-link">← Simulados</Link>
        <span>{indiceAtual + 1} de {questoes.length}</span>
      </div>

      <div className="barra-progresso">
        <div className="barra-progresso-preenchida" style={{ width: `${progresso}%` }} />
      </div>

      <p className="quiz-enunciado">{questao.enunciado}</p>

      <div className="quiz-alternativas">
        {questao.alternativas.map((alt) => (
          <button
            key={alt.id}
            className={`quiz-alternativa ${respostas[questao.id] === alt.id ? 'selecionada' : ''}`}
            onClick={() => escolher(questao.id, alt.id)}
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
        <button onClick={avancar} disabled={!respostas[questao.id] || enviando} className="botao-primario">
          {indiceAtual === questoes.length - 1 ? 'Finalizar' : 'Próxima'}
        </button>
      </div>
    </div>
  )
}

export default SimuladoTentativa
