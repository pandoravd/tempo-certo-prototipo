import { lookupIndex, lookupOrtn } from '../../reference-tables/index.js';
import { baseResult, computeRmiCore, round2, round4, } from './shared.js';
export function runRmiLei9876(caseRecord, tables) {
    const { sb, coefficient, rmi, indexed } = computeRmiCore(caseRecord, tables);
    return baseResult('rmi-lei-9876', 'rmi-lei-9876', tables, {
        salarioBeneficio: round2(sb),
        coeficiente: round4(coefficient),
        rmi: round2(rmi),
        contribuicoes: indexed.length,
    }, indexed.map((s) => ({
        label: s.competence,
        value: round2(s.indexed),
        meta: { original: s.value, index: s.idx, ceiling: s.ceiling },
    })));
}
/** Concomitantes: por competência, usa o maior salário quando há sobreposição de vínculos. */
export function runRmiConcomitantes(caseRecord, tables) {
    const byComp = new Map();
    for (const s of caseRecord.salaries) {
        const prev = byComp.get(s.competence) ?? 0;
        byComp.set(s.competence, Math.max(prev, s.value));
    }
    const collapsed = {
        ...caseRecord,
        salaries: [...byComp.entries()].map(([competence, value], i) => ({
            id: `c-${i}`,
            competence,
            value,
        })),
    };
    const { sb, coefficient, rmi, indexed } = computeRmiCore(collapsed, tables);
    return baseResult('rmi-lei-9876-concomitantes', 'rmi-lei-9876-concomitantes', tables, {
        salarioBeneficio: round2(sb),
        coeficiente: round4(coefficient),
        rmi: round2(rmi),
        contribuicoes: indexed.length,
        concomitante: 1,
    }, indexed.map((s) => ({
        label: s.competence,
        value: round2(s.indexed),
        meta: { original: s.value, index: s.idx, ceiling: s.ceiling },
    })));
}
/** ORTN/OTN: aplica fator ORTN da competência antes do índice padrão. */
export function runRmiOrtnOtn(caseRecord, tables) {
    const { sb, coefficient, rmi, indexed } = computeRmiCore(caseRecord, tables, {
        indexFn: (t, competence) => {
            const base = lookupIndex(t, competence);
            try {
                return base * lookupOrtn(t, competence);
            }
            catch {
                return base;
            }
        },
    });
    return baseResult('rmi-ortn-otn-8213', 'rmi-ortn-otn-8213', tables, {
        salarioBeneficio: round2(sb),
        coeficiente: round4(coefficient),
        rmi: round2(rmi),
        contribuicoes: indexed.length,
    }, indexed.map((s) => ({
        label: s.competence,
        value: round2(s.indexed),
        meta: { original: s.value, index: s.idx, ceiling: s.ceiling },
    })));
}
//# sourceMappingURL=rmi.js.map