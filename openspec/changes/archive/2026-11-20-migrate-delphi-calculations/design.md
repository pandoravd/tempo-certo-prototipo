# Design

## Context

- Legado: Delphi XE Win32 (`novo8190x - Copia`, produto Tempo Certo / Think 8.1.9), lógica concentrada em forms VCL e units utilitárias (`todos.pas` ~6k linhas, `simnova.pas`, `simulacao.pas`, `Uhistorico.pas`, `Unit1.pas`, unidades de RMI/diferenças/tabelas).
- UI de referência moderna: protótipo HTML v8 (sem motor).
- Ver `proposal.md` — Why / What Changes. Specs em `specs/*/spec.md`.

Mapeamento inicial legado ? domínio (não exaustivo):

| Domínio | Units / origem Delphi |
| --- | --- |
| Catálogo / seleção | `Uhistorico.tipoapo`, menus em `Unit1.dfm` |
| Tempo / contagem | `Ucontagem*.pas`, `Ucont15.pas`, `fator.pas`, `pedagio.pas` |
| RMI / simulação | `simnova.pas`, `simulacao.pas`, `simconc.pas`, `UIRM.pas`, `UNCalc.pas` |
| Diferenças / revisões | `Udifman.pas`, `Unit_art21/26`, `Unit_irsm0294`, `Unit_bnegro`, `Unit_ADCT`, `Unit_sum2` |
| Melhor benefício | `UnitMRMI.pas`, `UnitMRMIid.pas`, `UnitMRMesp.pas` |
| Atrasados / acumulação | `Uatrasados.pas`, `Uacumulaca.pas` |
| Tabelas / índices | `Utabela*.pas`, `tabelas.pas`, `UnitMeuIndice`, `UnitMeuteto`, `Uminimo` |
| Utilitários | `todos.pas` (datas, proporções, teto, CSV, persistência) |

## Goals / Non-Goals

**Goals:**

- Núcleo de cálculo **único**, testável, sem dependência de UI.
- Catálogo e modelo de caso alinhados ao Delphi e ao protótipo.
- Desktop + web na mesma base; contrato estável para mobile depois.
- Suite de golden cases a partir do Delphi para regressão.

**Non-Goals:**

- Replicar VCL/pixel-perfect do Delphi.
- App mobile completo nesta change.
- Motor jurídico “melhor que o Delphi” — meta é **paridade**, depois evolução.
- Migrar licenciamento/senha/atualizador online nesta change.

## Decisions

### 1. Núcleo em TypeScript (pacote compartilhado)

- **Escolha:** `packages/calculation-core` (TypeScript) com API pura: `runModality(modalityId, caseInput, tables) ? Result`.
- **Por quê:** o protótipo web já é HTML/JS; desktop moderno (Tauri/Electron) e mobile futuro consomem TS/JS com pouco atrito; facilita testes unitários e golden files em CI.
- **Alternativas:** reescrever em Delphi/C# e expor via WASM/FFI (maior atrito web); Python (bom para números, pior para app desktop/web unificado).

### 2. Clientes: Web (evolução do protótipo) + Desktop (Tauri)

- **Escolha:** Web app a partir do protótipo v8; Desktop com **Tauri** (ou Electron se Tauri for bloqueado) chamando o mesmo pacote core (in-process ou via bridge).
- **Por quê:** um só código de regras; desktop mantém UX “programa de escritório” e arquivos locais; web cobre acesso remoto.
- **Alternativas:** só web + PWA (fraco para workflows de arquivo/impressão do escritório); Flutter (reinício total da UI já prototipada).

### 3. Tabelas versionadas como dados, não código

- **Escolha:** JSON/CSV versionados em `packages/reference-tables`, carregados pelo core; resultados gravam `tablesVersionId`.
- **Por quê:** atualização sem redeploy do motor; paridade com atualizador de índices do Delphi.
- **Alternativas:** embutir tabelas no código (frágil); só API remota (offline desktop quebraria).

### 4. Migração por ondas de modalidades

- **Escolha:** prioridade P0 ? P2:
  - **P0:** tempo de contribuição; RMI Lei 9.876; simulação EC 103 tempo/valor (subset arts. principais); tabelas mínimas; case workspace.
  - **P1:** concomitantes; ORTN/OTN; diferenças; melhor benefício; divisor mínimo.
  - **P2:** contribuições em atraso; pensão acumulação; demais revisões (art. 21/26, IRSM, buraco negro, ADCT, etc.).
- **Por quê:** entrega valor cedo com cobertura do uso diário; restantes com golden cases.
- **Alternativas:** big-bang de todas as 17+ modalidades (alto risco).

### 5. Paridade via golden cases

- **Escolha:** exportar entradas/saídas do Delphi (ou capturas controladas) como fixtures JSON; CI compara totais com tolerância por modalidade.
- **Por quê:** o Delphi é a especificação executável de fato.
- **Alternativas:** só revisão manual (não escala).

### 6. Persistência do caso

- **Escolha:** formato JSON portátil do produto (evolução do JSON do protótipo); desktop pode espelhar em pasta local; web em storage + export. Formato `.tc8` legado: leitor **posterior** (fora do P0).
- **Por quê:** desbloqueia round-trip já no protótipo; `.tc8` é opaco/complexo no Delphi.

## Risks / Trade-offs

- [Divergência numérica vs Delphi] ? Golden cases + tolerâncias explícitas; investigar unit a unit.
- [Código Delphi acoplado a UI/grids] ? Extrair regras com testes; não portar forms.
- [Escopo EC 103 enorme (muitos artigos)] ? Subset P0 documentado; variantes restantes no catálogo como “planejado” até implementadas.
- [Tauri vs Electron] ? Decisão final na primeira task de desktop; core não depende disso.
- [Sem `.tc8` no P0] ? Export/import JSON; migração `.tc8` como change futura.

## Migration Plan

1. Inventário formal do catálogo + fixtures vazias por modalidade.
2. Scaffold monorepo (`calculation-core`, `reference-tables`, `web`, `desktop`).
3. Implementar P0 com testes golden mínimos.
4. Ligar protótipo web ao core; empacotar desktop fino.
5. Expandir P1/P2; manter Delphi só como oráculo até cobertura aceitável.
6. Rollback: clientes podem continuar no Delphi; web volta ao protótipo sem motor se necessário.

## Open Questions

- Preferência final Electron vs Tauri no desktop (não muda specs nem o core).
- Fonte oficial e processo contínuo de atualização das tabelas (manual vs feed Memphis).
- Prioridade exata dentro do P0 se o prazo for apertado (tempo vs RMI vs EC 103).
