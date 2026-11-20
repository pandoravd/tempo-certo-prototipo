import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addJob,
  addSalary,
  applyCnisPreview,
  createCase,
  exportCaseJson,
  importCaseJson,
  previewCnisJson,
  removeJob,
  validateCase,
} from './case.js';

test('cria caso com nome obrigatório', () => {
  assert.throws(() => createCase({ nome: '  ' }), /obrigatório/);
  const c = createCase({ nome: 'Maria' });
  assert.equal(c.client.nome, 'Maria');
  assert.equal(validateCase(c).length, 0);
});

test('CRUD vínculos/salários e round-trip JSON', () => {
  let c = createCase({ nome: 'João' });
  c = addJob(c, { employer: 'Empresa A', start: '2000-01-01', end: '2010-12-31', factor: 1 });
  c = addSalary(c, { competence: '2010-01', value: 2000 });
  const raw = exportCaseJson(c);
  const restored = importCaseJson(raw);
  assert.equal(restored.client.nome, 'João');
  assert.equal(restored.jobs.length, 1);
  assert.equal(restored.salaries.length, 1);
  const afterRemove = removeJob(restored, restored.jobs[0].id);
  assert.equal(afterRemove.jobs.length, 0);
});

test('CNIS preview exige confirmação', () => {
  const c = createCase({ nome: 'Ana' });
  const preview = previewCnisJson(
    JSON.stringify({
      client: { nome: 'Ana CNIS', cpf: '123' },
      jobs: [{ employer: 'X', start: '2015-01-01', end: '2018-01-01' }],
      salaries: [{ competence: '2017-01', value: 1500 }],
    }),
  );
  const untouched = applyCnisPreview(c, preview, false);
  assert.equal(untouched.jobs.length, 0);
  assert.equal(untouched.client.cpf, undefined);
  const applied = applyCnisPreview(c, preview, true);
  assert.equal(applied.jobs.length, 1);
  assert.equal(applied.client.cpf, '123');
});
