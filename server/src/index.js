import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import questionarioRoutes from './routes/questionario.routes.js'
import resultadosRoutes from './routes/resultados.routes.js'
import simuladosRoutes from './routes/simulados.routes.js'
import configuracoesRoutes from './routes/configuracoes.routes.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/questionario', questionarioRoutes)
app.use('/api/resultados', resultadosRoutes)
app.use('/api/simulados', simuladosRoutes)
app.use('/api/configuracoes', configuracoesRoutes)

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' })
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ erro: 'Algo deu errado no servidor.' })
})

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
