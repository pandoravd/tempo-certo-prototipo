import { daysToYmd, ymdToDays } from '../dates.js';
import { baseResult, sumContributionTime } from './shared.js';
export function runTempoContribuicao(caseRecord, tables) {
    const { total, lines } = sumContributionTime(caseRecord);
    return baseResult('tempo-contribuicao', 'tempo-contribuicao', tables, {
        anos: total.years,
        meses: total.months,
        dias: total.days,
        totalDias: ymdToDays(total),
    }, lines);
}
/**
 * Tempo EC 103: art.15 = tempo puro; art.16 = tempo + pedágio residual (50% do que falta para 35 anos).
 */
export function runTempoEc103(modalityId, variantId, caseRecord, tables) {
    const { total, lines } = sumContributionTime(caseRecord);
    const targetDays = 35 * 365;
    const currentDays = ymdToDays(total);
    let adjustedDays = currentDays;
    let pedagioDays = 0;
    if (variantId === 'tempo-ec103-art16') {
        const missing = Math.max(0, targetDays - currentDays);
        pedagioDays = Math.round(missing * 0.5);
        adjustedDays = currentDays + pedagioDays;
    }
    const adjusted = daysToYmd(adjustedDays);
    return baseResult(modalityId, 'tempo-ec103', tables, {
        anos: adjusted.years,
        meses: adjusted.months,
        dias: adjusted.days,
        pedagioDias: pedagioDays,
        artigo: variantId || 'tempo-ec103-art15',
    }, lines, variantId);
}
//# sourceMappingURL=tempo.js.map