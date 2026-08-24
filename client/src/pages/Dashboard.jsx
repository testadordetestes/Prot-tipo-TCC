import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuthStore } from '../stores/useAuthStore.js'

function Dashboard() {
  const usuario = useAuthStore((s) => s.usuario)
  const [progresso, setProgresso] = useState(null)
  const [resultados, setResultados] = useState(null)
  const [simulados, setSimulados] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const [progressoDados, resultadosDados, simuladosDados] = await Promise.all([
          api('/api/questionario/progresso'),
          api('/api/resultados'),
          api('/api/simulados'),
        ])
        setProgresso(progressoDados.progresso)
        setResultados(resultadosDados)
        setSimulados(simuladosDados.simulados)
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

  const jornadaCompleta = progresso?.PERFIL?.concluida
  const etapasConcluidas = ['INTERESSES', 'HABILIDADES', 'PERFIL'].filter(
    (e) => progresso?.[e]?.concluida
  ).length
  const percentualJornada = Math.round((etapasConcluidas / 3) * 100)

  const topArea = resultados?.destaque?.[0]
  const simuladoSugerido =
    simulados.find((s) => s.disponivel && s.ultimaNota === null) ||
    simulados.find((s) => s.disponivel)

  return (
    <div className="pagina-placeholder">
      <h1>Olá, {usuario?.username}</h1>

      {!jornadaCompleta ? (
        <div className="dashboard-card">
          <h2>Continue sua Jornada</h2>
          <p>Você já completou {etapasConcluidas} de 3 etapas.</p>
          <div className="barra-progresso">
            <div className="barra-progresso-preenchida" style={{ width: `${percentualJornada}%` }} />
          </div>
          <Link to="/jornada" className="botao-primario">Continuar</Link>
        </div>
      ) : (
        <div className="dashboard-grade">
          {topArea && (
            <div className="dashboard-card">
              <h2>Sua área com mais compatibilidade</h2>
              <p className="dashboard-destaque">{topArea.nome} — {topArea.score}%</p>
              <Link to="/resultados" className="botao-primario">Ver todos os resultados</Link>
            </div>
          )}

          {simuladoSugerido && (
            <div className="dashboard-card">
              <h2>Pratique um simulado</h2>
              <p>{simuladoSugerido.titulo}</p>
              <Link to={`/simulados/${simuladoSugerido.id}`} className="botao-primario">
                {simuladoSugerido.ultimaNota !== null ? 'Refazer' : 'Começar'}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard
