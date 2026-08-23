import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'

function Simulados() {
  const [simulados, setSimulados] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await api('/api/simulados')
        setSimulados(dados.simulados)
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

  return (
    <div className="pagina-placeholder">
      <h1>Simulados</h1>
      <p>Pratique situações de processos seletivos. O histórico guarda suas últimas 5 tentativas em cada simulado.</p>

      <div className="simulados-lista">
        {simulados.map((s) => (
          <div key={s.id} className={`simulado-card ${!s.disponivel ? 'simulado-card-bloqueado' : ''}`}>
            <div className="simulado-card-cabecalho">
              <h3>{s.titulo}</h3>
              {!s.disponivel && <span className="jornada-selo jornada-selo-bloqueada">Bloqueado</span>}
            </div>
            <p>{s.descricao}</p>
            <div className="simulado-card-rodape">
              <span>{s.totalQuestoes} questões</span>
              {s.ultimaNota !== null && <span>Última nota: {s.ultimaNota}%</span>}
            </div>
            {s.disponivel ? (
              <Link to={`/simulados/${s.id}`} className="botao-primario">
                {s.ultimaNota !== null ? 'Refazer' : 'Começar'}
              </Link>
            ) : (
              <button className="botao-secundario" disabled>
                Complete a Jornada com essa área em destaque
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Simulados
