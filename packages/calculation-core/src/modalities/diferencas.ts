import type { TableSet } from '@tempo-certo/reference-tables';
import {
  lookupCoeficiente,
  lookupIndex,
  lookupMinimumWage,
  lookupReajuste,
} from '@tempo-certo/reference-tables';
import type { CaseRecord } from '../case.js';
import { monthProportion } from '../dates.js';
import {
  baseResult,
  computeRmiCore,
  requireSalaries,
  round2,
  type CalculationResult,
} from './shared.js';

function differenceTotals(
  modalityId: string,
  tables: TableSet,
  original: number,
  nova: number,
  linesExtra: { label: string; value: number }[] = [],
): CalculationResult {
  const diff = round2(nova - original);
  return baseResult(
    modalityId,
    modalityId,
    tables,
    { rmiOriginal: round2(original), rmiNova: round2(nova), diferenca: diff },
    [
      { label: 'RMI original', value: round2(original) },
      { label: 'RMI nova', value: round2(nova) },
      { label: 'Diferença', value: diff },
      ...linesExtra,
    ],
  );
}

export function runDiferencasRmi(caseRecord: CaseRecord, tables: TableSet): CalculationResult {
  const original = computeRmiCore(caseRecord, tables).rmi;
  const nova = computeRmiCore(caseRecord, tables, { indexFn: lookupReajuste }).rmi;
  return differenceTotals('diferencas-rmi', tables, original, nova);
}

export function runDiferencasSb(caseRecord: CaseRecord, tables: TableSet): CalculationResult {
  const orig = computeRmiCore(caseRecord, tables);
  const alt = computeRmiCore(caseRecord, tables, { indexFn: lookupReajuste });
  return differenceTotals('diferencas-salario-beneficio', tables, orig.rmi, alt.rmi, [
    { label: 'SB original', value: round2(orig.sb) },
    { label: 'SB nova', value: round2(alt.sb) },
  ]);
}

export function runDiferencasSm(caseRecord: CaseRecord, tables: TableSet): CalculationResult {
  const original = computeRmiCore(caseRecord, tables).rmi;
  const req = caseRecord.client.requerimento || '2025-09-01';
  const sm = lookupMinimumWage(tables, req.slice(0, 7));
  const nova = Math.max(original, sm);
  return differenceTotals('diferencas-salario-minimo', tables, original, nova, [
    { label: 'Salário mínimo competência', value: sm },
  ]);
}

export function runDiferencasArt45(caseRecord: CaseRecord, tables: TableSet): CalculationResult {
  const original = computeRmiCore(caseRecord, tables).rmi;
  let acrescimo = 0.25;
  try {
    acrescimo = lookupCoeficiente(tables, 'art45Acrescimo');
  } catch {
    /* sample tables without coeficientes */
  }
  const hasEspecial = caseRecord.jobs.some((j) => j.especial);
  const nova = original * (1 + (hasEspecial || caseRecord.jobs.length ? acrescimo : 0));
  return differenceTotals('diferencas-art45', tables, original, nova, [
    { label: 'Acréscimo art.45', value: acrescimo },
  ]);
}

export function runDivisorMinimo(caseRecord: CaseRecord, tables: TableSet): CalculationResult {
  requireSalaries(caseRecord, 'Salários obrigatórios para divisor mínimo');
  const count = caseRecord.salaries.length;
  const divisor = Math.max(108, count);
  const sum = caseRecord.salaries.reduce((a, s) => a + s.value * lookupIndex(tables, s.competence), 0);
  const media = sum / divisor;
  return baseResult(
    'divisor-minimo',
    'divisor-minimo',
    tables,
    { contribuicoes: count, divisor, media: round2(media) },
    [
      { label: 'Contribuições', value: count },
      { label: 'Divisor', value: divisor },
      { label: 'Média', value: round2(media) },
    ],
  );
}

export function runSimularSb(caseRecord: CaseRecord, tables: TableSet): CalculationResult {
  requireSalaries(caseRecord, 'Salários obrigatórios para simulação');
  const lines = caseRecord.salaries.map((s) => {
    const days = 30;
    const prop = monthProportion(days);
    const value = round2(s.value * prop * lookupIndex(tables, s.competence));
    return { label: s.competence, value, meta: { dias: days, proporcao: prop } };
  });
  const total = round2(lines.reduce((a, l) => a + Number(l.value), 0));
  return baseResult('simular-salarios-beneficio', 'simular-salarios-beneficio', tables, { totalSimulado: total }, lines);
}
