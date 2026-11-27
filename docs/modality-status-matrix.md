# Matriz modalidade → status (auditoria inicial)

Gerada a partir de `engine.ts` + `docs/modality-inventory.json` (antes da correção completa).  
Legenda: `ok` fórmula útil · `stub` fator/flag artificial · `erro` quebra em runtime típico · `pendente` não no `runModality`.

| ID | Onda | Status inicial | Notas |
| --- | --- | --- | --- |
| `tempo-contribuicao` | P0 | ok | Contagem por vínculo + fator |
| `tempo-ec103` / arts 15–16 | P0 | stub | Bônus fixo 30d no art.16 |
| `rmi-lei-9876` | P0 | ok | Média indexada + coeficiente Lei 9.876 simplificado |
| `beneficio-ec103` (variantes) | P0 | stub | Coeficientes ad hoc por substring do id |
| `rmi-lei-9876-concomitantes` | P1 | stub | Só flag `concomitante: 1` |
| `rmi-ortn-otn-8213` | P1 | stub | `revisionStub` ×1.03 |
| `diferencas-rmi` | P1 | stub | ×1.08 |
| `diferencas-salario-beneficio` | P1 | stub | ×1.05 |
| `diferencas-salario-minimo` | P1 | stub | max(RMI, SM) |
| `diferencas-art45` | P1 | stub | ×1.25 |
| `simular-salarios-beneficio` | P1 | stub | proporção 30/30 |
| `melhor-beneficio-tempo` | P1 | stub | candidatos 0.98/1.02 |
| `melhor-beneficio-idade` | P1 | stub | idem |
| `melhor-beneficio-especial` | P1 | stub | idem |
| `divisor-minimo` | P1 | ok | max(108, n) |
| `contribuicoes-atraso` | P2 | stub | 20% de max(valor, SM) |
| `pensao-acumulacao` | P2 | stub | 50%/60% da RMI |
| `calculo-versao-anterior` | P2 | stub | fator 1 |
| `sumula-2-trf4` | P2 | ok | implementada no catálogo + motor |
| `teto-ec20-ec41` | P2 | ok | implementada no catálogo + motor |
| `buraco-negro` | P2 | ok | implementada no catálogo + motor |
| `art58-adct` | P2 | ok | implementada no catálogo + motor |
| `irsm-0294` | P2 | ok | implementada + fixture golden |
| `art21` | P2 | ok | implementada no catálogo + motor |
| `art26` | P2 | ok | implementada no catálogo + motor |

Cobertura: todos os ids do catálogo + 7 revisões P2. Status “inicial” acima foi atualizado após a change `fix-all-modality-calculations`.
