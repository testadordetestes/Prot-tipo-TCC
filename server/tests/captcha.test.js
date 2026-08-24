import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gerarCaptcha, validarCaptcha } from '../src/lib/captchaStore.js'

test('gerarCaptcha cria uma pergunta de soma e um token', () => {
  const { token, pergunta } = gerarCaptcha()
  assert.ok(token)
  assert.match(pergunta, /Quanto é \d+ \+ \d+\?/)
})

test('validarCaptcha aceita a resposta correta', () => {
  const { token, pergunta } = gerarCaptcha()
  const [a, b] = pergunta.match(/\d+/g).map(Number)
  assert.equal(validarCaptcha(token, String(a + b)), true)
})

test('validarCaptcha rejeita resposta errada', () => {
  const { token, pergunta } = gerarCaptcha()
  const [a, b] = pergunta.match(/\d+/g).map(Number)
  assert.equal(validarCaptcha(token, String(a + b + 1)), false)
})

test('validarCaptcha é de uso único', () => {
  const { token, pergunta } = gerarCaptcha()
  const [a, b] = pergunta.match(/\d+/g).map(Number)
  assert.equal(validarCaptcha(token, String(a + b)), true)
  assert.equal(validarCaptcha(token, String(a + b)), false)
})

test('validarCaptcha rejeita token inexistente', () => {
  assert.equal(validarCaptcha('token-que-nao-existe', '10'), false)
})
