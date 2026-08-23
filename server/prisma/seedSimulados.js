import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function gerarQuestoes(areaNome) {
  return [
    {
      enunciado: areaNome
        ? `Durante uma dinâmica de grupo para uma vaga na área de ${areaNome}, um colega discorda abertamente da sua ideia na frente de todos. Qual a melhor atitude?`
        : 'Durante uma dinâmica de grupo em um processo seletivo, um colega discorda abertamente da sua ideia na frente de todos. Qual a melhor atitude?',
      alternativas: [
        { texto: 'Ignorar o comentário e insistir na própria ideia sem ouvir', correta: false, explicacao: 'Ignorar o ponto de vista do colega pode passar a impressão de falta de escuta ativa, uma habilidade muito avaliada em processos seletivos.' },
        { texto: 'Ouvir o argumento, avaliar com calma e responder com respeito, mesmo que continue discordando', correta: true, explicacao: 'Essa é a atitude mais avaliada em dinâmicas de grupo: mostra escuta ativa, controle emocional e capacidade de argumentar sem ser hostil.' },
        { texto: 'Concordar na hora só para evitar conflito, mesmo achando que está certo', correta: false, explicacao: 'Ceder só para evitar desconforto pode ser interpretado como falta de posicionamento próprio.' },
        { texto: 'Responder de forma agressiva para defender o próprio ponto', correta: false, explicacao: 'Reações agressivas costumam ser um dos principais motivos de eliminação em dinâmicas de grupo.' },
      ],
    },
    {
      enunciado: areaNome
        ? `Na sua apresentação pessoal para um processo seletivo relacionado a ${areaNome}, qual estrutura costuma funcionar melhor?`
        : 'Na sua apresentação pessoal para um processo seletivo, qual estrutura costuma funcionar melhor?',
      alternativas: [
        { texto: 'Falar só sobre gostos pessoais, sem conectar com a vaga', correta: false, explicacao: 'Sem conexão com a vaga, a apresentação perde força e não mostra por que você se encaixa ali.' },
        { texto: 'Contar rapidamente quem você é, o que te aproxima dessa área e um exemplo concreto disso', correta: true, explicacao: 'Uma apresentação objetiva, conectada à vaga e com um exemplo real é o que mais se destaca positivamente.' },
        { texto: 'Ler um texto decorado sem naturalidade', correta: false, explicacao: 'Falta de naturalidade costuma ser percebida e passa insegurança, mesmo quando o conteúdo é bom.' },
        { texto: 'Focar só em pontos fracos e dificuldades passadas', correta: false, explicacao: 'A apresentação pessoal é o momento de mostrar potencial, não de focar apenas em limitações.' },
      ],
    },
    {
      enunciado: 'Você tem duas tarefas pra entregar no mesmo prazo: uma mais simples e outra mais complexa, porém mais importante pro resultado final. Qual a melhor abordagem?',
      alternativas: [
        { texto: 'Fazer só a mais simples pra garantir uma entrega completa', correta: false, explicacao: 'Isso prioriza o que é mais fácil, não o que tem mais impacto — nem sempre é a melhor escolha.' },
        { texto: 'Priorizar a mais importante, comunicando com antecedência se a outra vai atrasar', correta: true, explicacao: 'Priorizar impacto e comunicar prazos com antecedência é uma das competências mais valorizadas em qualquer área.' },
        { texto: 'Tentar fazer as duas ao mesmo tempo sem organizar prioridades', correta: false, explicacao: 'Fazer tudo ao mesmo tempo sem priorização costuma reduzir a qualidade das duas entregas.' },
        { texto: 'Não fazer nenhuma até decidir qual é mais importante', correta: false, explicacao: 'Adiar demais a decisão pode custar tempo precioso que poderia ser usado na entrega mais importante.' },
      ],
    },
    {
      enunciado: areaNome
        ? `Numa entrevista, perguntam sobre um erro que você cometeu no passado relacionado a ${areaNome}. Qual a melhor forma de responder?`
        : 'Numa entrevista, perguntam sobre um erro que você cometeu no passado. Qual a melhor forma de responder?',
      alternativas: [
        { texto: 'Dizer que nunca cometeu erros', correta: false, explicacao: 'Essa resposta costuma soar pouco crível e passa a impressão de falta de autoconhecimento.' },
        { texto: 'Contar o erro de forma honesta e explicar o que aprendeu com ele', correta: true, explicacao: 'Honestidade + aprendizado é exatamente o que recrutadores procuram nesse tipo de pergunta.' },
        { texto: 'Culpar outra pessoa pelo erro', correta: false, explicacao: 'Transferir a culpa passa a impressão de falta de responsabilidade sobre as próprias ações.' },
        { texto: 'Mudar de assunto rapidamente', correta: false, explicacao: 'Evitar a pergunta pode indicar desconforto em lidar com falhas, o que é avaliado negativamente.' },
      ],
    },
  ]
}

async function criarSimulado({ areaId, areaNome, titulo, descricao, tipo }) {
  const existente = await prisma.simulado.findFirst({ where: { titulo } })
  if (existente) return

  const questoes = gerarQuestoes(areaNome)

  await prisma.simulado.create({
    data: {
      areaId,
      tipo,
      titulo,
      descricao,
      questoes: {
        create: questoes.map((q, i) => ({
          enunciado: q.enunciado,
          ordem: i,
          alternativas: {
            create: q.alternativas.map((a, j) => ({
              texto: a.texto,
              correta: a.correta,
              explicacao: a.explicacao,
              ordem: j,
            })),
          },
        })),
      },
    },
  })
}

async function main() {
  await criarSimulado({
    areaId: null,
    areaNome: null,
    titulo: 'Simulado Demonstrativo',
    descricao: 'Um simulado geral pra você ter uma prévia de como funcionam os processos seletivos, disponível mesmo antes de terminar sua Jornada.',
    tipo: 'demonstrativo',
  })

  const areas = await prisma.area.findMany()
  for (const area of areas) {
    await criarSimulado({
      areaId: area.id,
      areaNome: area.nome,
      titulo: `Simulado de Processo Seletivo — ${area.nome}`,
      descricao: `Situações do dia a dia de um processo seletivo, com contexto voltado pra área de ${area.nome}.`,
      tipo: 'processo_seletivo',
    })
  }

  console.log('Seed de simulados concluído: 15 simulados (1 demonstrativo + 14 por área).')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
