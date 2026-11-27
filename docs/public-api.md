# Contrato público (mobile-ready)

Pacote: `@tempo-certo/calculation-core`  
Versões: `ENGINE_VERSION` `0.2.0` · `catalogVersion` `1.1.0`

## Catálogo

```ts
listModalities(): ModalityDefinition[]
getModality(id: string): ModalityDefinition
resolveModalityId(id: string): { parentId: string; variantId?: string }
```

Inclui modalidades `tipoapo` 0–16, `divisor-minimo`, variantes EC 103 e revisões P2:
`sumula-2-trf4`, `teto-ec20-ec41`, `buraco-negro`, `art58-adct`, `irsm-0294`, `art21`, `art26`.

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
compareTotals(actual, expected, tolerance?: number | Record<string, number>): { ok: boolean; diffs: string[] }
```

Totais principais por família:

| Família | Totais típicos |
| --- | --- |
| Tempo | `anos`, `meses`, `dias`, `totalDias` / `pedagioDias` |
| RMI | `salarioBeneficio`, `coeficiente`, `rmi` |
| Diferenças | `rmiOriginal`, `rmiNova`, `diferenca` |
| Melhor benefício | `melhorRmi`, `melhorDib`, `candidatos` |
| EC 103 valor | `salarioBeneficio`, `coeficiente`, `beneficio` |
| Revisões P2 | `rmi` (+ fatores/coeficientes específicos, ex. `fatorIrsm`) |

## Tabelas

```ts
import {
  defaultTables,
  getTableSet,
  lookupMinimumWage,
  lookupIrsm,
  lookupTetoEc20,
  lookupTetoEc41,
} from '@tempo-certo/reference-tables'
```

Versões amostra: `tables-sample-v1`, `v2`, `v3` (P2: IRSM, tetos EC, buraco negro, ORTN, coeficientes).

Cliente mínimo (Node):

```js
import { listModalities, createCase, addJob, addSalary, runModality } from '@tempo-certo/calculation-core';
console.log(listModalities().length);
let c = createCase({ nome: 'Mobile' });
c = addJob(c, { employer: 'A', start: '2000-01-01', end: '2010-01-01' });
c = addSalary(c, { competence: '2019-01', value: 3000 });
console.log(runModality('tempo-contribuicao', c).totals);
console.log(runModality('irsm-0294', c).engineVersion);
```
