import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="pagina-placeholder">
      <h1>Dashboard</h1>
      <p>
        Aqui vai aparecer o resumo do seu progresso: resultado do perfil, próximo passo
        da jornada e simulados recentes.
      </p>
      <Link to="/jornada" className="botao-primario">Ir para a Jornada</Link>
    </div>
  )
}

export default Dashboard
