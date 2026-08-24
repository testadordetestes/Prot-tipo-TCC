import { prisma } from '../lib/prisma.js'

const PADROES = {
  sessao_duracao_minutos: '30',
  limite_tentativas_login: '5',
  bloqueio_minutos: '15',
  tentativas_para_captcha: '2',
}

export async function obterConfiguracoes() {
  const registros = await prisma.configuracaoSistema.findMany()
  const mapa = Object.fromEntries(registros.map((r) => [r.chave, r.valor]))
  return { ...PADROES, ...mapa }
}

export async function obterConfiguracaoNumero(chave) {
  const config = await obterConfiguracoes()
  return Number(config[chave])
}

export async function atualizarConfiguracao(chave, valor) {
  if (!(chave in PADROES)) {
    const erro = new Error('Configuração desconhecida.')
    erro.status = 400
    throw erro
  }

  await prisma.configuracaoSistema.upsert({
    where: { chave },
    update: { valor: String(valor) },
    create: { chave, valor: String(valor) },
  })

  return obterConfiguracoes()
}
