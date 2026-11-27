# Fonte Delphi e fixtures golden

## Path Delphi

Pasta referenciada no inventário: `novo8190x - Copia` (produto Tempo Certo / Think 8.1.9).

**Status neste ambiente (2026-11-27):** a pasta **não foi encontrada** sob `C:\Users\caiok\Documents` nem no workspace do protótipo. Units Pascal listadas em `docs/modality-inventory.json` permanecem a referência nominal.

Quando o path local for disponibilizado, atualize:

```text
DELPHI_ROOT=<caminho absoluto para novo8190x - Copia>
```

## Fixtures acessíveis no repositório

Fixtures golden ficam em `packages/calculation-core/fixtures/`, com campo `source`:

| Fixture | Modalidade | Onda | source |
| --- | --- | --- | --- |
| `tempo-contribuicao.json` | `tempo-contribuicao` | P0 | `documented-rule` |
| `irsm-0294.json` | `irsm-0294` | P2 | `documented-rule` |

`documented-rule` = totais esperados derivados das regras documentadas no motor (paridade Delphi a capturar quando `DELPHI_ROOT` existir). Preferir `delphi-export` após exportação controlada do legado.
