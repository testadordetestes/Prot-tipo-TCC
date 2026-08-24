import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcularEtapaDesbloqueada } from '../src/services/questionario.service.js'

test('INTERESSES está sempre desbloqueada', () => {
  assert.equal(calcularEtapaDesbloqueada({}, 'INTERESSES'), true)
})

test('HABILIDADES só desbloqueia com INTERESSES concluída', () => {
  const progressoIncompleto = { INTERESSES: { concluida: false } }
  const progressoCompleto = { INTERESSES: { concluida: true } }
  assert.equal(calcularEtapaDesbloqueada(progressoIncompleto, 'HABILIDADES'), false)
  assert.equal(calcularEtapaDesbloqueada(progressoCompleto, 'HABILIDADES'), true)
})

test('PERFIL exige INTERESSES e HABILIDADES concluídas', () => {
  const progressoParcial = { INTERESSES: { concluida: true }, HABILIDADES: { concluida: false } }
  assert.equal(calcularEtapaDesbloqueada(progressoParcial, 'PERFIL'), false)

  const progressoCompleto = { INTERESSES: { concluida: true }, HABILIDADES: { concluida: true } }
  assert.equal(calcularEtapaDesbloqueada(progressoCompleto, 'PERFIL'), true)
})

test('etapa desconhecida ou progresso ausente não quebra a função', () => {
  assert.equal(calcularEtapaDesbloqueada({}, 'PERFIL'), false)
})
