import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function gerarConteudo(area, faixa, subareas) {
  const nomesSubareas = subareas.slice(0, 2).map((s) => s.nome).join(' e ')

  if (faixa === 'ALTA') {
    return `Seu perfil combina bastante com ${area.nome}. Comece explorando mais a fundo ${nomesSubareas || 'as sub-áreas dessa área'}. Pesquise cursos técnicos, graduações ou certificações relacionadas, e procure conversar com quem já trabalha nessa área (mentoria, entrevistas informais, eventos). Comece também a reunir pequenos projetos ou experiências práticas relacionadas — isso ajuda bastante na hora de decidir de verdade.`
  }

  if (faixa === 'MEDIA') {
    return `${area.nome} pode valer a pena explorar mais antes de decidir. Experimente atividades introdutórias — cursos curtos, vídeos, oficinas — relacionadas a ${nomesSubareas || 'essa área'}. Preste atenção em quais partes específicas mais te atraem: às vezes não é a área toda, só um pedaço dela.`
  }

  return `Seu perfil atual indica pouca afinidade com ${area.nome} — o que não é um problema, só significa que hoje outras áreas provavelmente fazem mais sentido pra você. Isso pode mudar com o tempo e com mais experiência, então não é definitivo. Vale focar energia nas áreas com compatibilidade mais alta no seu resultado, por enquanto.`
}

function titulo(area, faixa) {
  if (faixa === 'ALTA') return `Você tem um perfil forte para ${area.nome}`
  if (faixa === 'MEDIA') return `${area.nome} pode ser um caminho interessante`
  return `${area.nome} não é prioridade agora`
}

function descricao(faixa) {
  if (faixa === 'ALTA') return 'Interesse, habilidade e perfil consistentes com essa área. Hora de aprofundar.'
  if (faixa === 'MEDIA') return 'Afinidade parcial com essa área — vale explorar mais antes de decidir.'
  return 'Pouca afinidade indicada pelo seu perfil atual.'
}

async function main() {
  const areas = await prisma.area.findMany({ include: { subareas: true } })
  const faixas = ['ALTA', 'MEDIA', 'BAIXA']

  for (const area of areas) {
    for (const faixa of faixas) {
      const existente = await prisma.trilha.findFirst({ where: { areaId: area.id, faixa } })
      if (existente) continue

      await prisma.trilha.create({
        data: {
          areaId: area.id,
          faixa,
          titulo: titulo(area, faixa),
          descricao: descricao(faixa),
          conteudo: gerarConteudo(area, faixa, area.subareas),
        },
      })
    }
  }

  console.log('Seed de trilhas concluído: 3 trilhas por área (42 no total).')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
