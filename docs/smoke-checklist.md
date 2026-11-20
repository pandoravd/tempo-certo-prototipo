# Smoke checklist — desktop + web (P0)

## Web (`apps/web`)

1. `npm run build -w @tempo-certo/web`
2. Abrir `apps/web/dist/index.html` (ou `npm start -w @tempo-certo/web`)
3. Criar caso e calcular `tempo-contribuicao` — demonstrativo JSON com anos/meses/dias
4. Calcular `rmi-lei-9876` — SB, coeficiente, RMI
5. Calcular variante `tempo-ec103-art15` e `ec103-art15-voluntaria`
6. Exportar JSON do caso

## Desktop (`apps/desktop`)

1. `npm run build -w @tempo-certo/desktop`
2. `npm start -w @tempo-certo/desktop -- tempo-contribuicao`
3. Confirmar `platform: desktop-cli` e totais presentes
4. Repetir com `rmi-lei-9876`

## Paridade

Os totais principais para o mesmo caso devem coincidir (ver `parity.test.ts`).
