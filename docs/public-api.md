# Contrato público (mobile-ready)

Pacote: `@tempo-certo/calculation-core`

## Catálogo

```ts
listModalities(): ModalityDefinition[]
getModality(id: string): ModalityDefinition
resolveModalityId(id: string): { parentId: string; variantId?: string }
```

## Caso

```ts
createCase({ nome: string; title?: string }): CaseRecord
addJob / updateJob / removeJob
addSalary / removeSalary
setModalities
exportCaseJson / importCaseJson
previewCnisJson / applyCnisPreview(case, preview, confirmed)
```

## Cálculo

```ts
runModality(modalityId: string, caseRecord: CaseRecord, tables?: TableSet): CalculationResult
compareTotals(actual, expected, tolerance?): { ok: boolean; diffs: string[] }
```

## Tabelas

```ts
import { defaultTables, getTableSet, lookupMinimumWage } from '@tempo-certo/reference-tables'
```

Cliente mínimo (Node):

```js
import { listModalities, createCase, addJob, runModality } from '@tempo-certo/calculation-core';
console.log(listModalities().length);
let c = createCase({ nome: 'Mobile' });
c = addJob(c, { employer: 'A', start: '2000-01-01', end: '2010-01-01' });
console.log(runModality('tempo-contribuicao', c).totals);
```
