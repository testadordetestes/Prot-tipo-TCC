import { prisma } from '../lib/prisma.js'

const ETAPAS_ORDEM = ['INTERESSES', 'HABILIDADES', 'PERFIL']

export async function obterProgresso(usuarioId) {
  const progresso = {}

  for (const etapa of ETAPAS_ORDEM) {
    const total = await prisma.pergunta.count({ where: { etapa } })
    const respondidas = await prisma.respostaQuestionario.count({
      where: { usuarioId, pergunta: { etapa } },
    })
    progresso[etapa] = { total, respondidas, concluida: total > 0 && respondidas >= total }
  }

  return progresso
}

export async function etapaDesbloqueada(usuarioId, etapa) {
  const indice = ETAPAS_ORDEM.indexOf(etapa)
  if (indice <= 0) return true

  const progresso = await obterProgresso(usuarioId)
  for (let i = 0; i < indice; i++) {
    if (!progresso[ETAPAS_ORDEM[i]].concluida) return false
  }
  return true
}

export async function listarPerguntasEtapa(usuarioId, etapa) {
  const perguntas = await prisma.pergunta.findMany({
    where: { etapa },
    orderBy: { ordem: 'asc' },
    include: {
      alternativas: { orderBy: { ordem: 'asc' } },
    },
  })

  const respostas = await prisma.respostaQuestionario.findMany({
    where: { usuarioId, pergunta: { etapa } },
  })
  const respostaPorPergunta = Object.fromEntries(respostas.map((r) => [r.perguntaId, r.alternativaId]))

  return perguntas.map((p) => ({
    id: p.id,
    enunciado: p.enunciado,
    ordem: p.ordem,
    alternativas: p.alternativas.map((a) => ({ id: a.id, texto: a.texto, ordem: a.ordem })),
    respostaAtual: respostaPorPergunta[p.id] || null,
  }))
}

export async function registrarResposta(usuarioId, perguntaId, alternativaId) {
  const pergunta = await prisma.pergunta.findUnique({ where: { id: perguntaId } })
  if (!pergunta) {
    const erro = new Error('Pergunta não encontrada.')
    erro.status = 404
    throw erro
  }

  const desbloqueada = await etapaDesbloqueada(usuarioId, pergunta.etapa)
  if (!desbloqueada) {
    const erro = new Error('Essa etapa ainda não foi liberada.')
    erro.status = 403
    throw erro
  }

  await prisma.respostaQuestionario.upsert({
    where: { usuarioId_perguntaId: { usuarioId, perguntaId } },
    update: { alternativaId, neutra: false },
    create: { usuarioId, perguntaId, alternativaId },
  })

  return obterProgresso(usuarioId)
}
