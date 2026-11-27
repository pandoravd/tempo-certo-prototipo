import type { TableSet } from '@tempo-certo/reference-tables';
import { lookupMinimumWage } from '@tempo-certo/reference-tables';
import type { CaseRecord } from '../case.js';
import {
  baseResult,
  computeRmiCore,
  round2,
  round4,
  yearsFromJobs,
  type CalculationResult,
} from './shared.js';

function ec103Coefficient(variantId: string | undefined, years: number, sexo: 'M' | 'F' | undefined): number {
  const female = sexo === 'F';
  const baseYears = female ? 15 : 20;
  let coef = 0.6 + Math.max(0, years - baseYears) * 0.02;

  if (variantId?.includes('pedagio-50')) {
    coef = Math.min(1, coef + 0.02);
  } else if (variantId?.includes('pedagio-100')) {
    coef = Math.min(1, coef + 0.04);
  } else if (variantId?.includes('especial') || variantId?.includes('art21')) {
    coef = Math.min(1, 0.6 + Math.max(0, years - 15) * 0.02);
  } else if (variantId?.includes('art18') || variantId?.includes('idade')) {
    coef = Math.min(1, 0.7 + Math.max(0, years - 15) * 0.01);
  } else if (variantId?.includes('art23') || variantId?.includes('pensao')) {
    coef = 0.5;
  } else if (variantId?.includes('art26') || variantId?.includes('incapacidade')) {
    coef = 0.6;
  } else if (variantId?.includes('auxilio-doenca')) {
    coef = 0.91;
  }

  return Math.min(1, Math.max(0, coef));
}

export function runBeneficioEc103(
  modalityId: string,
  variantId: string | undefined,
  caseRecord: CaseRecord,
  tables: TableSet,
): CalculationResult {
  const { sb } = computeRmiCore(caseRecord, tables);
  const years = yearsFromJobs(caseRecord);
  const coef = ec103Coefficient(variantId, years, caseRecord.client.sexo);
  let beneficio = round2(sb * coef);

  if (variantId?.includes('art23') || variantId?.includes('pensao')) {
    const sm = lookupMinimumWage(
      tables,
      (caseRecord.client.requerimento || '2025-09-01').slice(0, 7),
    );
    beneficio = round2(Math.max(beneficio, sm));
  }

  return baseResult(
    modalityId,
    'beneficio-ec103',
    tables,
    {
      salarioBeneficio: round2(sb),
      coeficiente: round4(coef),
      beneficio,
      tempoAnos: years,
    },
    [
      { label: 'Salário de benefício', value: round2(sb) },
      { label: 'Coeficiente EC 103', value: round4(coef) },
      { label: 'Benefício', value: beneficio },
    ],
    variantId,
  );
}
