import type { TableSet } from '@tempo-certo/reference-tables';
import { defaultTables } from '@tempo-certo/reference-tables';
import { resolveModalityId } from './catalog.js';
import type { CaseRecord } from './case.js';
import {
  runDiferencasArt45,
  runDiferencasRmi,
  runDiferencasSb,
  runDiferencasSm,
  runDivisorMinimo,
  runSimularSb,
} from './modalities/diferencas.js';
import { runBeneficioEc103 } from './modalities/ec103.js';
import {
  runCalculoVersaoAnterior,
  runContribuicoesAtraso,
  runPensaoAcumulacao,
} from './modalities/extras.js';
import { runMelhorBeneficio } from './modalities/melhor-beneficio.js';
import {
  runArt21,
  runArt26,
  runArt58Adct,
  runBuracoNegro,
  runIrsm0294,
  runSumula2Trf4,
  runTetoEc20Ec41,
} from './modalities/revisoes-p2.js';
import { runRmiConcomitantes, runRmiLei9876, runRmiOrtnOtn } from './modalities/rmi.js';
import {
  CalculationError,
  ENGINE_VERSION,
  type CalculationResult,
  type CalculationTotals,
} from './modalities/shared.js';
import { runTempoContribuicao, runTempoEc103 } from './modalities/tempo.js';

export {
  CalculationError,
  ENGINE_VERSION,
  type CalculationLine,
  type CalculationResult,
  type CalculationTotals,
} from './modalities/shared.js';

export function runModality(
  modalityId: string,
  caseRecord: CaseRecord,
  tables: TableSet = defaultTables(),
): CalculationResult {
  const resolved = resolveModalityId(modalityId);
  const parent = resolved.parentId;
  const variantId = resolved.variantId;

  switch (parent) {
    case 'tempo-contribuicao':
      return runTempoContribuicao(caseRecord, tables);
    case 'tempo-ec103':
      return runTempoEc103(modalityId, variantId, caseRecord, tables);
    case 'rmi-lei-9876':
      return runRmiLei9876(caseRecord, tables);
    case 'rmi-lei-9876-concomitantes':
      return runRmiConcomitantes(caseRecord, tables);
    case 'rmi-ortn-otn-8213':
      return runRmiOrtnOtn(caseRecord, tables);
    case 'diferencas-rmi':
      return runDiferencasRmi(caseRecord, tables);
    case 'diferencas-salario-beneficio':
      return runDiferencasSb(caseRecord, tables);
    case 'diferencas-salario-minimo':
      return runDiferencasSm(caseRecord, tables);
    case 'diferencas-art45':
      return runDiferencasArt45(caseRecord, tables);
    case 'simular-salarios-beneficio':
      return runSimularSb(caseRecord, tables);
    case 'melhor-beneficio-tempo':
    case 'melhor-beneficio-idade':
    case 'melhor-beneficio-especial':
      return runMelhorBeneficio(parent, caseRecord, tables);
    case 'beneficio-ec103':
      return runBeneficioEc103(modalityId, variantId, caseRecord, tables);
    case 'divisor-minimo':
      return runDivisorMinimo(caseRecord, tables);
    case 'contribuicoes-atraso':
      return runContribuicoesAtraso(caseRecord, tables);
    case 'pensao-acumulacao':
      return runPensaoAcumulacao(caseRecord, tables);
    case 'calculo-versao-anterior':
      return runCalculoVersaoAnterior(caseRecord, tables);
    case 'irsm-0294':
      return runIrsm0294(caseRecord, tables);
    case 'teto-ec20-ec41':
      return runTetoEc20Ec41(caseRecord, tables);
    case 'buraco-negro':
      return runBuracoNegro(caseRecord, tables);
    case 'art58-adct':
      return runArt58Adct(caseRecord, tables);
    case 'art21':
      return runArt21(caseRecord, tables);
    case 'art26':
      return runArt26(caseRecord, tables);
    case 'sumula-2-trf4':
      return runSumula2Trf4(caseRecord, tables);
    default:
      throw new CalculationError(`Modalidade ainda não implementada: ${modalityId}`);
  }
}

export function compareTotals(
  actual: CalculationTotals,
  expected: CalculationTotals,
  tolerance: number | Record<string, number> = 0.01,
): { ok: boolean; diffs: string[] } {
  const diffs: string[] = [];
  for (const [key, exp] of Object.entries(expected)) {
    const act = actual[key];
    const tol = typeof tolerance === 'number' ? tolerance : (tolerance[key] ?? 0.01);
    if (typeof exp === 'number' && typeof act === 'number') {
      if (Math.abs(act - exp) > tol) diffs.push(`${key}: ${act} != ${exp}`);
    } else if (JSON.stringify(act) !== JSON.stringify(exp)) {
      diffs.push(`${key}: ${JSON.stringify(act)} != ${JSON.stringify(exp)}`);
    }
  }
  return { ok: diffs.length === 0, diffs };
}
