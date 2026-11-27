import type { TableSet } from '@tempo-certo/reference-tables';
import type { CaseRecord } from './case.js';
import { type CalculationResult, type CalculationTotals } from './modalities/shared.js';
export { CalculationError, ENGINE_VERSION, type CalculationLine, type CalculationResult, type CalculationTotals, } from './modalities/shared.js';
export declare function runModality(modalityId: string, caseRecord: CaseRecord, tables?: TableSet): CalculationResult;
export declare function compareTotals(actual: CalculationTotals, expected: CalculationTotals, tolerance?: number | Record<string, number>): {
    ok: boolean;
    diffs: string[];
};
//# sourceMappingURL=engine.d.ts.map