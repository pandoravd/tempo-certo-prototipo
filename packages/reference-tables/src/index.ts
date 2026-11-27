import sampleV1 from './data/sample-v1.json' with { type: 'json' };
import sampleV2 from './data/sample-v2.json' with { type: 'json' };
import sampleV3 from './data/sample-v3.json' with { type: 'json' };

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

const REGISTRY: TableSet[] = [sampleV1 as TableSet, sampleV2 as TableSet, sampleV3 as TableSet];

function normalizeCompetence(competence: string): string {
  const m = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec(competence.trim());
  if (!m) throw new Error(`Competência inválida: ${competence}`);
  return `${m[1]}-${m[2]}`;
}

function sortedKeys(map: Record<string, number>): string[] {
  return Object.keys(map).sort();
}

function lookupNearest(map: Record<string, number>, competence: string): number {
  const key = normalizeCompetence(competence);
  if (map[key] != null) return map[key];
  const keys = sortedKeys(map);
  let chosen: string | null = null;
  for (const k of keys) {
    if (k <= key) chosen = k;
    else break;
  }
  if (chosen == null) {
    throw new Error(`Competência fora da cobertura: ${key}`);
  }
  return map[chosen];
}

function requireMap(tables: TableSet, field: keyof TableSet, label: string): Record<string, number> {
  const map = tables[field];
  if (!map || typeof map !== 'object' || Array.isArray(map)) {
    throw new Error(`Tabela ${label} ausente na versão ${tables.versionId}`);
  }
  return map as Record<string, number>;
}

export function listTableVersions(): string[] {
  return REGISTRY.map((t) => t.versionId);
}

export function getTableSet(versionId: string): TableSet {
  const found = REGISTRY.find((t) => t.versionId === versionId);
  if (!found) throw new Error(`Versão de tabelas inexistente: ${versionId}`);
  return found;
}

export function getTablesForDate(isoDate: string): TableSet {
  const eligible = REGISTRY.filter(
    (t) => t.effectiveFrom <= isoDate && (t.effectiveTo == null || t.effectiveTo >= isoDate),
  );
  if (!eligible.length) {
    return getTableSet('tables-sample-v1');
  }
  return eligible.sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom))[0];
}

export function lookupMinimumWage(tables: TableSet, competence: string): number {
  return lookupNearest(tables.minimumWage, competence);
}

export function lookupCeiling(tables: TableSet, competence: string): number {
  return lookupNearest(tables.ceiling, competence);
}

export function lookupIndex(tables: TableSet, competence: string): number {
  return lookupNearest(tables.index, competence);
}

export function lookupReajuste(tables: TableSet, competence: string): number {
  const map = tables.reajuste ?? tables.index;
  return lookupNearest(map, competence);
}

export function lookupIrsm(tables: TableSet, competence: string): number {
  return lookupNearest(requireMap(tables, 'irsm', 'IRSM'), competence);
}

export function lookupTetoEc20(tables: TableSet, competence: string): number {
  return lookupNearest(requireMap(tables, 'tetoEc20', 'teto EC20'), competence);
}

export function lookupTetoEc41(tables: TableSet, competence: string): number {
  return lookupNearest(requireMap(tables, 'tetoEc41', 'teto EC41'), competence);
}

export function lookupBuracoNegro(tables: TableSet, competence: string): number {
  return lookupNearest(requireMap(tables, 'buracoNegro', 'buraco negro'), competence);
}

export function lookupOrtn(tables: TableSet, competence: string): number {
  return lookupNearest(requireMap(tables, 'ortn', 'ORTN/OTN'), competence);
}

export function lookupCoeficiente(tables: TableSet, key: string): number {
  const map = requireMap(tables, 'coeficientes', 'coeficientes');
  if (map[key] == null) throw new Error(`Coeficiente ausente: ${key}`);
  return map[key];
}

export function defaultTables(): TableSet {
  return getTableSet('tables-sample-v1');
}
