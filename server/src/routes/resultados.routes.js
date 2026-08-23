import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { obterResultados, calcularResultados } from '../services/resultados.service.js'

const router = Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
  const resultados = await obterResultados(req.usuarioId)
  res.json(resultados)
})

router.post('/calcular', async (req, res) => {
  const resultados = await calcularResultados(req.usuarioId)
  res.json(resultados)
})

export default router
