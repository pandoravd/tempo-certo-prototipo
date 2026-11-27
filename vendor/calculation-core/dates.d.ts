/** Utilitários de data alinhados ao uso previdenciário (EntreDatas / proporção). */
export interface Ymd {
    years: number;
    months: number;
    days: number;
}
export declare function parseIsoDate(value: string): Date;
export declare function toIsoDate(d: Date): string;
/** Contagem inclusiva estilo previdenciário aproximada (anos/meses/dias). */
export declare function betweenDates(startIso: string, endIso: string): Ymd;
export declare function ymdToDays(ymd: Ymd): number;
export declare function daysToYmd(totalDays: number): Ymd;
export declare function applyFactor(ymd: Ymd, factor: number): Ymd;
export declare function addYmd(a: Ymd, b: Ymd): Ymd;
/** Proporção de dias no mês (para salários parciais). */
export declare function monthProportion(daysWorked: number, daysInMonth?: number): number;
export declare function applyCeiling(value: number, ceiling: number): number;
//# sourceMappingURL=dates.d.ts.map