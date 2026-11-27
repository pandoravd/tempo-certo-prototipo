/** Utilitários de data alinhados ao uso previdenciário (EntreDatas / proporção). */
export function parseIsoDate(value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
    if (!m)
        throw new Error(`Data inválida: ${value}`);
    const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
    if (Number.isNaN(d.getTime()))
        throw new Error(`Data inválida: ${value}`);
    return d;
}
export function toIsoDate(d) {
    return d.toISOString().slice(0, 10);
}
/** Contagem inclusiva estilo previdenciário aproximada (anos/meses/dias). */
export function betweenDates(startIso, endIso) {
    const start = parseIsoDate(startIso);
    const end = parseIsoDate(endIso);
    if (end < start)
        throw new Error('Data final anterior à inicial');
    let years = end.getUTCFullYear() - start.getUTCFullYear();
    let months = end.getUTCMonth() - start.getUTCMonth();
    let days = end.getUTCDate() - start.getUTCDate() + 1; // inclusivo no dia final
    if (days < 0) {
        months -= 1;
        const prevMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0));
        days += prevMonth.getUTCDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }
    if (days >= 30) {
        months += Math.floor(days / 30);
        days = days % 30;
    }
    if (months >= 12) {
        years += Math.floor(months / 12);
        months = months % 12;
    }
    return { years, months, days };
}
export function ymdToDays(ymd) {
    return ymd.years * 365 + ymd.months * 30 + ymd.days;
}
export function daysToYmd(totalDays) {
    let days = Math.max(0, Math.round(totalDays));
    const years = Math.floor(days / 365);
    days -= years * 365;
    const months = Math.floor(days / 30);
    days -= months * 30;
    return { years, months, days };
}
export function applyFactor(ymd, factor) {
    return daysToYmd(ymdToDays(ymd) * factor);
}
export function addYmd(a, b) {
    return daysToYmd(ymdToDays(a) + ymdToDays(b));
}
/** Proporção de dias no mês (para salários parciais). */
export function monthProportion(daysWorked, daysInMonth = 30) {
    if (daysInMonth <= 0)
        return 0;
    return Math.min(1, Math.max(0, daysWorked / daysInMonth));
}
export function applyCeiling(value, ceiling) {
    if (ceiling <= 0)
        return value;
    return Math.min(value, ceiling);
}
//# sourceMappingURL=dates.js.map