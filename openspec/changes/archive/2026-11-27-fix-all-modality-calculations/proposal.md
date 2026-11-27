# Proposal

## Why

Várias modalidades do núcleo (`packages/calculation-core`) já expostas no catálogo e na UI usam stubs (fatores fixos, candidatos fictícios, flags sem regra), então os resultados não refletem as regras previdenciárias do Delphi. As revisões P2 (`sumula-2-trf4`, `teto-ec20-ec41`, `buraco-negro`, `art58-adct`, `irsm-0294`, `art21`, `art26`) ainda não são modalidades executáveis. Precisamos auditar e corrigir todas as contas e fechar essa lacuna.

## What Changes

- Auditar todas as modalidades já executáveis via `runModality` e substituir stubs/fórmulas incorretas por regras alinhadas ao Delphi (units de origem do inventário).
- Exigir suite de regressão com golden cases (ou fixtures documentadas) por modalidade, com tolerância explícita — falha quando totais principais divergirem.
- Promover as revisões P2 de `relatedRevisions` a modalidades de catálogo executáveis e implementá-las no motor.
- Ampliar `reference-tables` com os índices/coeficientes necessários às revisões (IRSM, tetos EC 20/41, etc.), versionados sem quebrar resultados históricos.
- Atualizar inventário/`docs/p2-pending.md` para refletir o que passou a estar implementado.
- **Não** inclui leitor `.tc8` legado, app mobile completo nem redesign de UI além do necessário para expor as novas modalidades do catálogo.

## Capabilities

### New Capabilities

- (nenhuma — o trabalho reforça capacidades já existentes)

### Modified Capabilities

- `calculation-core`: eliminar stubs; exigir fórmulas corretas por modalidade; implementar revisões P2; reforçar validação e paridade golden.
- `modality-catalog`: incluir as revisões P2 como modalidades de primeira classe (IDs estáveis, nomes, grupo).
- `reference-tables`: disponibilizar tabelas/índices adicionais exigidos pelas revisões e pelo fechamento das fórmulas P0/P1.

## Impact

- Código principal: `packages/calculation-core` (`engine.ts`, `catalog.ts`, testes), `packages/reference-tables`, ponte web `apps/web/src/engine-bridge.js` e consumo desktop.
- Referência Delphi: pasta `novo8190x - Copia` (fora do repo neste ambiente) — units listadas em `docs/modality-inventory.json` / `docs/p2-pending.md`.
- Contrato público (`docs/public-api.md`) e checklist de smoke: novas modalidades e expectativas de totais.
- Risco: divergência numérica vs Delphi até golden cases estáveis; tabelas oficiais incompletas podem limitar algumas revisões — nesse caso o design deve documentar fixture mínima e bloqueio explícito.
