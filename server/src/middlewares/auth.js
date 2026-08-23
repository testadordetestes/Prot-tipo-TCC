import jwt from 'jsonwebtoken'

const DURACAO_SESSAO_MINUTOS = Number(process.env.SESSAO_DURACAO_MINUTOS || 30)

export function gerarToken(usuario) {
  return jwt.sign(
    { sub: usuario.id, username: usuario.username },
    process.env.JWT_SECRET,
    { expiresIn: `${DURACAO_SESSAO_MINUTOS}m` }
  )
}

// Middleware de autenticação com sessão "deslizante": toda requisição autenticada válida
// renova o tempo de expiração, então a sessão só expira por INATIVIDADE, não por tempo fixo.
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não enviado.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.usuarioId = payload.sub

    const novoToken = jwt.sign(
      { sub: payload.sub, username: payload.username },
      process.env.JWT_SECRET,
      { expiresIn: `${DURACAO_SESSAO_MINUTOS}m` }
    )
    res.setHeader('x-renewed-token', novoToken)

    next()
  } catch (erro) {
    return res.status(401).json({ erro: 'Sessão inválida ou expirada. Faça login novamente.' })
  }
}
