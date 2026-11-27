import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTableSet } from '@tempo-certo/reference-tables';
import { addJob, addSalary, createCase, type CaseRecord } from './case.js';
import { compareTotals, runModality, type CalculationTotals } from './engine.js';

export interface GoldenFixture {
  modalityId: string;
  source: 'documented-rule' | 'delphi-export';
  tablesVersionId: string;
  tolerance?: number | Record<string, number>;
  case: {
    client: { nome: string; requerimento?: string; sexo?: 'M' | 'F' };
    jobs: Array<{
      employer: string;
      start: string;
      end: string;
      factor?: number;
      especial?: boolean;
    }>;
    salaries: Array<{ competence: string; value: number }>;
  };
  expectedTotals: CalculationTotals;
}

function fixturesDir(): string {
  return join(dirname(fileURLToPath(import.meta.url)), '..', 'fixtures');
}

export function listFixtureFiles(): string[] {
  return readdirSync(fixturesDir()).filter((f) => f.endsWith('.json'));
}

export function loadFixture(fileName: string): GoldenFixture {
  const raw = readFileSync(join(fixturesDir(), fileName), 'utf8');
  return JSON.parse(raw) as GoldenFixture;
}

export function fixtureToCase(fixture: GoldenFixture): CaseRecord {
  let c = createCase({ nome: fixture.case.client.nome });
  c = {
    ...c,
    client: {
      ...c.client,
      ...fixture.case.client,
    },
  };
  for (const job of fixture.case.jobs) {
    c = addJob(c, job);
  }
  for (const sal of fixture.case.salaries) {
    c = addSalary(c, sal);
  }
  return c;
}

export function runGoldenFixture(fileName: string): {
  ok: boolean;
  diffs: string[];
  actual: CalculationTotals;
  fixture: GoldenFixture;
} {
  const fixture = loadFixture(fileName);
  const tables = getTableSet(fixture.tablesVersionId);
  const result = runModality(fixture.modalityId, fixtureToCase(fixture), tables);
  const compared = compareTotals(result.totals, fixture.expectedTotals, fixture.tolerance ?? 0.01);
  return { ...compared, actual: result.totals, fixture };
}
