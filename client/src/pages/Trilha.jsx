import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'

function CardTrilha({ area }) {
  return (
    <div className="trilha-card">
      <div className="resultado-card-cabecalho">
        <h3>{area.nome}</h3>
        <span className="resultado-score">{area.score}%</span>
      </div>
      {area.trilha ? (
        <>
          <strong>{area.trilha.titulo}</strong>
          <p>{area.trilha.conteudo}</p>
        </>
      ) : (
        <p>Trilha ainda não disponível pra essa área.</p>
      )}
    </div>
  )
}

function Trilha() {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await api('/api/resultados')
        setDados(resposta)
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

  if (!dados?.calculado) {
    return (
      <div className="pagina-placeholder">
        <h1>Minha Trilha</h1>
        <p>Complete sua Jornada pra receber uma trilha de desenvolvimento personalizada.</p>
        <Link to="/jornada" className="botao-primario">Ir para a Jornada</Link>
      </div>
    )
  }

  return (
    <div className="pagina-placeholder">
      <h1>Minha Trilha</h1>
      <p>Passos sugeridos com base no seu resultado, pra cada área com boa compatibilidade.</p>

      {dados.destaque.length > 0 && (
        <section className="resultado-secao">
          {dados.destaque.map((area) => (
            <CardTrilha key={area.areaId} area={area} />
          ))}
        </section>
      )}

      {dados.desenvolver.length > 0 && (
        <section className="resultado-secao">
          <h2>Áreas de interesse a desenvolver</h2>
          {dados.desenvolver.map((area) => (
            <CardTrilha key={area.areaId} area={area} />
          ))}
        </section>
      )}
    </div>
  )
}

export default Trilha
