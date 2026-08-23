import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { usePerfilStore } from '../stores/usePerfilStore.js'

function CardArea({ area }) {
  return (
    <div className="resultado-card">
      <div className="resultado-card-cabecalho">
        <h3>{area.nome}</h3>
        <span className="resultado-score">{area.score}%</span>
      </div>
      {area.subareas?.length > 0 && (
        <p className="resultado-subareas">{area.subareas.join(' · ')}</p>
      )}
      {area.trilha && (
        <div className="resultado-trilha">
          <strong>{area.trilha.titulo}</strong>
          <p>{area.trilha.descricao}</p>
        </div>
      )}
    </div>
  )
}

function Resultados() {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [mostrarVerMais, setMostrarVerMais] = useState(false)
  const definirResultado = usePerfilStore((s) => s.definirResultado)

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await api('/api/resultados')
        setDados(resposta)
        if (resposta.calculado) definirResultado(resposta)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [definirResultado])

  if (carregando) {
    return (
      <div className="pagina-placeholder">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!dados?.calculado) {
    return (
      <div className="pagina-placeholder">
        <h1>Resultados</h1>
        <p>Complete as 3 etapas da sua Jornada pra ver suas áreas com mais compatibilidade.</p>
        <Link to="/jornada" className="botao-primario">Ir para a Jornada</Link>
      </div>
    )
  }

  return (
    <div className="pagina-placeholder">
      <h1>Seus Resultados</h1>
      <p>Baseado nas suas respostas, essas são as áreas com mais compatibilidade com o seu perfil.</p>

      {dados.destaque.length > 0 && (
        <section className="resultado-secao">
          <h2>Suas áreas com mais compatibilidade</h2>
          <div className="resultado-grade">
            {dados.destaque.map((area) => (
              <CardArea key={area.areaId} area={area} />
            ))}
          </div>
        </section>
      )}

      {dados.verMais.length > 0 && (
        <section className="resultado-secao">
          <button className="botao-secundario" onClick={() => setMostrarVerMais((v) => !v)}>
            {mostrarVerMais ? 'Ocultar outras áreas' : `Ver mais ${dados.verMais.length} área(s)`}
          </button>
          {mostrarVerMais && (
            <div className="resultado-grade">
              {dados.verMais.map((area) => (
                <CardArea key={area.areaId} area={area} />
              ))}
            </div>
          )}
        </section>
      )}

      {dados.desenvolver.length > 0 && (
        <section className="resultado-secao">
          <h2>Áreas de interesse a desenvolver</h2>
          <p>
            Mesmo com pouca habilidade ainda, seu interesse nessas áreas é notável — vale
            explorar como próximo passo de desenvolvimento.
          </p>
          <div className="resultado-grade">
            {dados.desenvolver.map((area) => (
              <CardArea key={area.areaId} area={area} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Resultados
