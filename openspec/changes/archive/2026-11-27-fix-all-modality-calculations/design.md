# Design

## Context

See proposal.md — Why. O núcleo atual concentra quase toda a lógica em `packages/calculation-core/src/engine.ts`: P0 parcialmente realista; P1/P2 frequentemente stubs (`differenceResult` com multiplicadores fixos, `melhorBeneficio` com candidatos fictícios, `revisionStub`, concomitantes só com flag). Revisões em `docs/p2-pending.md` não estão no `catalog.ts`. Tabelas em `packages/reference-tables` são amostras (`tables-sample-v1/v2`). Fonte Delphi `novo8190x - Copia` está referenciada no inventário mas ausente deste workspace — a implementação depende de acesso a essas units ou de fixtures exportadas.

## Goals / Non-Goals

**Goals:**
- Inventariar cada modalidade executável: stub vs fórmula real vs erro de runtime.
- Substituir stubs P0/P1/P2 já no `runModality` por regras derivadas das units Delphi mapeadas.
- Catalogar e implementar as 7 revisões P2 pendentes na mesma API.
- Estender tabelas versionadas o suficiente para fixtures e lookups das revisões.
- Suíte de varredura + golden cases com tolerâncias por modalidade.

**Non-Goals:**
- Importador `.tc8` ou UI VCL.
- Tabelas oficiais completas de toda a história previdenciária além do necessário às fixtures.
- Redesign visual web/desktop além de mapear novos ids no bridge/catálogo.
- Mobile nativo.

## Decisions

### 1. Auditoria antes de reescrever em massa
Produzir matriz modalidade → status (`ok` / `stub` / `erro` / `pendente`) a partir de execução da suíte e inspeção do `switch` em `engine.ts`, alinhada ao inventário.  
**Por quê:** evita “corrigir” modalidades já ok e prioriza stubs que afetam a UI hoje.  
**Alternativa:** reescrever tudo de uma vez — rejeitada por risco e falta de golden cases.

### 2. Modularizar o motor por família, manter `runModality` como fachada
Extrair handlers por família (`tempo`, `rmi`, `diferencas`, `ec103`, `melhor-beneficio`, `revisoes-p2`) em módulos sob `packages/calculation-core/src/modalities/`, com `runModality` apenas despachando.  
**Por quê:** `engine.ts` monolítico dificulta paridade unit-a-unit.  
**Alternativa:** manter um único arquivo — rejeitada para esta onda de correção.

### 3. Golden cases: fixtures JSON no pacote core
Cada modalidade (ou grupo) ganha fixture `{ case, tablesVersionId, expectedTotals, tolerance }` em `packages/calculation-core/fixtures/`. Onde o Delphi não estiver disponível no CI, usar fixtures capturadas manualmente e marcar origem (`source: delphi-export | documented-rule`).  
**Por quê:** CI já roda testes do core; não depende de binário Delphi.  
**Alternativa:** comparar online com Delphi — inviável no pipeline atual.

### 4. Revisões P2 como modalidades de top-level no catálogo
IDs estáveis iguais aos de `relatedRevisions`; grupo `revisao`; wave `P2`. Remover a distinção “só inventário” após implementação; atualizar `docs/p2-pending.md`.  
**Por quê:** a UI e `listModalities()` já consomem o catálogo.  
**Alternativa:** subvariantes de uma modalidade “revisões” — pior para seleção no caso.

### 5. Tabelas: estender `TableSet` com mapas opcionais tipados
Adicionar campos opcionais (ex.: `irsm`, `tetoEc20`, `tetoEc41`, `coeficientes`) sem quebrar versões antigas; lookups específicos lançam erro claro se o mapa estiver ausente. Nova versão `tables-sample-v3` (ou nome equivalente) cobre fixtures P2; `tables-sample-v1` permanece para resultados históricos.  
**Por quê:** preserva requisito de não alterar retroativamente.  
**Alternativa:** pacote separado só para revisões — overhead desnecessário neste monorepo.

### 6. Bridge web/desktop
Atualizar `NAME_TO_ID` / listagens para novos nomes; clientes só precisam do catálogo atualizado se já usam `listModalities()`. Smoke checklist inclui uma revisão P2.

## Risks / Trade-offs

- [Delphi ausente no workspace] → Bloquear tarefas de paridade até path/fixtures; documentar origem de cada golden; não inventar números “oficiais” sem fonte.
- [Tabelas oficiais incompletas] → Cobertura mínima só para fixtures; lookup fora da cobertura continua erro explícito.
- [Escopo amplo (todas as modalidades + 7 revisões)] → Entregar por ondas internas na tasks (auditoria → P0/P1 stubs → P2 → regressão), mas uma única change OpenSpec.
- [Quebra de totais vs protótipo atual] → Aceitável: stubs atuais não são referência; versionar `ENGINE_VERSION`.

## Migration Plan

1. Publicar catálogo + tabelas novas sem remover ids existentes.
2. Trocar handlers stub por fórmulas reais; bump `ENGINE_VERSION`.
3. Ativar testes golden; falhar CI em divergência.
4. Atualizar docs (`p2-pending`, `public-api`, smoke).
5. Rollback: reverter pacotes core/tables; resultados antigos com `tablesVersionId`/`engineVersion` anteriores permanecem interpretáveis.

## Open Questions

- Caminho local definitivo da pasta Delphi `novo8190x - Copia` neste ambiente (necessário na implementação para extrair golden cases).
- Tolerâncias padrão por família (sugerido 0,01 para R$/índices; 0 dias para tempo YMD) — confirmar na primeira leva de fixtures.
