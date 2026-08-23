import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function slugify(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const areas = [
  { nome: 'Tecnologia', descricao: 'Área voltada a quem gosta de resolver problemas com lógica, sistemas e tecnologia digital.', subareas: ['Desenvolvimento de Software', 'Dados e Inteligência Artificial', 'Infraestrutura, Redes e Segurança', 'Suporte Técnico e Sistemas'] },
  { nome: 'Saúde', descricao: 'Área voltada a quem tem interesse em cuidar de pessoas, bem-estar físico e mental.', subareas: ['Medicina e Enfermagem', 'Odontologia e Fisioterapia', 'Terapias e Reabilitação', 'Biomedicina e Pesquisa Científica', 'Nutrição', 'Farmácia'] },
  { nome: 'Exatas e Engenharias', descricao: 'Área voltada a quem gosta de cálculo, construção e resolução de problemas técnicos.', subareas: ['Engenharia Civil e Arquitetura Estrutural', 'Engenharia Mecânica', 'Engenharia Elétrica e Eletrônica', 'Engenharia Química e de Materiais', 'Matemática, Física e Estatística Aplicada'] },
  { nome: 'Comunicação e Mídia', descricao: 'Área voltada a quem gosta de se comunicar com o público e criar campanhas.', subareas: ['Publicidade e Marketing', 'Marketing Digital e E-commerce'] },
  { nome: 'Design e Criação', descricao: 'Área voltada a quem tem sensibilidade visual e gosta de criar/projetar coisas.', subareas: ['Design Gráfico e UX/UI', 'Moda e Estilismo', 'Arquitetura e Design de Interiores', 'Design de Produto e Ilustração', 'Fotografia'] },
  { nome: 'Negócios e Gestão', descricao: 'Área voltada a quem gosta de organizar, planejar e liderar processos.', subareas: ['Administração', 'Economia e Finanças', 'Contabilidade e Auditoria', 'Recursos Humanos e Gestão de Pessoas'] },
  { nome: 'Direito e Ciências Sociais', descricao: 'Área voltada a quem se interessa por justiça, sociedade e relações humanas em grupo.', subareas: ['Direito', 'Ciências Sociais e Políticas', 'Serviço Social', 'Relações Internacionais', 'Antropologia'] },
  { nome: 'Educação', descricao: 'Área voltada a quem gosta de ensinar, explicar e formar outras pessoas.', subareas: ['Licenciaturas', 'Pedagogia', 'Educação Especial e Inclusiva'] },
  { nome: 'Meio Ambiente e Ciências da Natureza', descricao: 'Área voltada a quem se interessa por natureza, sustentabilidade e ciências biológicas.', subareas: ['Biologia e Ecologia', 'Agronomia e Zootecnia', 'Veterinária', 'Geologia e Geografia', 'Engenharia Ambiental e Sustentabilidade'] },
  { nome: 'Artes e Esporte', descricao: 'Área voltada a quem se expressa por movimento, som ou imagem, ou gosta de performance física.', subareas: ['Artes Cênicas, Música e Dança', 'Artes Visuais', 'Educação Física e Treinamento Esportivo'] },
  { nome: 'Ciências Exatas e Pesquisa Acadêmica', descricao: 'Área voltada a quem se interessa por investigação científica pura.', subareas: ['Química', 'Física Teórica e Pesquisa'] },
  { nome: 'Segurança e Serviços Públicos', descricao: 'Área voltada a quem se interessa por ordem pública e proteção.', subareas: ['Forças de Segurança'] },
  { nome: 'Gastronomia e Turismo', descricao: 'Área voltada a quem gosta de culinária, viagens e experiências.', subareas: ['Gastronomia e Culinária Profissional', 'Turismo e Eventos'] },
  { nome: 'Letras, Linguística e Humanidades', descricao: 'Área voltada a quem se interessa por linguagem, pensamento e história humana.', subareas: ['Linguística', 'Filosofia', 'História e Arqueologia'] },
]

async function main() {
  for (const [index, area] of areas.entries()) {
    const areaCriada = await prisma.area.upsert({
      where: { slug: slugify(area.nome) },
      update: {},
      create: {
        nome: area.nome,
        slug: slugify(area.nome),
        descricao: area.descricao,
        ordem: index,
      },
    })

    for (const subareaNome of area.subareas) {
      const subareaSlug = slugify(`${area.nome}-${subareaNome}`)
      await prisma.subarea.upsert({
        where: { slug: subareaSlug },
        update: {},
        create: {
          nome: subareaNome,
          slug: subareaSlug,
          areaId: areaCriada.id,
        },
      })
    }
  }

  console.log(`Seed concluído: ${areas.length} áreas populadas.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
