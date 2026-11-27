import { baseResult, computeRmiCore, requireSalaries, round2, } from './shared.js';
function rangeFor(modalityId) {
    if (modalityId === 'melhor-beneficio-tempo') {
        return { start: '1988-10-05', end: '1998-12-14', especialBoost: false };
    }
    if (modalityId === 'melhor-beneficio-especial') {
        return { start: '1988-10-05', end: '1999-11-28', especialBoost: true };
    }
    return { start: '1988-10-05', end: '1999-11-28', especialBoost: false };
}
function yearlyDates(startIso, endIso) {
    const startY = Number(startIso.slice(0, 4));
    const endY = Number(endIso.slice(0, 4));
    const dates = [];
    for (let y = startY; y <= endY; y++) {
        const candidate = `${y}-12-01`;
        if (candidate >= startIso.slice(0, 10) && candidate <= endIso.slice(0, 10)) {
            dates.push(candidate);
        }
    }
    if (!dates.includes(endIso.slice(0, 10)))
        dates.push(endIso.slice(0, 10));
    return dates;
}
export function runMelhorBeneficio(modalityId, caseRecord, tables) {
    requireSalaries(caseRecord, 'Salários obrigatórios para melhor benefício');
    const { start, end, especialBoost } = rangeFor(modalityId);
    const scenarioCase = especialBoost
        ? {
            ...caseRecord,
            jobs: caseRecord.jobs.map((j) => ({
                ...j,
                factor: j.especial ? Math.max(j.factor ?? 1, 1.4) : j.factor,
            })),
        }
        : caseRecord;
    const candidates = yearlyDates(start, end).map((dib) => {
        const withReq = {
            ...scenarioCase,
            client: { ...scenarioCase.client, requerimento: dib },
        };
        const { rmi } = computeRmiCore(withReq, tables);
        return { dib, rmi: round2(rmi) };
    });
    const best = candidates.reduce((a, b) => (b.rmi > a.rmi ? b : a), candidates[0]);
    return baseResult(modalityId, modalityId, tables, {
        melhorRmi: best.rmi,
        melhorDib: best.dib,
        candidatos: candidates.length,
    }, candidates.map((c, i) => ({
        label: `Cenário ${i + 1} (${c.dib})`,
        value: c.rmi,
    })));
}
//# sourceMappingURL=melhor-beneficio.js.map