import assert from 'node:assert/strict';
import test from 'node:test';
import { getModality, listModalities, resolveModalityId } from './catalog.js';

test('lista modalidades principais incluindo IDs 0-16 e divisor', () => {
  const list = listModalities();
  assert.ok(list.length >= 17);
  const ids = new Set(list.map((m) => m.id));
  for (const id of [
    'tempo-contribuicao',
    'rmi-lei-9876',
    'beneficio-ec103',
    'tempo-ec103',
    'pensao-acumulacao',
    'divisor-minimo',
  ]) {
    assert.ok(ids.has(id), `faltou ${id}`);
  }
  const ec = list.find((m) => m.id === 'beneficio-ec103');
  assert.ok((ec?.variants?.length || 0) >= 10);
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
