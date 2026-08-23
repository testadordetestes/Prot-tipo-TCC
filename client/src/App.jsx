import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Perfil from './pages/Perfil.jsx'
import Jornada from './pages/Jornada.jsx'
import JornadaEtapa from './pages/JornadaEtapa.jsx'
import Resultados from './pages/Resultados.jsx'
import Trilha from './pages/Trilha.jsx'
import Simulados from './pages/Simulados.jsx'
import SimuladoTentativa from './pages/SimuladoTentativa.jsx'
import Preparacao from './pages/Preparacao.jsx'
import NaoEncontrado from './pages/NaoEncontrado.jsx'
import RotaProtegida from './components/RotaProtegida.jsx'
import AppShell from './components/layout/AppShell.jsx'
import { useAuthStore } from './stores/useAuthStore.js'
import { useThemeStore } from './stores/useThemeStore.js'
import { api } from './lib/api.js'

function App() {
  const token = useAuthStore((s) => s.token)
  const definirUsuarioCarregado = useAuthStore((s) => s.definirUsuarioCarregado)
  const aplicarTemaInicial = useThemeStore((s) => s.aplicarTemaInicial)

  useEffect(() => {
    aplicarTemaInicial()
  }, [aplicarTemaInicial])

  useEffect(() => {
    async function carregarSessao() {
      if (!token) {
        definirUsuarioCarregado(null)
        return
      }
      try {
        const dados = await api('/api/auth/me')
        definirUsuarioCarregado(dados.usuario)
      } catch {
        definirUsuarioCarregado(null)
      }
    }
    carregarSessao()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<RotaProtegida />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/jornada" element={<Jornada />} />
          <Route path="/jornada/:etapa" element={<JornadaEtapa />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/trilha" element={<Trilha />} />
          <Route path="/simulados" element={<Simulados />} />
          <Route path="/simulados/:id" element={<SimuladoTentativa />} />
          <Route path="/preparacao" element={<Preparacao />} />
        </Route>
      </Route>

      <Route path="*" element={<NaoEncontrado />} />
    </Routes>
  )
}

export default App
