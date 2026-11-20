import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getTableSet,
  getTablesForDate,
  listTableVersions,
  lookupCeiling,
  lookupMinimumWage,
} from './index.js';

test('lista versões e lookup por competência', () => {
  const versions = listTableVersions();
  assert.ok(versions.includes('tables-sample-v1'));
  assert.ok(versions.includes('tables-sample-v2'));
  const v1 = getTableSet('tables-sample-v1');
  assert.ok(lookupMinimumWage(v1, '2025-09') > 0);
  assert.ok(lookupCeiling(v1, '2024-01') > 0);
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
