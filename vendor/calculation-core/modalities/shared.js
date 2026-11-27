import { lookupCeiling, lookupIndex } from '../../reference-tables/index.js';
import { catalogVersion } from '../catalog.js';
import { addYmd, applyCeiling, applyFactor, betweenDates, ymdToDays, } from '../dates.js';
export const ENGINE_VERSION = '0.2.0';
export class CalculationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CalculationError';
    }
}
export function round2(n) {
    return Math.round(n * 100) / 100;
}
export function round4(n) {
    return Math.round(n * 10000) / 10000;
}
export function requireJobs(caseRecord) {
    if (!caseRecord.jobs.length) {
        throw new CalculationError('Vínculos obrigatórios para esta modalidade');
    }
}
export function requireSalaries(caseRecord, message) {
    if (!caseRecord.salaries.length) {
        throw new CalculationError(message);
    }
}
export function sumContributionTime(caseRecord) {
    requireJobs(caseRecord);
    let total = { years: 0, months: 0, days: 0 };
    const lines = [];
    for (const job of caseRecord.jobs) {
        const raw = betweenDates(job.start, job.end);
        const factored = applyFactor(raw, job.factor ?? 1);
        total = addYmd(total, factored);
        lines.push({
            label: job.employer || 'Vínculo',
            value: `${factored.years}a ${factored.months}m ${factored.days}d`,
            meta: { start: job.start, end: job.end, factor: job.factor ?? 1, especial: !!job.especial },
        });
    }
    return { total, lines };
}
export function indexSalaries(salaries, tables, indexFn = lookupIndex) {
    return salaries.map((s) => {
        const idx = indexFn(tables, s.competence);
        const ceiling = lookupCeiling(tables, s.competence);
        const indexed = applyCeiling(s.value * idx, ceiling);
        return { ...s, indexed, idx, ceiling };
    });
}
/** Média do SB: usa 80% dos maiores salários indexados quando há ≥5 contribuições. */
export function salarioBeneficioFromIndexed(indexed) {
    if (!indexed.length)
        return 0;
    const values = indexed.map((s) => s.indexed).sort((a, b) => b - a);
    const keep = values.length >= 5 ? Math.max(1, Math.ceil(values.length * 0.8)) : values.length;
    const subset = values.slice(0, keep);
    return subset.reduce((a, b) => a + b, 0) / subset.length;
}
export function lei9876Coefficient(years) {
    return Math.min(1, 0.7 + Math.max(0, years - 15) * 0.01);
}
export function baseResult(modalityId, parentModalityId, tables, totals, lines, variantId) {
    return {
        modalityId,
        parentModalityId,
        variantId,
        engineVersion: ENGINE_VERSION,
        catalogVersion: catalogVersion(),
        tablesVersionId: tables.versionId,
        totals,
        lines,
    };
}
export function computeRmiCore(caseRecord, tables, options) {
    requireSalaries(caseRecord, 'Salários obrigatórios para cálculo de RMI');
    const salaries = options?.salaryTransform
        ? caseRecord.salaries.map(options.salaryTransform)
        : caseRecord.salaries;
    const indexed = indexSalaries(salaries, tables, options?.indexFn);
    const sb = salarioBeneficioFromIndexed(indexed);
    const time = caseRecord.jobs.length
        ? sumContributionTime(caseRecord).total
        : { years: 0, months: 0, days: 0 };
    const years = Math.max(time.years, 15);
    const coefficient = lei9876Coefficient(years);
    return { sb, coefficient, rmi: sb * coefficient, time, indexed };
}
export function yearsFromJobs(caseRecord) {
    if (!caseRecord.jobs.length)
        return 0;
    return sumContributionTime(caseRecord).total.years;
}
export { ymdToDays };
//# sourceMappingURL=shared.js.map