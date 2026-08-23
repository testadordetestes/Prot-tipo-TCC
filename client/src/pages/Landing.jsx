import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className="landing">
      <h1>Descubra sua área, no seu ritmo.</h1>
      <p>
        Um jeito diferente de pensar sobre o seu futuro profissional: sem apontar uma
        profissão pronta, mas mostrando áreas com a sua cara e um caminho pra desenvolver
        o que você já gosta.
      </p>
      <div className="landing-acoes">
        <Link to="/cadastro" className="botao-primario">Começar agora</Link>
        <Link to="/login" className="botao-secundario">Já tenho conta</Link>
      </div>
    </div>
  )
}

export default Landing
