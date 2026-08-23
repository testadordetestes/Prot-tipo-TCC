import { Link } from 'react-router-dom'

function NaoEncontrado() {
  return (
    <div className="landing">
      <h1>Página não encontrada</h1>
      <p>O endereço que você tentou acessar não existe.</p>
      <Link to="/" className="botao-primario">Voltar ao início</Link>
    </div>
  )
}

export default NaoEncontrado
