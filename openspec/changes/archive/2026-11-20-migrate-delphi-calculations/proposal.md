# Proposal

## Why

O Tempo Certo atual (Delphi XE em `novo8190x - Copia`, v8.1.9) concentra dezenas de modalidades previdenciárias em código legado Windows-only. Precisamos extrair e reimplementar **todos** esses cálculos em um núcleo compartilhado para o novo desktop + web (e, depois, mobile), sem perder paridade funcional com o programa original.

## What Changes

- Inventariar e formalizar o catálogo completo de modalidades do Delphi (ListView/`tipoapo`, menus EC 103/2019 e extras).
- Extrair regras de cálculo, tabelas/índices e utilitários de data/moeda do Pascal para um **núcleo de cálculo compartilhado** (independente de UI).
- Definir modelo de caso (cliente, vínculos, salários, histórico, modalidades) alinhado ao Histórico Delphi e ao protótipo HTML v8.
- Entregar clientes **desktop** e **web** consumindo o mesmo núcleo; preparar contratos para **mobile** futuro.
- Manter o Delphi como referência de paridade (golden cases), sem reescrever UI VCL nesta mudança.
- O protótipo HTML atual permanece referência visual; passa a consumir o núcleo real em etapas.

## Capabilities

### New Capabilities

- `modality-catalog`: catálogo canônico das modalidades de cálculo (IDs, nomes, parâmetros e quando cada uma se aplica), espelhando o Delphi.
- `calculation-core`: motor compartilhado que executa as modalidades com resultados determinísticos e auditáveis.
- `reference-tables`: tabelas e índices oficiais/demonstrativos (SM, tetos, correção) usados pelos cálculos, com atualização versionada.
- `case-workspace`: gestão do caso previdenciário (dados do segurado, vínculos, salários, CNIS, modalidades selecionadas, persistência/exportação).
- `multi-platform-delivery`: superfícies desktop e web (e contrato para mobile) que consomem o mesmo núcleo e catálogo.

### Modified Capabilities

- (nenhuma — projeto sem specs prévias)

## Impact

- Código de referência: `novo8190x - Copia` (~82 units `.pas`, sobretudo `todos.pas`, `simnova.pas`, `simulacao.pas`, `Uhistorico.pas`, `Unit1.pas`, unidades de RMI/diferenças/EC103/tabelas).
- Protótipo atual: `Tempo_Certo_Prototipo_Interativo_v8.html` / `index.html` (UI sem motor).
- Novo stack a definir no design (núcleo + desktop + web), com testes de paridade contra casos do Delphi.
- Escopo **não** inclui reimplementação pixel-perfect da VCL nem app mobile completo nesta change (mobile fica só no contrato/API).
