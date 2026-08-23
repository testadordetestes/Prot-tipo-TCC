import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ESCALA = [
  { texto: 'Não me identifico', valor: 0 },
  { texto: 'Pouco', valor: 25 },
  { texto: 'Mais ou menos', valor: 50 },
  { texto: 'Bastante', valor: 75 },
  { texto: 'Muito', valor: 100 },
]

// Uma pergunta de Interesse e uma de Habilidade por área (14 + 14 = 28 perguntas)
const AREAS_INTERESSE_HABILIDADE = [
  { slug: 'tecnologia', interesse: 'Quanto você se interessa por criar ou entender como sistemas, aplicativos e tecnologias funcionam?', habilidade: 'Quão capaz você se sente de aprender e usar ferramentas tecnológicas novas?' },
  { slug: 'saude', interesse: 'Quanto você se interessa por cuidar da saúde e do bem-estar de outras pessoas?', habilidade: 'Quão capaz você se sente de lidar com situações que exigem cuidado e atenção com pessoas?' },
  { slug: 'exatas-e-engenharias', interesse: 'Quanto você se interessa por resolver problemas com cálculo, estrutura e construção?', habilidade: 'Quão capaz você se sente de resolver problemas usando matemática e lógica?' },
  { slug: 'comunicacao-e-midia', interesse: 'Quanto você se interessa por criar campanhas, conteúdo ou se comunicar com um público?', habilidade: 'Quão capaz você se sente de se expressar e se comunicar com clareza?' },
  { slug: 'design-e-criacao', interesse: 'Quanto você se interessa por criar ou projetar coisas visualmente (imagens, espaços, objetos)?', habilidade: 'Quão capaz você se sente de criar algo visualmente atraente?' },
  { slug: 'negocios-e-gestao', interesse: 'Quanto você se interessa por organizar, planejar e administrar processos ou negócios?', habilidade: 'Quão capaz você se sente de organizar tarefas e liderar processos?' },
  { slug: 'direito-e-ciencias-sociais', interesse: 'Quanto você se interessa por discutir questões de justiça, sociedade e política?', habilidade: 'Quão capaz você se sente de argumentar e defender um ponto de vista?' },
  { slug: 'educacao', interesse: 'Quanto você se interessa por ensinar e ajudar outras pessoas a aprender?', habilidade: 'Quão capaz você se sente de explicar algo de um jeito que os outros entendam?' },
  { slug: 'meio-ambiente-e-ciencias-da-natureza', interesse: 'Quanto você se interessa por natureza, sustentabilidade e ciências biológicas?', habilidade: 'Quão capaz você se sente de observar e entender fenômenos da natureza?' },
  { slug: 'artes-e-esporte', interesse: 'Quanto você se interessa por se expressar através de arte, música, dança ou esporte?', habilidade: 'Quão capaz você se sente de se expressar por movimento, som ou imagem?' },
  { slug: 'ciencias-exatas-e-pesquisa-academica', interesse: 'Quanto você se interessa por investigar fenômenos científicos de forma aprofundada?', habilidade: 'Quão capaz você se sente de estudar um tema a fundo por conta própria?' },
  { slug: 'seguranca-e-servicos-publicos', interesse: 'Quanto você se interessa por atuar protegendo pessoas ou mantendo a ordem pública?', habilidade: 'Quão capaz você se sente de manter a calma e agir em situações de pressão?' },
  { slug: 'gastronomia-e-turismo', interesse: 'Quanto você se interessa por culinária, viagens e criar experiências para outras pessoas?', habilidade: 'Quão capaz você se sente de organizar uma experiência agradável para outras pessoas?' },
  { slug: 'letras-linguistica-e-humanidades', interesse: 'Quanto você se interessa por linguagem, filosofia e história?', habilidade: 'Quão capaz você se sente de interpretar e escrever textos com clareza?' },
]

// Perguntas de Competência e Preferência (etapa Perfil): cada alternativa pode
// impactar várias áreas ao mesmo tempo, mantendo a etapa curta mesmo cobrindo as 14 áreas.
const PERGUNTAS_PERFIL = [
  {
    pilar: 'COMPETENCIA',
    enunciado: 'Qual dessas formas de pensar mais combina com você?',
    opcoes: [
      { texto: 'Lógica e analítica', areas: ['tecnologia', 'exatas-e-engenharias', 'ciencias-exatas-e-pesquisa-academica'] },
      { texto: 'Criativa e expressiva', areas: ['design-e-criacao', 'artes-e-esporte', 'comunicacao-e-midia'] },
      { texto: 'Empática e comunicativa', areas: ['saude', 'educacao', 'direito-e-ciencias-sociais'] },
      { texto: 'Prática e organizada', areas: ['negocios-e-gestao', 'gastronomia-e-turismo', 'seguranca-e-servicos-publicos'] },
    ],
  },
  {
    pilar: 'COMPETENCIA',
    enunciado: 'Em um trabalho em grupo, você costuma ser a pessoa que...',
    opcoes: [
      { texto: 'Resolve os problemas técnicos', areas: ['tecnologia', 'exatas-e-engenharias'] },
      { texto: 'Cuida para que todos estejam bem e o grupo funcione', areas: ['saude', 'educacao'] },
      { texto: 'Organiza tarefas e prazos', areas: ['negocios-e-gestao', 'seguranca-e-servicos-publicos'] },
      { texto: 'Traz ideias criativas novas', areas: ['design-e-criacao', 'artes-e-esporte', 'comunicacao-e-midia'] },
      { texto: 'Pesquisa e aprofunda o conteúdo', areas: ['ciencias-exatas-e-pesquisa-academica', 'letras-linguistica-e-humanidades', 'direito-e-ciencias-sociais'] },
    ],
  },
  {
    pilar: 'COMPETENCIA',
    enunciado: 'Você se sente mais confiante quando está...',
    opcoes: [
      { texto: 'Trabalhando com números e dados', areas: ['tecnologia', 'exatas-e-engenharias', 'negocios-e-gestao'] },
      { texto: 'Cuidando de alguém ou de algo vivo', areas: ['saude', 'meio-ambiente-e-ciencias-da-natureza'] },
      { texto: 'Criando algo do zero', areas: ['design-e-criacao', 'artes-e-esporte'] },
      { texto: 'Debatendo ideias e argumentos', areas: ['direito-e-ciencias-sociais', 'letras-linguistica-e-humanidades', 'comunicacao-e-midia'] },
    ],
  },
  {
    pilar: 'COMPETENCIA',
    enunciado: 'Qual dessas tarefas você faria com mais facilidade?',
    opcoes: [
      { texto: 'Montar ou consertar algo com as mãos', areas: ['exatas-e-engenharias', 'gastronomia-e-turismo', 'tecnologia'] },
      { texto: 'Explicar um assunto complicado de um jeito simples', areas: ['educacao', 'comunicacao-e-midia', 'letras-linguistica-e-humanidades'] },
      { texto: 'Cuidar de uma situação de emergência com calma', areas: ['saude', 'seguranca-e-servicos-publicos'] },
      { texto: 'Planejar um evento ou uma viagem', areas: ['gastronomia-e-turismo', 'negocios-e-gestao'] },
    ],
  },
  {
    pilar: 'PREFERENCIA',
    enunciado: 'Você prefere um ambiente de trabalho...',
    opcoes: [
      { texto: 'Mais estruturado, com rotina e regras claras', areas: ['seguranca-e-servicos-publicos', 'negocios-e-gestao', 'direito-e-ciencias-sociais'] },
      { texto: 'Mais flexível, com liberdade para criar', areas: ['design-e-criacao', 'artes-e-esporte', 'tecnologia'] },
      { texto: 'Em contato direto com pessoas o tempo todo', areas: ['saude', 'educacao', 'gastronomia-e-turismo'] },
      { texto: 'Mais tranquilo, com foco individual', areas: ['ciencias-exatas-e-pesquisa-academica', 'letras-linguistica-e-humanidades'] },
    ],
  },
  {
    pilar: 'PREFERENCIA',
    enunciado: 'Você se imagina trabalhando mais...',
    opcoes: [
      { texto: 'Ao ar livre ou em campo', areas: ['meio-ambiente-e-ciencias-da-natureza', 'exatas-e-engenharias', 'seguranca-e-servicos-publicos'] },
      { texto: 'Em um escritório ou espaço fechado', areas: ['negocios-e-gestao', 'tecnologia', 'direito-e-ciencias-sociais'] },
      { texto: 'Em um estúdio ou espaço criativo', areas: ['design-e-criacao', 'artes-e-esporte', 'comunicacao-e-midia'] },
      { texto: 'Em diferentes lugares, viajando bastante', areas: ['gastronomia-e-turismo', 'comunicacao-e-midia'] },
    ],
  },
  {
    pilar: 'PREFERENCIA',
    enunciado: 'No seu dia a dia ideal de trabalho, você...',
    opcoes: [
      { texto: 'Segue uma rotina previsível', areas: ['educacao', 'negocios-e-gestao', 'seguranca-e-servicos-publicos'] },
      { texto: 'Enfrenta desafios diferentes a cada dia', areas: ['saude', 'tecnologia', 'gastronomia-e-turismo'] },
      { texto: 'Tem tempo livre para pesquisar e se aprofundar', areas: ['ciencias-exatas-e-pesquisa-academica', 'letras-linguistica-e-humanidades'] },
      { texto: 'Cria algo novo o tempo todo', areas: ['design-e-criacao', 'artes-e-esporte'] },
    ],
  },
  {
    pilar: 'PREFERENCIA',
    enunciado: 'Você prefere um trabalho que...',
    opcoes: [
      { texto: 'Tenha impacto direto e visível na vida das pessoas', areas: ['saude', 'educacao', 'seguranca-e-servicos-publicos'] },
      { texto: 'Envolva resolver problemas complexos', areas: ['tecnologia', 'exatas-e-engenharias', 'ciencias-exatas-e-pesquisa-academica'] },
      { texto: 'Permita se expressar e ser reconhecido pela criatividade', areas: ['design-e-criacao', 'artes-e-esporte', 'comunicacao-e-midia'] },
      { texto: 'Tenha estabilidade e estrutura clara de carreira', areas: ['negocios-e-gestao', 'direito-e-ciencias-sociais', 'gastronomia-e-turismo'] },
    ],
  },
]

async function criarPerguntaEscala({ etapa, pilar, enunciado, areaId, ordem }) {
  const existente = await prisma.pergunta.findFirst({ where: { enunciado, etapa } })
  if (existente) return

  await prisma.pergunta.create({
    data: {
      etapa,
      pilar,
      enunciado,
      ordem,
      alternativas: {
        create: ESCALA.map((op, i) => ({
          texto: op.texto,
          valor: op.valor,
          ordem: i,
          areas: { create: [{ areaId, peso: 1 }] },
        })),
      },
    },
  })
}

async function criarPerguntaMultiArea({ etapa, pilar, enunciado, opcoes, areaPorSlug, ordem }) {
  const existente = await prisma.pergunta.findFirst({ where: { enunciado, etapa } })
  if (existente) return

  await prisma.pergunta.create({
    data: {
      etapa,
      pilar,
      enunciado,
      ordem,
      alternativas: {
        create: opcoes.map((op, i) => ({
          texto: op.texto,
          valor: 100,
          ordem: i,
          areas: {
            create: op.areas
              .map((slug) => areaPorSlug[slug])
              .filter(Boolean)
              .map((area) => ({ areaId: area.id, peso: 1 })),
          },
        })),
      },
    },
  })
}

async function main() {
  const areas = await prisma.area.findMany()
  const areaPorSlug = Object.fromEntries(areas.map((a) => [a.slug, a]))

  let ordem = 0
  for (const item of AREAS_INTERESSE_HABILIDADE) {
    const area = areaPorSlug[item.slug]
    if (!area) continue
    await criarPerguntaEscala({ etapa: 'INTERESSES', pilar: 'INTERESSE', enunciado: item.interesse, areaId: area.id, ordem: ordem++ })
  }

  ordem = 0
  for (const item of AREAS_INTERESSE_HABILIDADE) {
    const area = areaPorSlug[item.slug]
    if (!area) continue
    await criarPerguntaEscala({ etapa: 'HABILIDADES', pilar: 'HABILIDADE', enunciado: item.habilidade, areaId: area.id, ordem: ordem++ })
  }

  ordem = 0
  for (const pergunta of PERGUNTAS_PERFIL) {
    await criarPerguntaMultiArea({
      etapa: 'PERFIL',
      pilar: pergunta.pilar,
      enunciado: pergunta.enunciado,
      opcoes: pergunta.opcoes,
      areaPorSlug,
      ordem: ordem++,
    })
  }

  console.log('Seed do questionário concluído: 28 perguntas de Interesses/Habilidades + 8 de Perfil.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
