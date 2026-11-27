import assert from 'node:assert/strict';
import test from 'node:test';
import { getTableSet } from '@tempo-certo/reference-tables';
import { addJob, addSalary, createCase, setModalities } from './case.js';
import { catalogVersion } from './catalog.js';
import { CalculationError, compareTotals, ENGINE_VERSION, runModality } from './engine.js';

function sampleCase() {
  let c = createCase({ nome: 'Segurado Exemplo' });
  c = addJob(c, { employer: 'Tempo 1', start: '1986-02-01', end: '1990-06-12', factor: 1 });
  c = addJob(c, { employer: 'Tempo 2', start: '1990-12-03', end: '1994-06-02', factor: 1 });
  c = addJob(c, { employer: 'Tempo 3', start: '1994-07-01', end: '2019-09-30', factor: 1 });
  c = addSalary(c, { competence: '2019-01', value: 3000 });
  c = addSalary(c, { competence: '2020-01', value: 3200 });
  c = addSalary(c, { competence: '2021-01', value: 3400 });
  c = setModalities(c, ['tempo-contribuicao', 'rmi-lei-9876']);
  return c;
}

test('tempo de contribuição retorna anos/meses/dias e linhas', () => {
  const result = runModality('tempo-contribuicao', sampleCase());
  assert.ok(Number(result.totals.anos) >= 30);
  assert.ok(result.lines.length === 3);
  assert.equal(result.tablesVersionId, 'tables-sample-v1');
});

test('recusa tempo sem vínculos', () => {
  const c = createCase({ nome: 'X' });
  assert.throws(() => runModality('tempo-contribuicao', c), (err: unknown) => {
    assert.ok(err instanceof CalculationError);
    assert.match((err as Error).message, /Vínculos/);
    return true;
  });
});

test('RMI Lei 9.876 com SB coeficiente e RMI', () => {
  const result = runModality('rmi-lei-9876', sampleCase());
  assert.ok(Number(result.totals.salarioBeneficio) > 0);
  assert.ok(Number(result.totals.coeficiente) > 0);
  assert.ok(Number(result.totals.rmi) > 0);
});

test('EC 103 tempo e valor com metadados', () => {
  const tempo = runModality('tempo-ec103-art15', sampleCase());
  assert.equal(tempo.parentModalityId, 'tempo-ec103');
  assert.equal(tempo.engineVersion.length > 0, true);
  const valor = runModality('ec103-art15-voluntaria', sampleCase());
  assert.equal(valor.parentModalityId, 'beneficio-ec103');
  assert.ok(Number(valor.totals.beneficio) > 0);
});

test('determinismo', () => {
  const c = sampleCase();
  const a = runModality('rmi-lei-9876', c);
  const b = runModality('rmi-lei-9876', c);
  assert.deepEqual(a.totals, b.totals);
});

test('P1 diferenças e divisor', () => {
  const c = sampleCase();
  for (const id of [
    'rmi-lei-9876-concomitantes',
    'rmi-ortn-otn-8213',
    'diferencas-rmi',
    'diferencas-salario-beneficio',
    'diferencas-salario-minimo',
    'diferencas-art45',
    'divisor-minimo',
    'simular-salarios-beneficio',
  ]) {
    const r = runModality(id, c);
    assert.equal(r.parentModalityId, id);
  }
});

test('melhor benefício P1', () => {
  const c = sampleCase();
  for (const id of ['melhor-beneficio-tempo', 'melhor-beneficio-idade', 'melhor-beneficio-especial']) {
    const r = runModality(id, c);
    assert.ok(Number(r.totals.melhorRmi) > 0);
  }
});

test('P2 atrasados e pensão', () => {
  const c = sampleCase();
  const a = runModality('contribuicoes-atraso', c);
  assert.ok(Number(a.totals.total) > 0);
  const p = runModality('pensao-acumulacao', c);
  assert.ok(Number(p.totals.pensao) > 0);
});

test('compareTotals respeita tolerância', () => {
  const r = runModality('rmi-lei-9876', sampleCase());
  const ok = compareTotals(r.totals, { rmi: Number(r.totals.rmi) }, 0.01);
  assert.equal(ok.ok, true);
  const bad = compareTotals(r.totals, { rmi: Number(r.totals.rmi) + 10 }, 0.01);
  assert.equal(bad.ok, false);
});

test('resultado antigo preserva versionId mesmo com V2 disponível', () => {
  const c = sampleCase();
  const v1 = getTableSet('tables-sample-v1');
  const r = runModality('rmi-lei-9876', c, v1);
  assert.equal(r.tablesVersionId, 'tables-sample-v1');
  const v2 = getTableSet('tables-sample-v2');
  assert.notEqual(v2.ceiling['2025-01'], v1.ceiling['2025-01']);
});

test('metadados expõem ENGINE_VERSION e catalogVersion atuais', () => {
  const r = runModality('tempo-contribuicao', sampleCase());
  assert.equal(ENGINE_VERSION, '0.2.0');
  assert.equal(catalogVersion(), '1.1.0');
  assert.equal(r.engineVersion, '0.2.0');
  assert.equal(r.catalogVersion, '1.1.0');
});
