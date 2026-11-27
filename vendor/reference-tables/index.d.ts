export interface TableSet {
    versionId: string;
    effectiveFrom: string;
    effectiveTo: string | null;
    source?: string;
    minimumWage: Record<string, number>;
    ceiling: Record<string, number>;
    index: Record<string, number>;
    reajuste?: Record<string, number>;
    irsm?: Record<string, number>;
    tetoEc20?: Record<string, number>;
    tetoEc41?: Record<string, number>;
    buracoNegro?: Record<string, number>;
    ortn?: Record<string, number>;
    coeficientes?: Record<string, number>;
}
export declare function listTableVersions(): string[];
export declare function getTableSet(versionId: string): TableSet;
export declare function getTablesForDate(isoDate: string): TableSet;
export declare function lookupMinimumWage(tables: TableSet, competence: string): number;
export declare function lookupCeiling(tables: TableSet, competence: string): number;
export declare function lookupIndex(tables: TableSet, competence: string): number;
export declare function lookupReajuste(tables: TableSet, competence: string): number;
export declare function lookupIrsm(tables: TableSet, competence: string): number;
export declare function lookupTetoEc20(tables: TableSet, competence: string): number;
export declare function lookupTetoEc41(tables: TableSet, competence: string): number;
export declare function lookupBuracoNegro(tables: TableSet, competence: string): number;
export declare function lookupOrtn(tables: TableSet, competence: string): number;
export declare function lookupCoeficiente(tables: TableSet, key: string): number;
export declare function defaultTables(): TableSet;
//# sourceMappingURL=index.d.ts.map