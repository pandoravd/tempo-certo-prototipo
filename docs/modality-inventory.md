# Inventário de modalidades (Delphi ? novo núcleo)

Fonte: `novo8190x - Copia` — `Uhistorico.pas::tipoapo` (índices 0–16) e menus EC 103 / Extras em `Unit1.dfm`.

Dados machine-readable: [`modality-inventory.json`](./modality-inventory.json).

## Cobertura tipoapo 0–16

| Índice | ID estável | Onda | Units principais |
| --- | --- | --- | --- |
| 0 | `tempo-contribuicao` | P0 | `Ucontagem*.pas`, `fator.pas`, `pedagio.pas`, `todos.pas` |
| 1 | `rmi-lei-9876` | P0 | `simnova.pas`, `simulacao.pas`, `UIRM.pas`, `UNCalc.pas` |
| 2 | `rmi-lei-9876-concomitantes` | P1 | `simconc.pas`, `simconcx.pas` |
| 3 | `rmi-ortn-otn-8213` | P1 | `simnova.pas`, `UIRM.pas` |
| 4 | `diferencas-rmi` | P1 | `Udifman.pas` |
| 5 | `diferencas-salario-beneficio` | P1 | `Udifman.pas`, `todos.pas` |
| 6 | `simular-salarios-beneficio` | P1 | `simulacao.pas` |
| 7 | `melhor-beneficio-tempo` | P1 | `UnitMRMI.pas` |
| 8 | `melhor-beneficio-idade` | P1 | `UnitMRMIid.pas` |
| 9 | `melhor-beneficio-especial` | P1 | `UnitMRMesp.pas` |
| 10 | `diferencas-salario-minimo` | P1 | `Udifman.pas`, `Uminimo.pas` |
| 11 | `calculo-versao-anterior` | P2 | `Unit1.pas` (legado) |
| 12 | `diferencas-art45` | P1 | `Udifman.pas` |
| 13 | `contribuicoes-atraso` | P2 | `Uatrasados.pas` |
| 14 | `beneficio-ec103` | P0 | `simnova.pas`, `Unit_pedagio.pas` |
| 15 | `tempo-ec103` | P0 | `Ucontagemnova.pas`, `simnova.pas` |
| 16 | `pensao-acumulacao` | P2 | `Uacumulaca.pas` |

Extra de menu (sem índice tipoapo): `divisor-minimo` ? P1 (`simnova.pas` / `UNCalc.pas`).

## Variantes EC 103/2019 (menu Exemplos)

**Tempo:** art. 15, art. 16.

**Valor — regras de transição:** arts. 15, 16, 17 (pedágio 50%), 20 (pedágio 100%), 18 (idade), 21 (especial).

**Valor — disposições transitórias:** arts. 19, 19 especial, 23 (pensão), 26 (incapacidade), auxílio-doença.

## Revisões relacionadas (menu Exemplos / anteriores à EC 103)

Súmula 2 TRF4, Teto EC 20/41, Buraco Negro, Art. 58 ADCT, IRSM 02/94, Art. 21, Art. 26 — onda **P2**.

## Verificação

- IDs 0–16: presentes.
- Variantes de artigo EC 103: presentes no JSON.
- Cada modalidade P0/P1/P2 tem ao menos uma `delphiUnits` de origem.
