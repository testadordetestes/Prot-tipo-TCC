import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import {
  listarSimuladosDisponiveis,
  obterHistorico,
  iniciarTentativa,
  registrarResposta,
  finalizarTentativa,
} from '../services/simulados.service.js'

const router = Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
  const simulados = await listarSimuladosDisponiveis(req.usuarioId)
  res.json({ simulados })
})

router.get('/:id/historico', async (req, res) => {
  const historico = await obterHistorico(req.usuarioId, req.params.id)
  res.json({ historico })
})

router.post('/:id/iniciar', async (req, res) => {
  try {
    const dados = await iniciarTentativa(req.usuarioId, req.params.id)
    res.status(201).json(dados)
  } catch (erro) {
    res.status(erro.status || 500).json({ erro: erro.message })
  }
})

router.post('/tentativas/:tentativaId/responder', async (req, res) => {
  const { questaoSimuladoId, alternativaId } = req.body ?? {}
  if (!questaoSimuladoId || !alternativaId) {
    return res.status(400).json({ erro: 'Informe questaoSimuladoId e alternativaId.' })
  }
  await registrarResposta(req.params.tentativaId, questaoSimuladoId, alternativaId)
  res.json({ ok: true })
})

router.post('/tentativas/:tentativaId/finalizar', async (req, res) => {
  try {
    const resultado = await finalizarTentativa(req.usuarioId, req.params.tentativaId)
    res.json(resultado)
  } catch (erro) {
    res.status(erro.status || 500).json({ erro: erro.message })
  }
})

export default router
