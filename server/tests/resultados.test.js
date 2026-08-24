import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcularResultadoArea, faixaPorScore } from '../src/services/resultados.service.js'

test('faixaPorScore: 60+ é ALTA', () => {
  assert.equal(faixaPorScore(60), 'ALTA')
  assert.equal(faixaPorScore(85), 'ALTA')
})

test('faixaPorScore: 40-59 é MEDIA', () => {
  assert.equal(faixaPorScore(40), 'MEDIA')
  assert.equal(faixaPorScore(59), 'MEDIA')
})

test('faixaPorScore: abaixo de 40 é BAIXA', () => {
  assert.equal(faixaPorScore(39), 'BAIXA')
  assert.equal(faixaPorScore(0), 'BAIXA')
})

test('calcularResultadoArea aplica a fórmula 35/35/20/10', () => {
  const resultado = calcularResultadoArea({ interesse: 100, habilidade: 100, competencia: 100, preferencia: 100 })
  assert.equal(resultado.score, 100)
  assert.equal(resultado.faixa, 'ALTA')
})

test('calcularResultadoArea pondera corretamente valores mistos', () => {
  const resultado = calcularResultadoArea({ interesse: 80, habilidade: 60, competencia: 40, preferencia: 20 })
  const esperado = 80 * 0.35 + 60 * 0.35 + 40 * 0.2 + 20 * 0.1
  assert.ok(Math.abs(resultado.score - esperado) < 0.001)
})

test('calcularResultadoArea marca interesseAltoHabilidadeBaixa quando aplicável', () => {
  const resultado = calcularResultadoArea({ interesse: 90, habilidade: 20, competencia: 50, preferencia: 50 })
  assert.equal(resultado.interesseAltoHabilidadeBaixa, true)
})

test('calcularResultadoArea não marca a flag quando habilidade está ok', () => {
  const resultado = calcularResultadoArea({ interesse: 90, habilidade: 40, competencia: 50, preferencia: 50 })
  assert.equal(resultado.interesseAltoHabilidadeBaixa, false)
})

test('calcularResultadoArea com tudo zero cai em BAIXA', () => {
  const resultado = calcularResultadoArea({ interesse: 0, habilidade: 0, competencia: 0, preferencia: 0 })
  assert.equal(resultado.score, 0)
  assert.equal(resultado.faixa, 'BAIXA')
})
