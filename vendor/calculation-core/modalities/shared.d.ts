import type { TableSet } from '@tempo-certo/reference-tables';
import type { CaseRecord, SalaryEntry } from '../case.js';
import { ymdToDays, type Ymd } from '../dates.js';
export declare const ENGINE_VERSION = "0.2.0";
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
export declare class CalculationError extends Error {
    constructor(message: string);
}
export declare function round2(n: number): number;
export declare function round4(n: number): number;
export declare function requireJobs(caseRecord: CaseRecord): void;
export declare function requireSalaries(caseRecord: CaseRecord, message: string): void;
export declare function sumContributionTime(caseRecord: CaseRecord): {
    total: Ymd;
    lines: CalculationLine[];
};
export declare function indexSalaries(salaries: SalaryEntry[], tables: TableSet, indexFn?: (tables: TableSet, competence: string) => number): Array<SalaryEntry & {
    indexed: number;
    idx: number;
    ceiling: number;
}>;
/** Média do SB: usa 80% dos maiores salários indexados quando há ≥5 contribuições. */
export declare function salarioBeneficioFromIndexed(indexed: Array<{
    indexed: number;
}>): number;
export declare function lei9876Coefficient(years: number): number;
export declare function baseResult(modalityId: string, parentModalityId: string, tables: TableSet, totals: CalculationTotals, lines: CalculationLine[], variantId?: string): CalculationResult;
export declare function computeRmiCore(caseRecord: CaseRecord, tables: TableSet, options?: {
    indexFn?: (tables: TableSet, competence: string) => number;
    salaryTransform?: (s: SalaryEntry) => SalaryEntry;
}): {
    sb: number;
    coefficient: number;
    rmi: number;
    time: Ymd;
    indexed: ReturnType<typeof indexSalaries>;
};
export declare function yearsFromJobs(caseRecord: CaseRecord): number;
export { ymdToDays };
//# sourceMappingURL=shared.d.ts.map