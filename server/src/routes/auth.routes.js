import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { gerarToken, authMiddleware } from '../middlewares/auth.js'
import { gerarCaptcha, validarCaptcha } from '../lib/captchaStore.js'
import { normalizarUsername, validarCredenciais } from '../utils/usuario.js'
import { obterConfiguracoes } from '../services/configuracoes.service.js'

const router = Router()

const SALT_ROUNDS = 10

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

  const token = await gerarToken(usuario)

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

  const config = await obterConfiguracoes()
  const limiteTentativas = Number(config.limite_tentativas_login)
  const bloqueioMinutos = Number(config.bloqueio_minutos)
  const tentativasParaCaptcha = Number(config.tentativas_para_captcha)

  const usernameLower = normalizarUsername(username)
  const usuario = await prisma.usuario.findUnique({ where: { usernameLower } })

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

  if (usuario.falhasLogin >= tentativasParaCaptcha) {
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

    if (novasFalhas >= limiteTentativas) {
      atualizacao.falhasLogin = 0
      atualizacao.bloqueadoAte = new Date(Date.now() + bloqueioMinutos * 60000)
    }

    await prisma.usuario.update({ where: { id: usuario.id }, data: atualizacao })

    return res.status(401).json({
      ...erroGenerico,
      exigeCaptcha: novasFalhas >= tentativasParaCaptcha,
    })
  }

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { falhasLogin: 0, bloqueadoAte: null },
  })

  const token = await gerarToken(usuario)

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

router.put('/senha', authMiddleware, async (req, res) => {
  const { senhaAtual, novaSenha } = req.body ?? {}

  if (!senhaAtual || !novaSenha || novaSenha.length < 6) {
    return res.status(400).json({
      erro: 'Informe a senha atual e uma nova senha com pelo menos 6 caracteres.',
    })
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: req.usuarioId } })
  const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senhaHash)

  if (!senhaCorreta) {
    return res.status(401).json({ erro: 'Senha atual incorreta.' })
  }

  const novaSenhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS)
  await prisma.usuario.update({ where: { id: usuario.id }, data: { senhaHash: novaSenhaHash } })

  res.json({ ok: true })
})

router.delete('/conta', authMiddleware, async (req, res) => {
  await prisma.usuario.delete({ where: { id: req.usuarioId } })
  res.json({ ok: true })
})

export default router
