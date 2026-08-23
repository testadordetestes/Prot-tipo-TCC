export function normalizarUsername(username) {
  return username.trim().toLowerCase()
}

export function validarCredenciais(username, senha) {
  const erros = []

  if (!username || username.trim().length < 3) {
    erros.push('O nome de usuário precisa ter pelo menos 3 caracteres.')
  }

  if (username && /\s/.test(username)) {
    erros.push('O nome de usuário não pode conter espaços.')
  }

  if (!senha || senha.length < 6) {
    erros.push('A senha precisa ter pelo menos 6 caracteres.')
  }

  return erros
}
