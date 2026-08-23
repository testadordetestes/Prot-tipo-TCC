import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'

const ETAPAS = [
  { chave: 'interesses', titulo: 'Interesses', descricao: 'O que te chama atenção de verdade.' },
  { chave: 'habilidades', titulo: 'Habilidades', descricao: 'Onde você já se sente mais capaz.' },
  { chave: 'perfil', titulo: 'Perfil', descricao: 'Como você pensa, trabalha e prefere viver o dia a dia.' },
]

function Jornada() {
  const [progresso, setProgresso] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await api('/api/questionario/progresso')
        setProgresso(dados.progresso)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  if (carregando) {
    return (
      <div className="pagina-placeholder">
        <p>Carregando...</p>
      </div>
    )
  }

  function statusEtapa(indice, chave) {
    const chaveEnum = chave.toUpperCase()
    const dadosEtapa = progresso?.[chaveEnum]
    if (!dadosEtapa) return 'bloqueada'
    if (dadosEtapa.concluida) return 'concluida'
    if (indice === 0) return 'disponivel'

    const anteriorChave = ETAPAS[indice - 1].chave.toUpperCase()
    return progresso?.[anteriorChave]?.concluida ? 'disponivel' : 'bloqueada'
  }

  return (
    <div className="pagina-placeholder">
      <h1>Sua Jornada</h1>
      <p>Responda as 3 etapas, na ordem, para descobrir suas áreas com mais compatibilidade.</p>

      <div className="jornada-etapas">
        {ETAPAS.map((etapa, indice) => {
          const status = statusEtapa(indice, etapa.chave)
          const dadosEtapa = progresso?.[etapa.chave.toUpperCase()]
          const percentual = dadosEtapa && dadosEtapa.total > 0
            ? Math.round((dadosEtapa.respondidas / dadosEtapa.total) * 100)
            : 0

          return (
            <div key={etapa.chave} className={`jornada-card jornada-card-${status}`}>
              <div className="jornada-card-cabecalho">
                <h2>{etapa.titulo}</h2>
                {status === 'concluida' && <span className="jornada-selo">Concluída</span>}
                {status === 'bloqueada' && <span className="jornada-selo jornada-selo-bloqueada">Bloqueada</span>}
              </div>
              <p>{etapa.descricao}</p>

              {status !== 'bloqueada' && (
                <div className="barra-progresso">
                  <div className="barra-progresso-preenchida" style={{ width: `${percentual}%` }} />
                </div>
              )}

              {status === 'bloqueada' ? (
                <button className="botao-secundario" disabled>Complete a etapa anterior</button>
              ) : (
                <Link to={`/jornada/${etapa.chave}`} className="botao-primario">
                  {status === 'concluida' ? 'Revisar respostas' : percentual > 0 ? 'Continuar' : 'Começar'}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Jornada
