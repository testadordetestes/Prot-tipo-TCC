import { prisma } from '../lib/prisma.js'

const PESOS = { INTERESSE: 0.35, HABILIDADE: 0.35, COMPETENCIA: 0.2, PREFERENCIA: 0.1 }
const LIMIAR_DESTAQUE = 60
const LIMIAR_VER_MAIS = 40
const LIMIAR_INTERESSE_ALTO = 70
const LIMIAR_HABILIDADE_BAIXA = 30

export function faixaPorScore(score) {
  if (score >= LIMIAR_DESTAQUE) return 'ALTA'
  if (score >= LIMIAR_VER_MAIS) return 'MEDIA'
  return 'BAIXA'
}

// Função pura: recebe os 4 componentes (0-100) e devolve score/faixa/flag.
// Isolada do banco de propósito, pra poder ser testada sem precisar de um Postgres rodando.
export function calcularResultadoArea({ interesse, habilidade, competencia, preferencia }) {
  const score =
    interesse * PESOS.INTERESSE +
    habilidade * PESOS.HABILIDADE +
    competencia * PESOS.COMPETENCIA +
    preferencia * PESOS.PREFERENCIA

  const interesseAltoHabilidadeBaixa =
    interesse >= LIMIAR_INTERESSE_ALTO && habilidade <= LIMIAR_HABILIDADE_BAIXA

  return { score, faixa: faixaPorScore(score), interesseAltoHabilidadeBaixa }
}

export async function calcularResultados(usuarioId) {
  const respostas = await prisma.respostaQuestionario.findMany({
    where: { usuarioId },
    include: {
      pergunta: true,
      alternativa: { include: { areas: true } },
    },
  })

  // acumuladores[areaId][pilar] = { somaPonderada, somaPesos }
  const acumuladores = {}

  function acumular(areaId, pilar, valor, peso) {
    if (!acumuladores[areaId]) acumuladores[areaId] = {}
    if (!acumuladores[areaId][pilar]) acumuladores[areaId][pilar] = { somaPonderada: 0, somaPesos: 0 }
    acumuladores[areaId][pilar].somaPonderada += valor * peso
    acumuladores[areaId][pilar].somaPesos += peso
  }

  for (const resposta of respostas) {
    if (!resposta.alternativa) continue
    const pilar = resposta.pergunta.pilar
    const valor = resposta.alternativa.valor
    for (const vinculo of resposta.alternativa.areas) {
      acumular(vinculo.areaId, pilar, valor, vinculo.peso)
    }
  }

  const areas = await prisma.area.findMany()
  const resultados = []

  for (const area of areas) {
    const dadosArea = acumuladores[area.id] || {}

    const componente = (pilar) => {
      const dados = dadosArea[pilar]
      if (!dados || dados.somaPesos === 0) return 50 // neutro, sem dado suficiente
      return dados.somaPonderada / dados.somaPesos
    }

    const { score, faixa, interesseAltoHabilidadeBaixa } = calcularResultadoArea({
      interesse: componente('INTERESSE'),
      habilidade: componente('HABILIDADE'),
      competencia: componente('COMPETENCIA'),
      preferencia: componente('PREFERENCIA'),
    })

    resultados.push({ areaId: area.id, score, faixa, interesseAltoHabilidadeBaixa })
  }

  await prisma.$transaction(
    resultados.map((r) =>
      prisma.resultadoArea.upsert({
        where: { usuarioId_areaId: { usuarioId, areaId: r.areaId } },
        update: {
          score: r.score,
          faixa: r.faixa,
          interesseAltoHabilidadeBaixa: r.interesseAltoHabilidadeBaixa,
          calculadoEm: new Date(),
        },
        create: {
          usuarioId,
          areaId: r.areaId,
          score: r.score,
          faixa: r.faixa,
          interesseAltoHabilidadeBaixa: r.interesseAltoHabilidadeBaixa,
        },
      })
    )
  )

  return obterResultados(usuarioId)
}

export async function obterResultados(usuarioId) {
  const resultados = await prisma.resultadoArea.findMany({
    where: { usuarioId },
    include: { area: { include: { subareas: true } } },
    orderBy: { score: 'desc' },
  })

  if (resultados.length === 0) {
    return { calculado: false, destaque: [], verMais: [], desenvolver: [] }
  }

  const trilhas = await prisma.trilha.findMany()
  const trilhaPorAreaFaixa = Object.fromEntries(trilhas.map((t) => [`${t.areaId}_${t.faixa}`, t]))

  const destaque = []
  const verMais = []
  const desenvolver = []

  for (const r of resultados) {
    const item = {
      areaId: r.areaId,
      nome: r.area.nome,
      slug: r.area.slug,
      descricao: r.area.descricao,
      subareas: r.area.subareas.map((s) => s.nome),
      score: Math.round(r.score),
      faixa: r.faixa,
      trilha: trilhaPorAreaFaixa[`${r.areaId}_${r.faixa}`] || null,
    }

    if (r.interesseAltoHabilidadeBaixa) {
      desenvolver.push(item)
      continue
    }

    if (r.faixa === 'ALTA') destaque.push(item)
    else if (r.faixa === 'MEDIA') verMais.push(item)
  }

  return { calculado: true, destaque, verMais, desenvolver }
}
