import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { gerarToken, authMiddleware } from '../middlewares/auth.js'
import { gerarCaptcha, validarCaptcha } from '../lib/captchaStore.js'
import { normalizarUsername, validarCredenciais } from '../utils/usuario.js'

const router = Router()

const SALT_ROUNDS = 10
const LIMITE_TENTATIVAS = 5
const BLOQUEIO_MINUTOS = 15
const TENTATIVAS_PARA_CAPTCHA = 2

router.get('/captcha', (req, res) => {
  const { token, pergunta } = gerarCaptcha()
  res.json({ captchaToken: token, pergunta })
})

router.post('/cadastro', async (req, res) => {
  const { username, senha } = req.body ?? {}

  const erros = validarCredenciais(username, senha)
  if (erros.length > 0) {
    return res.status(400).json({ erros })
  }

  const usernameLower = normalizarUsername(username)

  const existente = await prisma.usuario.findUnique({ where: { usernameLower } })
  if (existente) {
    return res.status(409).json({ erro: 'Esse nome de usuário já está em uso.' })
  }

  const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS)

  const usuario = await prisma.usuario.create({
    data: { username: username.trim(), usernameLower, senhaHash },
  })

  const token = gerarToken(usuario)

  res.status(201).json({
    token,
    usuario: { id: usuario.id, username: usuario.username },
  })
})

router.post('/login', async (req, res) => {
  const { username, senha, captchaToken, captchaResposta } = req.body ?? {}

  if (!username || !senha) {
    return res.status(400).json({ erro: 'Informe usuário e senha.' })
  }

  const usernameLower = normalizarUsername(username)
  const usuario = await prisma.usuario.findUnique({ where: { usernameLower } })

  // Mensagem genérica de propósito: não revelar se o usuário existe ou não
  const erroGenerico = { erro: 'Usuário ou senha incorretos.' }

  if (!usuario) {
    return res.status(401).json(erroGenerico)
  }

  if (usuario.bloqueadoAte && usuario.bloqueadoAte > new Date()) {
    const minutosRestantes = Math.ceil((usuario.bloqueadoAte - new Date()) / 60000)
    return res.status(429).json({
      erro: `Muitas tentativas incorretas. Tente novamente em ${minutosRestantes} minuto(s).`,
    })
  }

  if (usuario.falhasLogin >= TENTATIVAS_PARA_CAPTCHA) {
    if (!captchaToken || !validarCaptcha(captchaToken, captchaResposta)) {
      return res.status(400).json({
        erro: 'Captcha inválido ou não informado.',
        exigeCaptcha: true,
      })
    }
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash)

  if (!senhaCorreta) {
    const novasFalhas = usuario.falhasLogin + 1
    const atualizacao = { falhasLogin: novasFalhas }

    if (novasFalhas >= LIMITE_TENTATIVAS) {
      atualizacao.falhasLogin = 0
      atualizacao.bloqueadoAte = new Date(Date.now() + BLOQUEIO_MINUTOS * 60000)
    }

    await prisma.usuario.update({ where: { id: usuario.id }, data: atualizacao })

    return res.status(401).json({
      ...erroGenerico,
      exigeCaptcha: novasFalhas >= TENTATIVAS_PARA_CAPTCHA,
    })
  }

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { falhasLogin: 0, bloqueadoAte: null },
  })

  const token = gerarToken(usuario)

  res.json({ token, usuario: { id: usuario.id, username: usuario.username } })
})

router.get('/me', authMiddleware, async (req, res) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id: req.usuarioId },
    select: { id: true, username: true, criadoEm: true },
  })

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado.' })
  }

  res.json({ usuario })
})

export default router
