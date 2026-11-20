# Tempo Certo — Protótipo Interativo v8

Protótipo de interface do **Tempo Certo**, programa de cálculos previdenciários. Esta versão demonstra a navegação, o fluxo de trabalho e as telas principais em HTML/CSS/JavaScript puro, **sem motor previdenciário integrado**.

## Demonstração online

Acesse o protótipo pelo GitHub Pages:

**https://pandoravd.github.io/tempo-certo-prototipo/**

## Como abrir localmente

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` (ou `Tempo_Certo_Prototipo_Interativo_v8.html`) no navegador.

Não é necessário instalar dependências nem subir um servidor.

```bash
git clone https://github.com/pandoravd/tempo-certo-prototipo.git
cd tempo-certo-prototipo
start index.html
```

## O que este protótipo inclui

- Dashboard inicial com atalhos e cálculos recentes
- Fluxo de novo cálculo (wizard)
- Área de trabalho com menu clássico, ribbon e documento
- Listagem e armazenamento local no navegador (`localStorage`)
- Importação/exportação de JSON do protótipo
- Prévia de importação de CNIS (demonstrativa)
- Telas de ferramentas, tabelas, exemplos, ajuda e configurações

## Limitações (importante)

- **Não calcula benefícios reais** — não há motor previdenciário nem leitor do formato `.tc8` original.
- Tabelas e índices são **demonstrativos**.
- Os dados ficam salvos apenas no navegador local; para levar a outro computador, exporte o JSON.

## Estrutura do repositório

| Arquivo | Descrição |
| --- | --- |
| `index.html` | Entrada principal (GitHub Pages) |
| `Tempo_Certo_Prototipo_Interativo_v8.html` | Cópia nomeada da versão v8 |
| `README.md` | Este arquivo |

## Branches

- `master` — versão publicada e usada no GitHub Pages
- `dev` — branch de desenvolvimento

## Contato / dona do repositório

Repositório da conta **[@pandoravd](https://github.com/pandoravd)**.
