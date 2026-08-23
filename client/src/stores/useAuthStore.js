import { create } from 'zustand'

const TOKEN_KEY = 'prototipo_tcc_token'

export const useAuthStore = create((set) => ({
  usuario: null,
  token: localStorage.getItem(TOKEN_KEY) || null,
  carregando: true,

  definirSessao: (usuario, token) => {
    localStorage.setItem(TOKEN_KEY, token)
    set({ usuario, token, carregando: false })
  },

  definirUsuarioCarregado: (usuario) => {
    set({ usuario, carregando: false })
  },

  atualizarToken: (novoToken) => {
    localStorage.setItem(TOKEN_KEY, novoToken)
    set({ token: novoToken })
  },

  encerrarSessao: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ usuario: null, token: null, carregando: false })
  },
}))
