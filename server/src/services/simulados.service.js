import { prisma } from '../lib/prisma.js'

const LIMITE_HISTORICO = 5

export async function listarSimuladosDisponiveis(usuarioId) {
  const resultadosDestaque = await prisma.resultadoArea.findMany({
    where: { usuarioId, faixa: 'ALTA', interesseAltoHabilidadeBaixa: false },
    select: { areaId: true },
  })
  const areasDestaqueIds = new Set(resultadosDestaque.map((r) => r.areaId))

  const simulados = await prisma.simulado.findMany({
    include: {
      area: true,
      questoes: { select: { id: true } },
      tentativas: {
        where: { usuarioId, finalizadoEm: { not: null } },
        orderBy: { finalizadoEm: 'desc' },
        take: 1,
      },
    },
  })

  return simulados
    .map((s) => ({
      id: s.id,
      titulo: s.titulo,
      descricao: s.descricao,
      tipo: s.tipo,
      areaNome: s.area?.nome || null,
      totalQuestoes: s.questoes.length,
      disponivel: !s.areaId || areasDestaqueIds.has(s.areaId),
      ultimaNota: s.tentativas[0]?.nota ?? null,
      ultimaTentativaEm: s.tentativas[0]?.finalizadoEm ?? null,
    }))
    .sort((a, b) => Number(b.disponivel) - Number(a.disponivel))
}

export async function obterHistorico(usuarioId, simuladoId) {
  return prisma.tentativaSimulado.findMany({
    where: { usuarioId, simuladoId, finalizadoEm: { not: null } },
    orderBy: { finalizadoEm: 'desc' },
    take: LIMITE_HISTORICO,
    select: { id: true, nota: true, finalizadoEm: true },
  })
}

async function verificarDisponibilidade(usuarioId, simuladoId) {
  const simulado = await prisma.simulado.findUnique({ where: { id: simuladoId } })
  if (!simulado) return { existe: false }
  if (!simulado.areaId) return { existe: true, disponivel: true }

  const resultado = await prisma.resultadoArea.findUnique({
    where: { usuarioId_areaId: { usuarioId, areaId: simulado.areaId } },
  })
  const disponivel = resultado?.faixa === 'ALTA' && !resultado.interesseAltoHabilidadeBaixa
  return { existe: true, disponivel }
}

export async function iniciarTentativa(usuarioId, simuladoId) {
  const { existe, disponivel } = await verificarDisponibilidade(usuarioId, simuladoId)

  if (!existe) {
    const erro = new Error('Simulado não encontrado.')
    erro.status = 404
    throw erro
  }
  if (!disponivel) {
    const erro = new Error('Esse simulado ainda não foi liberado pro seu perfil.')
    erro.status = 403
    throw erro
  }

  const tentativa = await prisma.tentativaSimulado.create({
    data: { usuarioId, simuladoId },
  })

  const questoes = await prisma.questaoSimulado.findMany({
    where: { simuladoId },
    orderBy: { ordem: 'asc' },
    include: {
      alternativas: {
        orderBy: { ordem: 'asc' },
        select: { id: true, texto: true, ordem: true },
      },
    },
  })

  return { tentativaId: tentativa.id, questoes }
}

export async function registrarResposta(tentativaId, questaoSimuladoId, alternativaId) {
  const existente = await prisma.respostaSimulado.findFirst({
    where: { tentativaId, questaoSimuladoId },
  })

  if (existente) {
    await prisma.respostaSimulado.update({
      where: { id: existente.id },
      data: { alternativaEscolhidaId: alternativaId },
    })
  } else {
    await prisma.respostaSimulado.create({
      data: { tentativaId, questaoSimuladoId, alternativaEscolhidaId: alternativaId },
    })
  }
}

export async function finalizarTentativa(usuarioId, tentativaId) {
  const tentativa = await prisma.tentativaSimulado.findUnique({
    where: { id: tentativaId },
    include: {
      respostas: {
        include: {
          questao: { include: { alternativas: true } },
          alternativaEscolhida: true,
        },
      },
    },
  })

  if (!tentativa || tentativa.usuarioId !== usuarioId) {
    const erro = new Error('Tentativa não encontrada.')
    erro.status = 404
    throw erro
  }

  const total = tentativa.respostas.length
  const acertos = tentativa.respostas.filter((r) => r.alternativaEscolhida?.correta).length
  const nota = total > 0 ? Math.round((acertos / total) * 100) : 0

  await prisma.tentativaSimulado.update({
    where: { id: tentativaId },
    data: { finalizadoEm: new Date(), nota },
  })

  const finalizadas = await prisma.tentativaSimulado.findMany({
    where: { usuarioId, simuladoId: tentativa.simuladoId, finalizadoEm: { not: null } },
    orderBy: { finalizadoEm: 'desc' },
  })

  if (finalizadas.length > LIMITE_HISTORICO) {
    const excedentes = finalizadas.slice(LIMITE_HISTORICO)
    await prisma.tentativaSimulado.deleteMany({ where: { id: { in: excedentes.map((t) => t.id) } } })
  }

  const detalhes = tentativa.respostas.map((r) => ({
    questaoId: r.questaoSimuladoId,
    enunciado: r.questao.enunciado,
    alternativaEscolhidaId: r.alternativaEscolhidaId,
    alternativas: r.questao.alternativas.map((a) => ({
      id: a.id,
      texto: a.texto,
      correta: a.correta,
      explicacao: a.explicacao,
    })),
  }))

  return { nota, acertos, total, detalhes }
}
