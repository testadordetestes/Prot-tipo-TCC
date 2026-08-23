import { create } from 'zustand'

// Progresso da jornada e resultado do perfil: precisam estar disponíveis
// em várias telas ao mesmo tempo (Dashboard, Jornada, Resultados, Trilha),
// por isso vivem no estado global. Populado de verdade na etapa da jornada/questionários.
export const usePerfilStore = create((set) => ({
  progressoJornada: { interesses: false, habilidades: false, perfil: false },
  resultado: null,

  definirEtapaConcluida: (etapa) =>
    set((state) => ({
      progressoJornada: { ...state.progressoJornada, [etapa]: true },
    })),

  definirResultado: (resultado) => set({ resultado }),

  resetarPerfil: () =>
    set({
      progressoJornada: { interesses: false, habilidades: false, perfil: false },
      resultado: null,
    }),
}))
