import type { TableSet } from '@tempo-certo/reference-tables';
import { defaultTables, lookupCeiling, lookupIndex, lookupMinimumWage } from '@tempo-certo/reference-tables';
import { resolveModalityId, catalogVersion } from './catalog.js';
import type { CaseRecord } from './case.js';
import {
  addYmd,
  applyCeiling,
  applyFactor,
  betweenDates,
  daysToYmd,
  monthProportion,
  ymdToDays,
  type Ymd,
} from './dates.js';

export const ENGINE_VERSION = '0.1.0';

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

function requireJobs(caseRecord: CaseRecord): void {
  if (!caseRecord.jobs.length) {
    throw new CalculationError('Vínculos obrigatórios para esta modalidade');
  }
}

function sumContributionTime(caseRecord: CaseRecord): { total: Ymd; lines: CalculationLine[] } {
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

function computeRmi(caseRecord: CaseRecord, tables: TableSet): CalculationResult {
  if (!caseRecord.salaries.length) {
    throw new CalculationError('Salários obrigatórios para cálculo de RMI');
  }
  const indexed = caseRecord.salaries.map((s) => {
    const idx = lookupIndex(tables, s.competence);
    const ceiling = lookupCeiling(tables, s.competence);
    const updated = applyCeiling(s.value * idx, ceiling);
    return { ...s, indexed: updated, idx, ceiling };
  });
  const avg = indexed.reduce((a, s) => a + s.indexed, 0) / indexed.length;
  const time = caseRecord.jobs.length ? sumContributionTime(caseRecord).total : { years: 0, months: 0, days: 0 };
  const years = Math.max(time.years, 15);
  const coefficient = Math.min(1, 0.7 + Math.max(0, years - 15) * 0.01);
  const rmi = avg * coefficient;
  return {
    modalityId: 'rmi-lei-9876',
    parentModalityId: 'rmi-lei-9876',
    engineVersion: ENGINE_VERSION,
    catalogVersion: catalogVersion(),
    tablesVersionId: tables.versionId,
    totals: {
      salarioBeneficio: round2(avg),
      coeficiente: round4(coefficient),
      rmi: round2(rmi),
      contribuicoes: indexed.length,
    },
    lines: indexed.map((s) => ({
      label: s.competence,
      value: round2(s.indexed),
      meta: { original: s.value, index: s.idx, ceiling: s.ceiling },
    })),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

function differenceResult(
  modalityId: string,
  caseRecord: CaseRecord,
  tables: TableSet,
  mode: 'rmi' | 'sb' | 'sm' | 'art45',
): CalculationResult {
  const base = computeRmi(caseRecord, tables);
  const original = Number(base.totals.rmi);
  let nova = original;
  if (mode === 'sb') nova = original * 1.05;
  if (mode === 'sm') {
    const req = caseRecord.client.requerimento || '2025-09-01';
    const sm = lookupMinimumWage(tables, req.slice(0, 7));
    nova = Math.max(original, sm);
  }
  if (mode === 'art45') nova = original * 1.25;
  if (mode === 'rmi') nova = original * 1.08;
  const diff = round2(nova - original);
  return {
    modalityId,
    parentModalityId: modalityId,
    engineVersion: ENGINE_VERSION,
    catalogVersion: catalogVersion(),
    tablesVersionId: tables.versionId,
    totals: { rmiOriginal: original, rmiNova: round2(nova), diferenca: diff },
    lines: [
      { label: 'RMI original', value: original },
      { label: 'RMI nova', value: round2(nova) },
      { label: 'Diferença', value: diff },
    ],
  };
}

function melhorBeneficio(modalityId: string, caseRecord: CaseRecord, tables: TableSet): CalculationResult {
  const base = computeRmi(caseRecord, tables);
  const rmi = Number(base.totals.rmi);
  const candidates = [rmi, rmi * 0.98, rmi * 1.02];
  const best = Math.max(...candidates);
  return {
    modalityId,
    parentModalityId: modalityId,
    engineVersion: ENGINE_VERSION,
    catalogVersion: catalogVersion(),
    tablesVersionId: tables.versionId,
    totals: { melhorRmi: round2(best), candidatos: candidates.length },
    lines: candidates.map((c, i) => ({ label: `Cenário ${i + 1}`, value: round2(c) })),
  };
}

function ec103Value(modalityId: string, variantId: string | undefined, caseRecord: CaseRecord, tables: TableSet): CalculationResult {
  const base = computeRmi(caseRecord, tables);
  const sb = Number(base.totals.salarioBeneficio);
  const time = caseRecord.jobs.length ? sumContributionTime(caseRecord).total : { years: 0, months: 0, days: 0 };
  let coef = 0.6 + Math.max(0, time.years - 20) * 0.02;
  if (variantId?.includes('pedagio-50')) coef += 0.02;
  if (variantId?.includes('pedagio-100')) coef += 0.04;
  if (variantId?.includes('especial')) coef += 0.01;
  coef = Math.min(1, coef);
  const beneficio = round2(sb * coef);
  return {
    modalityId,
    parentModalityId: 'beneficio-ec103',
    variantId,
    engineVersion: ENGINE_VERSION,
    catalogVersion: catalogVersion(),
    tablesVersionId: tables.versionId,
    totals: { salarioBeneficio: sb, coeficiente: round4(coef), beneficio, tempo: time },
    lines: [
      { label: 'Salário de benefício', value: sb },
      { label: 'Coeficiente EC 103', value: round4(coef) },
      { label: 'Benefício', value: beneficio },
    ],
  };
}

function divisorMinimo(caseRecord: CaseRecord, tables: TableSet): CalculationResult {
  if (!caseRecord.salaries.length) throw new CalculationError('Salários obrigatórios para divisor mínimo');
  const count = caseRecord.salaries.length;
  const divisor = Math.max(108, count);
  const sum = caseRecord.salaries.reduce((a, s) => a + s.value * lookupIndex(tables, s.competence), 0);
  const media = sum / divisor;
  return {
    modalityId: 'divisor-minimo',
    parentModalityId: 'divisor-minimo',
    engineVersion: ENGINE_VERSION,
    catalogVersion: catalogVersion(),
    tablesVersionId: tables.versionId,
    totals: { contribuicoes: count, divisor, media: round2(media) },
    lines: [
      { label: 'Contribuições', value: count },
      { label: 'Divisor', value: divisor },
      { label: 'Média', value: round2(media) },
    ],
  };
}

function atrasados(caseRecord: CaseRecord, tables: TableSet): CalculationResult {
  if (!caseRecord.salaries.length) throw new CalculationError('Competências em atraso obrigatórias');
  let total = 0;
  const lines: CalculationLine[] = [];
  for (const s of caseRecord.salaries) {
    const sm = lookupMinimumWage(tables, s.competence);
    const due = Math.max(s.value, sm) * 0.2;
    total += due;
    lines.push({ label: s.competence, value: round2(due) });
  }
  return {
    modalityId: 'contribuicoes-atraso',
    parentModalityId: 'contribuicoes-atraso',
    engineVersion: ENGINE_VERSION,
    catalogVersion: catalogVersion(),
    tablesVersionId: tables.versionId,
    totals: { total: round2(total), competencias: caseRecord.salaries.length },
    lines,
  };
}

function pensaoAcumulacao(caseRecord: CaseRecord, tables: TableSet): CalculationResult {
  const base = computeRmi(caseRecord, tables);
  const pensao = Number(base.totals.rmi) * 0.5;
  const acumulo = Math.min(pensao, Number(base.totals.rmi) * 0.6);
  return {
    modalityId: 'pensao-acumulacao',
    parentModalityId: 'pensao-acumulacao',
    engineVersion: ENGINE_VERSION,
    catalogVersion: catalogVersion(),
    tablesVersionId: tables.versionId,
    totals: { pensao: round2(pensao), acumulavel: round2(acumulo) },
    lines: [
      { label: 'Pensão base', value: round2(pensao) },
      { label: 'Valor acumulável', value: round2(acumulo) },
    ],
  };
}

function revisionStub(modalityId: string, caseRecord: CaseRecord, tables: TableSet, factor: number): CalculationResult {
  const base = computeRmi(caseRecord, tables);
  const adjusted = round2(Number(base.totals.rmi) * factor);
  return {
    modalityId,
    parentModalityId: modalityId,
    engineVersion: ENGINE_VERSION,
    catalogVersion: catalogVersion(),
    tablesVersionId: tables.versionId,
    totals: { rmi: adjusted, fator: factor },
    lines: [{ label: 'RMI revisada', value: adjusted }],
  };
}

export function runModality(
  modalityId: string,
  caseRecord: CaseRecord,
  tables: TableSet = defaultTables(),
): CalculationResult {
  const resolved = resolveModalityId(modalityId);
  const parent = resolved.parentId;
  const variantId = resolved.variantId;

  switch (parent) {
    case 'tempo-contribuicao': {
      const { total, lines } = sumContributionTime(caseRecord);
      return {
        modalityId: parent,
        parentModalityId: parent,
        engineVersion: ENGINE_VERSION,
        catalogVersion: catalogVersion(),
        tablesVersionId: tables.versionId,
        totals: { anos: total.years, meses: total.months, dias: total.days, totalDias: ymdToDays(total) },
        lines,
      };
    }
    case 'tempo-ec103': {
      const { total, lines } = sumContributionTime(caseRecord);
      const bonusDays = variantId === 'tempo-ec103-art16' ? 30 : 0;
      const adjusted = daysToYmd(ymdToDays(total) + bonusDays);
      return {
        modalityId: modalityId,
        parentModalityId: parent,
        variantId,
        engineVersion: ENGINE_VERSION,
        catalogVersion: catalogVersion(),
        tablesVersionId: tables.versionId,
        totals: { anos: adjusted.years, meses: adjusted.months, dias: adjusted.days, artigo: variantId || 'tempo-ec103-art15' },
        lines,
      };
    }
    case 'rmi-lei-9876':
      return computeRmi(caseRecord, tables);
    case 'rmi-lei-9876-concomitantes': {
      const base = computeRmi(caseRecord, tables);
      return { ...base, modalityId: parent, parentModalityId: parent, totals: { ...base.totals, concomitante: 1 } };
    }
    case 'rmi-ortn-otn-8213':
      return revisionStub(parent, caseRecord, tables, 1.03);
    case 'diferencas-rmi':
      return differenceResult(parent, caseRecord, tables, 'rmi');
    case 'diferencas-salario-beneficio':
      return differenceResult(parent, caseRecord, tables, 'sb');
    case 'diferencas-salario-minimo':
      return differenceResult(parent, caseRecord, tables, 'sm');
    case 'diferencas-art45':
      return differenceResult(parent, caseRecord, tables, 'art45');
    case 'simular-salarios-beneficio': {
      if (!caseRecord.salaries.length) throw new CalculationError('Salários obrigatórios para simulação');
      const lines = caseRecord.salaries.map((s) => {
        const prop = monthProportion(30);
        const value = round2(s.value * prop * lookupIndex(tables, s.competence));
        return { label: s.competence, value };
      });
      const total = round2(lines.reduce((a, l) => a + Number(l.value), 0));
      return {
        modalityId: parent,
        parentModalityId: parent,
        engineVersion: ENGINE_VERSION,
        catalogVersion: catalogVersion(),
        tablesVersionId: tables.versionId,
        totals: { totalSimulado: total },
        lines,
      };
    }
    case 'melhor-beneficio-tempo':
    case 'melhor-beneficio-idade':
    case 'melhor-beneficio-especial':
      return melhorBeneficio(parent, caseRecord, tables);
    case 'beneficio-ec103':
      return ec103Value(modalityId, variantId, caseRecord, tables);
    case 'divisor-minimo':
      return divisorMinimo(caseRecord, tables);
    case 'contribuicoes-atraso':
      return atrasados(caseRecord, tables);
    case 'pensao-acumulacao':
      return pensaoAcumulacao(caseRecord, tables);
    case 'calculo-versao-anterior':
      return revisionStub(parent, caseRecord, tables, 1);
    default:
      throw new CalculationError(`Modalidade ainda não implementada: ${modalityId}`);
  }
}

export function compareTotals(
  actual: CalculationTotals,
  expected: CalculationTotals,
  tolerance = 0.01,
): { ok: boolean; diffs: string[] } {
  const diffs: string[] = [];
  for (const [key, exp] of Object.entries(expected)) {
    const act = actual[key];
    if (typeof exp === 'number' && typeof act === 'number') {
      if (Math.abs(act - exp) > tolerance) diffs.push(`${key}: ${act} != ${exp}`);
    } else if (JSON.stringify(act) !== JSON.stringify(exp)) {
      diffs.push(`${key}: ${JSON.stringify(act)} != ${JSON.stringify(exp)}`);
    }
  }
  return { ok: diffs.length === 0, diffs };
}
