import assert from 'node:assert/strict';
import test from 'node:test';
import { addJob, createCase, listModalities, runModality } from './index.js';

test('cliente mínimo só com contrato público lista e calcula', () => {
  assert.ok(listModalities().length >= 17);
  let c = createCase({ nome: 'Mobile' });
  c = addJob(c, { employer: 'A', start: '2000-01-01', end: '2010-01-01', factor: 1 });
  const result = runModality('tempo-contribuicao', c);
  assert.ok(Number(result.totals.anos) >= 9);
});
