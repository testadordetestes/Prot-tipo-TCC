import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizarUsername, validarCredenciais } from '../src/utils/usuario.js'

test('normalizarUsername remove espaços extras e deixa minúsculo', () => {
  assert.equal(normalizarUsername('  Nicolas '), 'nicolas')
})

test('validarCredenciais rejeita usuário curto', () => {
  const erros = validarCredenciais('ab', 'senha123')
  assert.ok(erros.length > 0)
})

test('validarCredenciais rejeita usuário com espaço', () => {
  const erros = validarCredenciais('nico las', 'senha123')
  assert.ok(erros.some((e) => e.includes('espaços')))
})

test('validarCredenciais rejeita senha curta', () => {
  const erros = validarCredenciais('nicolas', '123')
  assert.ok(erros.some((e) => e.includes('6 caracteres')))
})

test('validarCredenciais aceita dados válidos', () => {
  const erros = validarCredenciais('nicolas', 'senha123')
  assert.equal(erros.length, 0)
})
