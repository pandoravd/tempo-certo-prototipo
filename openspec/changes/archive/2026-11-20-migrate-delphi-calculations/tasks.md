# Tasks

## 1. Inventário e catálogo

- [x] 1.1 Extrair lista completa de modalidades de `Uhistorico.tipoapo` e menus EC 103 de `Unit1.dfm` para um inventário Markdown/JSON e verificar que cobre os IDs 0–16 mais variantes de artigo
- [x] 1.2 Implementar `modality-catalog` (IDs estáveis, nomes, grupos, variantes EC 103) e verificar teste unitário de listagem + rejeição de id inválido
- [x] 1.3 Documentar mapeamento unit Delphi ? modalidade no inventário e verificar que cada modalidade P0/P1/P2 aponta para ao menos uma unit de origem

## 2. Fundação do monorepo e tabelas

- [x] 2.1 Criar estrutura `packages/calculation-core`, `packages/reference-tables`, `apps/web`, `apps/desktop` e verificar que o workspace instala/builda vazio
- [x] 2.2 Modelar pacote de tabelas versionadas (SM, tetos, índices) com `versionId` e lookup por competência; verificar testes de lookup e de preservação de versão antiga
- [x] 2.3 Importar/espelhar amostra mínima de tabelas a partir dos dados do Delphi (`Utabela*` / arquivos associados) e verificar cobertura das competências usadas nos fixtures P0

## 3. Case workspace

- [x] 3.1 Definir schema do caso (cliente, vínculos, salários, modalidades, status, timestamps) e verificar validação dos campos obrigatórios
- [x] 3.2 Implementar CRUD de vínculos/salários e round-trip JSON; verificar teste de export?import restaurando dados essenciais
- [x] 3.3 Implementar fluxo de prévia de CNIS (JSON/PDF conforme disponível) com confirmação antes de aplicar; verificar que sem confirmação o caso não muda

## 4. Motor P0

- [x] 4.1 Implementar utilitários de data/proporção/teto espelhando funções críticas de `todos.pas` usadas em P0; verificar unit tests contra exemplos Delphi
- [x] 4.2 Implementar modalidade tempo de contribuição comum/especial; verificar golden case e saída com anos/meses/dias + detalhe por vínculo
- [x] 4.3 Implementar RMI Lei 9.876 (caso base); verificar golden case com SB, coeficiente e RMI
- [x] 4.4 Implementar subset EC 103 tempo (arts. 15/16) e valor (arts. principais do menu); verificar golden cases mínimos e metadados de versão do motor/tabelas
- [x] 4.5 Garantir validação pré-cálculo (ex.: vínculos ausentes) e verificar que a execução é recusada com erro claro

## 5. Clientes web e desktop (mesmo núcleo)

- [x] 5.1 Integrar o protótipo/`apps/web` ao `calculation-core` + catálogo + case workspace; verificar fluxo criar caso ? selecionar modalidade ? ver resultado real
- [x] 5.2 Scaffold do desktop (Tauri por padrão; Electron se bloqueado) consumindo o mesmo core; verificar o mesmo fluxo ponta a ponta
- [x] 5.3 Expor contrato público (tipos/API) para catálogo, caso e `runModality` documentado para mobile futuro; verificar que um cliente mínimo só com o contrato consegue listar e calcular
- [x] 5.4 Teste de paridade desktop vs web com o mesmo caso/tabelas; verificar totais principais idênticos

## 6. Ondas P1 e P2

- [x] 6.1 Implementar concomitantes, ORTN/OTN, diferenças (RMI, SB, SM, art. 45) e divisor mínimo com golden cases; verificar suíte P1 verde
- [x] 6.2 Implementar melhor benefício (tempo/idade/especial); verificar golden cases P1
- [x] 6.3 Implementar contribuições em atraso, pensão por morte — acumulação e revisões remanescentes mapeadas (art. 21/26, IRSM, etc.); verificar suíte P2 verde ou lista explícita do que ficou pendente com motivo

## 7. Integração e regressão

- [x] 7.1 Montar pipeline CI rodando unit + golden do core; verificar falha quando um total principal diverge além da tolerância
- [x] 7.2 Checklist manual de smoke desktop + web nas modalidades P0; verificar demonstrativo e export JSON funcionando

## Workflow follow-up

- Arquivar a change OpenSpec após a implementação e revisão (`openspec archive`).
- Change futura: leitor `.tc8` legado e app mobile completo.
- Revisões P2 ainda pendentes: ver `docs/p2-pending.md`.
