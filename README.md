# Tempo Certo — Protótipo Interativo v8

Protótipo de interface do **Tempo Certo**, programa de cálculos previdenciários. Esta versão demonstra a navegação, o fluxo de trabalho e as telas principais em HTML/CSS/JavaScript, com o **motor compartilhado** (`@tempo-certo/calculation-core`) integrado via `engine-bridge.js`.

## Demonstração online

Acesse o protótipo pelo GitHub Pages:

**https://pandoravd.github.io/tempo-certo-prototipo/**

## Como abrir localmente

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` no navegador (precisa de servidor HTTP local se o browser bloquear módulos ES — ou use o build web abaixo).

```bash
git clone https://github.com/pandoravd/tempo-certo-prototipo.git
cd tempo-certo-prototipo
npm install
npm run build
npx --yes serve . -p 4173
```

## O que este protótipo inclui

- Dashboard inicial com atalhos e cálculos recentes
- Fluxo de novo cálculo (wizard)
- Área de trabalho com menu clássico, ribbon e documento
- Listagem e armazenamento local no navegador (`localStorage`)
- Importação/exportação de JSON do protótipo
- Prévia de importação de CNIS (demonstrativa)
- Cálculos reais via núcleo TypeScript (tempo, RMI, EC 103, diferenças, revisões P2, etc.)
- Telas de ferramentas, tabelas, exemplos, ajuda e configurações

## Limitações (importante)

- Tabelas e índices de amostra (`tables-sample-v*`) — não oficiais.
- Fixtures golden usam `documented-rule` até haver export Delphi (`docs/delphi-fixtures-source.md`).
- Os dados ficam salvos apenas no navegador local; para levar a outro computador, exporte o JSON.
- Não há leitor do formato `.tc8` legado nesta versão.

## Estrutura do repositório

| Caminho | Descrição |
| --- | --- |
| `index.html` | Entrada principal (GitHub Pages) com bridge do motor |
| `engine-bridge.js` / `vendor/` | Núcleo e tabelas publicados para o Pages |
| `Tempo_Certo_Prototipo_Interativo_v8.html` | Fonte do protótipo v8 |
| `packages/calculation-core` | Motor de cálculo |
| `packages/reference-tables` | Tabelas versionadas |
| `apps/web` | Build que gera `dist/` e publica na raiz |
| `README.md` | Este arquivo |

## Branches

- `master` — versão publicada e usada no GitHub Pages
- `dev` — branch de desenvolvimento

## Contato / dona do repositório

Repositório da conta **[@pandoravd](https://github.com/pandoravd)**.
