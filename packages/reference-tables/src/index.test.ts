import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getTableSet,
  getTablesForDate,
  listTableVersions,
  lookupCeiling,
  lookupIrsm,
  lookupMinimumWage,
  lookupTetoEc41,
} from './index.js';

test('lista versões e lookup por competência', () => {
  const versions = listTableVersions();
  assert.ok(versions.includes('tables-sample-v1'));
  assert.ok(versions.includes('tables-sample-v2'));
  assert.ok(versions.includes('tables-sample-v3'));
  const v1 = getTableSet('tables-sample-v1');
  assert.ok(lookupMinimumWage(v1, '2025-09') > 0);
  assert.ok(lookupCeiling(v1, '2024-01') > 0);
});

test('V3 cobre IRSM/tetos; V1 sem mapa lança erro claro', () => {
  const v3 = getTableSet('tables-sample-v3');
  assert.ok(lookupIrsm(v3, '1994-02') > 1);
  assert.ok(lookupTetoEc41(v3, '2004-01') > 0);
  const v1 = getTableSet('tables-sample-v1');
  assert.throws(() => lookupIrsm(v1, '1994-02'), /IRSM|ausente/);
});

test('competência fora do início falha ou usa nearest', () => {
  const v1 = getTableSet('tables-sample-v1');
  assert.ok(lookupMinimumWage(v1, '2012-06') > 0);
  assert.throws(() => lookupMinimumWage(v1, '1900-01'), /fora da cobertura|Competência/);
});

test('preservação: V1 e V2 coexistentes', () => {
  const v1 = getTableSet('tables-sample-v1');
  const v2 = getTableSet('tables-sample-v2');
  assert.notEqual(v1.versionId, v2.versionId);
  const forDate = getTablesForDate('2025-11-01');
  assert.equal(forDate.versionId, 'tables-sample-v2');
  const older = getTablesForDate('2020-01-15');
  assert.equal(older.versionId, 'tables-sample-v1');
});
