import assert from 'node:assert/strict';
import test from 'node:test';
import { getModality, listModalities, resolveModalityId } from './catalog.js';

test('lista modalidades principais incluindo IDs 0-16, divisor e revisões P2', () => {
  const list = listModalities();
  assert.ok(list.length >= 24);
  const ids = new Set(list.map((m) => m.id));
  for (const id of [
    'tempo-contribuicao',
    'rmi-lei-9876',
    'beneficio-ec103',
    'tempo-ec103',
    'pensao-acumulacao',
    'divisor-minimo',
    'sumula-2-trf4',
    'teto-ec20-ec41',
    'buraco-negro',
    'art58-adct',
    'irsm-0294',
    'art21',
    'art26',
  ]) {
    assert.ok(ids.has(id), `faltou ${id}`);
  }
  const ec = list.find((m) => m.id === 'beneficio-ec103');
  assert.ok((ec?.variants?.length || 0) >= 10);
  assert.equal(list.find((m) => m.id === 'irsm-0294')?.group, 'revisao');
  assert.equal(resolveModalityId('irsm-0294').parentId, 'irsm-0294');
});

test('rejeita modalidade inexistente', () => {
  assert.throws(() => getModality('nao-existe'), /inexistente/);
  assert.throws(() => resolveModalityId('xyz'), /inexistente/);
});

test('ids estáveis entre chamadas', () => {
  const a = listModalities().map((m) => m.id);
  const b = listModalities().map((m) => m.id);
  assert.deepEqual(a, b);
});
