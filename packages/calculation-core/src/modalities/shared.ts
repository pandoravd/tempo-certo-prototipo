import type { TableSet } from '@tempo-certo/reference-tables';
import { lookupCeiling, lookupIndex } from '@tempo-certo/reference-tables';
import { catalogVersion } from '../catalog.js';
import type { CaseRecord, SalaryEntry } from '../case.js';
import {
  addYmd,
  applyCeiling,
  applyFactor,
  betweenDates,
  ymdToDays,
  type Ymd,
} from '../dates.js';

export const ENGINE_VERSION = '0.2.0';

export interface CalculationLine {
  label: string;
  value: number | string;
  meta?: Record<string, unknown>;
}

export interface CalculationTotals {
  [key: string]: number | string | Ymd;
}

export interface CalculationResult {
  modalityId: string;
  parentModalityId: string;
  variantId?: string;
  engineVersion: string;
  catalogVersion: string;
  tablesVersionId: string;
  totals: CalculationTotals;
  lines: CalculationLine[];
}

export class CalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalculationError';
  }
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

export function requireJobs(caseRecord: CaseRecord): void {
  if (!caseRecord.jobs.length) {
    throw new CalculationError('Vínculos obrigatórios para esta modalidade');
  }
}

export function requireSalaries(caseRecord: CaseRecord, message: string): void {
  if (!caseRecord.salaries.length) {
    throw new CalculationError(message);
  }
}

export function sumContributionTime(caseRecord: CaseRecord): { total: Ymd; lines: CalculationLine[] } {
  requireJobs(caseRecord);
  let total: Ymd = { years: 0, months: 0, days: 0 };
  const lines: CalculationLine[] = [];
  for (const job of caseRecord.jobs) {
    const raw = betweenDates(job.start, job.end);
    const factored = applyFactor(raw, job.factor ?? 1);
    total = addYmd(total, factored);
    lines.push({
      label: job.employer || 'Vínculo',
      value: `${factored.years}a ${factored.months}m ${factored.days}d`,
      meta: { start: job.start, end: job.end, factor: job.factor ?? 1, especial: !!job.especial },
    });
  }
  return { total, lines };
}

export function indexSalaries(
  salaries: SalaryEntry[],
  tables: TableSet,
  indexFn: (tables: TableSet, competence: string) => number = lookupIndex,
): Array<SalaryEntry & { indexed: number; idx: number; ceiling: number }> {
  return salaries.map((s) => {
    const idx = indexFn(tables, s.competence);
    const ceiling = lookupCeiling(tables, s.competence);
    const indexed = applyCeiling(s.value * idx, ceiling);
    return { ...s, indexed, idx, ceiling };
  });
}

/** Média do SB: usa 80% dos maiores salários indexados quando há ≥5 contribuições. */
export function salarioBeneficioFromIndexed(
  indexed: Array<{ indexed: number }>,
): number {
  if (!indexed.length) return 0;
  const values = indexed.map((s) => s.indexed).sort((a, b) => b - a);
  const keep = values.length >= 5 ? Math.max(1, Math.ceil(values.length * 0.8)) : values.length;
  const subset = values.slice(0, keep);
  return subset.reduce((a, b) => a + b, 0) / subset.length;
}

export function lei9876Coefficient(years: number): number {
  return Math.min(1, 0.7 + Math.max(0, years - 15) * 0.01);
}

export function baseResult(
  modalityId: string,
  parentModalityId: string,
  tables: TableSet,
  totals: CalculationTotals,
  lines: CalculationLine[],
  variantId?: string,
): CalculationResult {
  return {
    modalityId,
    parentModalityId,
    variantId,
    engineVersion: ENGINE_VERSION,
    catalogVersion: catalogVersion(),
    tablesVersionId: tables.versionId,
    totals,
    lines,
  };
}

export function computeRmiCore(
  caseRecord: CaseRecord,
  tables: TableSet,
  options?: {
    indexFn?: (tables: TableSet, competence: string) => number;
    salaryTransform?: (s: SalaryEntry) => SalaryEntry;
  },
): { sb: number; coefficient: number; rmi: number; time: Ymd; indexed: ReturnType<typeof indexSalaries> } {
  requireSalaries(caseRecord, 'Salários obrigatórios para cálculo de RMI');
  const salaries = options?.salaryTransform
    ? caseRecord.salaries.map(options.salaryTransform)
    : caseRecord.salaries;
  const indexed = indexSalaries(salaries, tables, options?.indexFn);
  const sb = salarioBeneficioFromIndexed(indexed);
  const time = caseRecord.jobs.length
    ? sumContributionTime(caseRecord).total
    : { years: 0, months: 0, days: 0 };
  const years = Math.max(time.years, 15);
  const coefficient = lei9876Coefficient(years);
  return { sb, coefficient, rmi: sb * coefficient, time, indexed };
}

export function yearsFromJobs(caseRecord: CaseRecord): number {
  if (!caseRecord.jobs.length) return 0;
  return sumContributionTime(caseRecord).total.years;
}

export { ymdToDays };
