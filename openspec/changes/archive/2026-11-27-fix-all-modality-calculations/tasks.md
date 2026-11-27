# Tasks

## 1. Auditoria e infraestrutura de regressão

- [x] 1.1 Localizar ou obter fixtures/exportações das units Delphi listadas no inventário (`novo8190x - Copia`) e registrar o path/fonte em `docs/` (ou nota no inventário); verificar que ao menos uma fixture P0 e uma P2 estão acessíveis
- [x] 1.2 Criar matriz modalidade → status (`ok` / `stub` / `erro` / `pendente`) a partir do `engine.ts` + inventário e verificar que cobre todos os ids atuais do catálogo mais as 7 revisões P2
- [x] 1.3 Scaffold de fixtures JSON + helper de comparação (`compareTotals` / tolerâncias por campo) em `packages/calculation-core` e verificar teste que falha quando um total foge da tolerância
- [x] 1.4 Extrair handlers do `engine.ts` para `src/modalities/*` mantendo `runModality` como fachada e verificar que a suíte unitária existente do core continua verde

## 2. Catálogo e tabelas

- [x] 2.1 Incluir no `catalog.ts` as revisões P2 (`sumula-2-trf4`, `teto-ec20-ec41`, `buraco-negro`, `art58-adct`, `irsm-0294`, `art21`, `art26`) com ids/nomes/grupo e verificar testes de listagem + resolve + rejeição de id inválido
- [x] 2.2 Estender `TableSet` com mapas opcionais (IRSM, tetos EC 20/41, coeficientes) e lookups tipados; verificar que versões antigas sem esses mapas não quebram e lookups ausentes lançam erro claro
- [x] 2.3 Publicar versão de tabelas que cubra competências das fixtures P0–P2 e verificar lookups das fixtures sem “competência fora da cobertura”

## 3. Corrigir modalidades já executáveis (stubs → regras)

- [x] 3.1 Corrigir tempo de contribuição e tempo EC 103 (arts. 15/16) alinhados às units de contagem/fator e verificar golden case de tempo (YMD + linhas por vínculo)
- [x] 3.2 Corrigir RMI Lei 9.876, concomitantes e ORTN/OTN alinhados a `simnova`/`simconc`/`UIRM` e verificar golden cases de SB, coeficiente e RMI
- [x] 3.3 Corrigir diferenças (RMI, SB, SM, art. 45), divisor mínimo e simulação de SB sem multiplicadores arbitrários e verificar golden cases de diferenças/médias
- [x] 3.4 Corrigir melhor benefício (tempo/idade/especial) e variantes de valor EC 103 e verificar golden cases com cenário vencedor e linhas auditáveis
- [x] 3.5 Corrigir contribuições em atraso, pensão-acumulação e cálculo versão anterior e verificar golden cases mínimos + validação de entradas

## 4. Implementar revisões P2

- [x] 4.1 Implementar `irsm-0294` e `teto-ec20-ec41` com tabelas/coeficientes e verificar golden case + recusa sem dados obrigatórios
- [x] 4.2 Implementar `art21`, `art26` e `art58-adct` e verificar golden cases + metadados de versão motor/tabelas
- [x] 4.3 Implementar `sumula-2-trf4` e `buraco-negro` e verificar golden cases (ou fixture documentada se export Delphi parcial) + erro claro se cobertura de tabela insuficiente
- [x] 4.4 Atualizar `docs/p2-pending.md` e inventário para marcar revisões implementadas e verificar que o doc não lista como pendente o que `runModality` já executa

## 5. Integração clientes e varredura final

- [x] 5.1 Teste de varredura: cada id executável do catálogo com fixture válida produz resultado ou `CalculationError` documentado; verificar suíte verde no CI/local (`npm run test:core`)
- [x] 5.2 Atualizar bridge web (`engine-bridge.js` / mapeamentos) e checklist de smoke para incluir ao menos uma revisão P2; verificar listagem + cálculo ponta a ponta no web
- [x] 5.3 Atualizar `docs/public-api.md` com novos ids e totais esperados por família e verificar que o contrato documentado bate com `listModalities` + `runModality`
- [x] 5.4 Bump `ENGINE_VERSION` / `catalogVersion` e verificar que resultados expõem as novas versões nos metadados

## Workflow follow-up

- Arquivar a change OpenSpec após implementação e revisão (`openspec archive`).
- Confirmar path definitivo do Delphi neste ambiente se fixtures ainda forem manuais.
