import type { TableSet } from '@tempo-certo/reference-tables';
import type { CaseRecord } from '../case.js';
import { type CalculationResult } from './shared.js';
export declare function runTempoContribuicao(caseRecord: CaseRecord, tables: TableSet): CalculationResult;
/**
 * Tempo EC 103: art.15 = tempo puro; art.16 = tempo + pedágio residual (50% do que falta para 35 anos).
 */
export declare function runTempoEc103(modalityId: string, variantId: string | undefined, caseRecord: CaseRecord, tables: TableSet): CalculationResult;
//# sourceMappingURL=tempo.d.ts.map