import type { TableSet } from '@tempo-certo/reference-tables';
import type { CaseRecord } from '../case.js';
import { type CalculationResult } from './shared.js';
export declare function runContribuicoesAtraso(caseRecord: CaseRecord, tables: TableSet): CalculationResult;
/**
 * Acumulação EC 103: 100% do maior + faixa sobre o menor (SM).
 */
export declare function runPensaoAcumulacao(caseRecord: CaseRecord, tables: TableSet): CalculationResult;
export declare function runCalculoVersaoAnterior(caseRecord: CaseRecord, tables: TableSet): CalculationResult;
//# sourceMappingURL=extras.d.ts.map