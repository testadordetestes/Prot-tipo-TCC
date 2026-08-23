import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore.js'

function RotaProtegida() {
  const usuario = useAuthStore((s) => s.usuario)
  const carregando = useAuthStore((s) => s.carregando)

  if (carregando) {
    return <div className="carregando-tela">Carregando...</div>
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default RotaProtegida
