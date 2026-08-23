import { create } from 'zustand'

const THEME_KEY = 'prototipo_tcc_tema'

function obterTemaInicial() {
  const salvo = localStorage.getItem(THEME_KEY)
  if (salvo) return salvo
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

export const useThemeStore = create((set, get) => ({
  tema: obterTemaInicial(),

  alternarTema: () => {
    const novoTema = get().tema === 'claro' ? 'escuro' : 'claro'
    localStorage.setItem(THEME_KEY, novoTema)
    document.documentElement.setAttribute('data-tema', novoTema)
    set({ tema: novoTema })
  },

  aplicarTemaInicial: () => {
    document.documentElement.setAttribute('data-tema', get().tema)
  },
}))
