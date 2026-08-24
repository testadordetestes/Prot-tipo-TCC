import jwt from 'jsonwebtoken'
import { obterConfiguracaoNumero } from '../services/configuracoes.service.js'

export async function gerarToken(usuario) {
  const duracao = await obterConfiguracaoNumero('sessao_duracao_minutos')
  return jwt.sign(
    { sub: usuario.id, username: usuario.username },
    process.env.JWT_SECRET,
    { expiresIn: `${duracao}m` }
  )
}

// Middleware de autenticação com sessão "deslizante": toda requisição autenticada válida
// renova o tempo de expiração, então a sessão só expira por INATIVIDADE, não por tempo fixo.
// A duração vem da Administração Técnica (banco), não de uma constante fixa.
export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não enviado.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.usuarioId = payload.sub

    const duracao = await obterConfiguracaoNumero('sessao_duracao_minutos')
    const novoToken = jwt.sign(
      { sub: payload.sub, username: payload.username },
      process.env.JWT_SECRET,
      { expiresIn: `${duracao}m` }
    )
    res.setHeader('x-renewed-token', novoToken)

    next()
  } catch (erro) {
    return res.status(401).json({ erro: 'Sessão inválida ou expirada. Faça login novamente.' })
  }
}
