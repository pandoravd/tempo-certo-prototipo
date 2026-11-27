import sampleV1 from './data/sample-v1.json' with { type: 'json' };
import sampleV2 from './data/sample-v2.json' with { type: 'json' };
import sampleV3 from './data/sample-v3.json' with { type: 'json' };
const REGISTRY = [sampleV1, sampleV2, sampleV3];
function normalizeCompetence(competence) {
    const m = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec(competence.trim());
    if (!m)
        throw new Error(`Competência inválida: ${competence}`);
    return `${m[1]}-${m[2]}`;
}
function sortedKeys(map) {
    return Object.keys(map).sort();
}
function lookupNearest(map, competence) {
    const key = normalizeCompetence(competence);
    if (map[key] != null)
        return map[key];
    const keys = sortedKeys(map);
    let chosen = null;
    for (const k of keys) {
        if (k <= key)
            chosen = k;
        else
            break;
    }
    if (chosen == null) {
        throw new Error(`Competência fora da cobertura: ${key}`);
    }
    return map[chosen];
}
function requireMap(tables, field, label) {
    const map = tables[field];
    if (!map || typeof map !== 'object' || Array.isArray(map)) {
        throw new Error(`Tabela ${label} ausente na versão ${tables.versionId}`);
    }
    return map;
}
export function listTableVersions() {
    return REGISTRY.map((t) => t.versionId);
}
export function getTableSet(versionId) {
    const found = REGISTRY.find((t) => t.versionId === versionId);
    if (!found)
        throw new Error(`Versão de tabelas inexistente: ${versionId}`);
    return found;
}
export function getTablesForDate(isoDate) {
    const eligible = REGISTRY.filter((t) => t.effectiveFrom <= isoDate && (t.effectiveTo == null || t.effectiveTo >= isoDate));
    if (!eligible.length) {
        return getTableSet('tables-sample-v1');
    }
    return eligible.sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom))[0];
}
export function lookupMinimumWage(tables, competence) {
    return lookupNearest(tables.minimumWage, competence);
}
export function lookupCeiling(tables, competence) {
    return lookupNearest(tables.ceiling, competence);
}
export function lookupIndex(tables, competence) {
    return lookupNearest(tables.index, competence);
}
export function lookupReajuste(tables, competence) {
    const map = tables.reajuste ?? tables.index;
    return lookupNearest(map, competence);
}
export function lookupIrsm(tables, competence) {
    return lookupNearest(requireMap(tables, 'irsm', 'IRSM'), competence);
}
export function lookupTetoEc20(tables, competence) {
    return lookupNearest(requireMap(tables, 'tetoEc20', 'teto EC20'), competence);
}
export function lookupTetoEc41(tables, competence) {
    return lookupNearest(requireMap(tables, 'tetoEc41', 'teto EC41'), competence);
}
export function lookupBuracoNegro(tables, competence) {
    return lookupNearest(requireMap(tables, 'buracoNegro', 'buraco negro'), competence);
}
export function lookupOrtn(tables, competence) {
    return lookupNearest(requireMap(tables, 'ortn', 'ORTN/OTN'), competence);
}
export function lookupCoeficiente(tables, key) {
    const map = requireMap(tables, 'coeficientes', 'coeficientes');
    if (map[key] == null)
        throw new Error(`Coeficiente ausente: ${key}`);
    return map[key];
}
export function defaultTables() {
    return getTableSet('tables-sample-v1');
}
//# sourceMappingURL=index.js.map