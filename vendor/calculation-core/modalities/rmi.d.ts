import type { TableSet } from '@tempo-certo/reference-tables';
import type { CaseRecord } from '../case.js';
import { type CalculationResult } from './shared.js';
export declare function runRmiLei9876(caseRecord: CaseRecord, tables: TableSet): CalculationResult;
/** Concomitantes: por competência, usa o maior salário quando há sobreposição de vínculos. */
export declare function runRmiConcomitantes(caseRecord: CaseRecord, tables: TableSet): CalculationResult;
/** ORTN/OTN: aplica fator ORTN da competência antes do índice padrão. */
export declare function runRmiOrtnOtn(caseRecord: CaseRecord, tables: TableSet): CalculationResult;
//# sourceMappingURL=rmi.d.ts.map