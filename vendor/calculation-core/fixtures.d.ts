import { type CaseRecord } from './case.js';
import { type CalculationTotals } from './engine.js';
export interface GoldenFixture {
    modalityId: string;
    source: 'documented-rule' | 'delphi-export';
    tablesVersionId: string;
    tolerance?: number | Record<string, number>;
    case: {
        client: {
            nome: string;
            requerimento?: string;
            sexo?: 'M' | 'F';
        };
        jobs: Array<{
            employer: string;
            start: string;
            end: string;
            factor?: number;
            especial?: boolean;
        }>;
        salaries: Array<{
            competence: string;
            value: number;
        }>;
    };
    expectedTotals: CalculationTotals;
}
export declare function listFixtureFiles(): string[];
export declare function loadFixture(fileName: string): GoldenFixture;
export declare function fixtureToCase(fixture: GoldenFixture): CaseRecord;
export declare function runGoldenFixture(fileName: string): {
    ok: boolean;
    diffs: string[];
    actual: CalculationTotals;
    fixture: GoldenFixture;
};
//# sourceMappingURL=fixtures.d.ts.map