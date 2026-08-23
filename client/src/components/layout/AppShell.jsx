import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useThemeStore } from '../../stores/useThemeStore.js'

const ABAS = [
  { rota: '/dashboard', rotulo: 'Dashboard' },
  { rota: '/jornada', rotulo: 'Jornada' },
  { rota: '/resultados', rotulo: 'Resultados' },
  { rota: '/trilha', rotulo: 'Minha Trilha' },
  { rota: '/simulados', rotulo: 'Simulados' },
  { rota: '/preparacao', rotulo: 'Preparação' },
  { rota: '/perfil', rotulo: 'Meu Perfil' },
]

function AppShell() {
  const navigate = useNavigate()
  const usuario = useAuthStore((s) => s.usuario)
  const encerrarSessao = useAuthStore((s) => s.encerrarSessao)
  const tema = useThemeStore((s) => s.tema)
  const alternarTema = useThemeStore((s) => s.alternarTema)

  function sair() {
    encerrarSessao()
    navigate('/login')
  }

  return (
    <div className="app-shell-autenticado">
      <aside className="barra-lateral">
        <div className="marca">Protótipo TCC</div>
        <nav>
          {ABAS.map((aba) => (
            <NavLink
              key={aba.rota}
              to={aba.rota}
              className={({ isActive }) => (isActive ? 'ativo' : '')}
            >
              {aba.rotulo}
            </NavLink>
          ))}
        </nav>
        <div className="barra-lateral-rodape">
          <button onClick={alternarTema}>
            {tema === 'claro' ? 'Modo escuro' : 'Modo claro'}
          </button>
          <span>{usuario?.username}</span>
          <button onClick={sair}>Sair</button>
        </div>
      </aside>
      <main className="conteudo-principal">
        <Outlet />
      </main>
    </div>
  )
}

export default AppShell
