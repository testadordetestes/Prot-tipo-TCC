import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import {
  obterProgresso,
  etapaDesbloqueada,
  listarPerguntasEtapa,
  registrarResposta,
} from '../services/questionario.service.js'

const router = Router()

const ETAPAS_VALIDAS = ['interesses', 'habilidades', 'perfil']

function etapaParaEnum(etapaParam) {
  return etapaParam.toUpperCase()
}

router.use(authMiddleware)

router.get('/progresso', async (req, res) => {
  const progresso = await obterProgresso(req.usuarioId)
  res.json({ progresso })
})

router.get('/:etapa', async (req, res) => {
  const etapaParam = req.params.etapa
  if (!ETAPAS_VALIDAS.includes(etapaParam)) {
    return res.status(400).json({ erro: 'Etapa inválida.' })
  }

  const etapa = etapaParaEnum(etapaParam)
  const desbloqueada = await etapaDesbloqueada(req.usuarioId, etapa)

  if (!desbloqueada) {
    return res.status(403).json({ erro: 'Essa etapa ainda não foi liberada.' })
  }

  const perguntas = await listarPerguntasEtapa(req.usuarioId, etapa)
  res.json({ perguntas })
})

router.post('/resposta', async (req, res) => {
  const { perguntaId, alternativaId } = req.body ?? {}

  if (!perguntaId || !alternativaId) {
    return res.status(400).json({ erro: 'Informe perguntaId e alternativaId.' })
  }

  try {
    const progresso = await registrarResposta(req.usuarioId, perguntaId, alternativaId)
    res.json({ progresso })
  } catch (erro) {
    res.status(erro.status || 500).json({ erro: erro.message })
  }
})

export default router
