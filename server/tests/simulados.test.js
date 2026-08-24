import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcularNota } from '../src/services/simulados.service.js'

test('calcularNota com todas corretas dá 100', () => {
  const resultado = calcularNota([{ correta: true }, { correta: true }])
  assert.deepEqual(resultado, { nota: 100, acertos: 2, total: 2 })
})

test('calcularNota com metade correta dá 50', () => {
  const resultado = calcularNota([{ correta: true }, { correta: false }])
  assert.deepEqual(resultado, { nota: 50, acertos: 1, total: 2 })
})

test('calcularNota sem respostas dá 0, sem dividir por zero', () => {
  const resultado = calcularNota([])
  assert.deepEqual(resultado, { nota: 0, acertos: 0, total: 0 })
})

test('calcularNota com todas erradas dá 0', () => {
  const resultado = calcularNota([{ correta: false }, { correta: false }])
  assert.deepEqual(resultado, { nota: 0, acertos: 0, total: 2 })
})
