import { lookupCoeficiente, lookupMinimumWage } from '../../reference-tables/index.js';
import { baseResult, computeRmiCore, requireSalaries, round2, } from './shared.js';
export function runContribuicoesAtraso(caseRecord, tables) {
    requireSalaries(caseRecord, 'Competências em atraso obrigatórias');
    let rate = 0.2;
    try {
        rate = lookupCoeficiente(tables, 'contribuicaoRate');
    }
    catch {
        /* fallback */
    }
    let total = 0;
    const lines = [];
    for (const s of caseRecord.salaries) {
        const sm = lookupMinimumWage(tables, s.competence);
        const base = Math.max(s.value, sm);
        const due = round2(base * rate);
        total += due;
        lines.push({ label: s.competence, value: due, meta: { base, rate, sm } });
    }
    return baseResult('contribuicoes-atraso', 'contribuicoes-atraso', tables, { total: round2(total), competencias: caseRecord.salaries.length, aliquota: rate }, lines);
}
/**
 * Acumulação EC 103: 100% do maior + faixa sobre o menor (SM).
 */
export function runPensaoAcumulacao(caseRecord, tables) {
    const { rmi } = computeRmiCore(caseRecord, tables);
    const pensao = round2(rmi);
    const sm = lookupMinimumWage(tables, (caseRecord.client.requerimento || '2025-09-01').slice(0, 7));
    const segundo = pensao; // segundo benefício simulado = mesma base
    let faixa = 1;
    if (segundo > sm && segundo <= 2 * sm)
        faixa = 0.6;
    else if (segundo > 2 * sm && segundo <= 3 * sm)
        faixa = 0.4;
    else if (segundo > 3 * sm && segundo <= 4 * sm)
        faixa = 0.2;
    else if (segundo > 4 * sm)
        faixa = 0.1;
    const acumulavel = round2(pensao + segundo * faixa);
    return baseResult('pensao-acumulacao', 'pensao-acumulacao', tables, { pensao, acumulavel, faixa, salarioMinimo: sm }, [
        { label: 'Pensão base (maior)', value: pensao },
        { label: 'Segundo benefício', value: segundo },
        { label: 'Valor acumulável', value: acumulavel },
    ]);
}
export function runCalculoVersaoAnterior(caseRecord, tables) {
    const { sb, coefficient, rmi, indexed } = computeRmiCore(caseRecord, tables);
    return baseResult('calculo-versao-anterior', 'calculo-versao-anterior', tables, {
        salarioBeneficio: round2(sb),
        coeficiente: round2(coefficient),
        rmi: round2(rmi),
        legado: 1,
    }, indexed.map((s) => ({ label: s.competence, value: round2(s.indexed) })));
}
//# sourceMappingURL=extras.js.map