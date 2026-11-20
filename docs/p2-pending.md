# P2 — status das revisões remanescentes

Implementado no núcleo (API `runModality`):

- `contribuicoes-atraso`
- `pensao-acumulacao`
- `calculo-versao-anterior` (legado)

Pendentes como modalidades dedicadas (ainda só no inventário / Delphi):

| ID inventário | Motivo |
| --- | --- |
| `sumula-2-trf4` | Revisão específica; aguarda golden case Delphi |
| `teto-ec20-ec41` | Coeficientes de teto; depende de tabelas oficiais completas |
| `buraco-negro` | Regras históricas complexas em `Unit_bnegro.pas` |
| `art58-adct` | `Unit_ADCT.pas` |
| `irsm-0294` | `Unit_irsm0294.pas` |
| `art21` / `art26` | Units `Unit_art21.pas` / `Unit_art26.pas` |

Esses itens permanecem catalogados em `docs/modality-inventory.json` → `relatedRevisions` para a próxima onda.
