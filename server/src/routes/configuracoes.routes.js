import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { obterConfiguracoes, atualizarConfiguracao } from '../services/configuracoes.service.js'

const router = Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
  const configuracoes = await obterConfiguracoes()
  res.json({ configuracoes })
})

router.put('/', async (req, res) => {
  const { chave, valor } = req.body ?? {}
  if (!chave || valor === undefined) {
    return res.status(400).json({ erro: 'Informe chave e valor.' })
  }

  try {
    const configuracoes = await atualizarConfiguracao(chave, valor)
    res.json({ configuracoes })
  } catch (erro) {
    res.status(erro.status || 500).json({ erro: erro.message })
  }
})

export default router
