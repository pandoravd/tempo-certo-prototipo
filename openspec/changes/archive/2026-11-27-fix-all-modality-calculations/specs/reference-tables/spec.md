# Spec Delta

## MODIFIED Requirements

### Requirement: Tipos mínimos de tabela
O sistema SHALL disponibilizar salários mínimos, tetos previdenciários, índices de atualização e os coeficientes/índices adicionais exigidos pelas modalidades e revisões do catálogo (incluindo IRSM e tetos de EC 20/41 quando aplicáveis).

#### Scenario: Lookup de salário mínimo
- **WHEN** o motor solicita o salário mínimo para uma competência
- **THEN** o sistema retorna o valor correspondente ou erro se a competência estiver fora da cobertura

#### Scenario: Lookup de índice de revisão
- **GIVEN** um conjunto de tabelas que inclui índices/coeficientes de uma revisão P2
- **WHEN** o motor solicita o fator aplicável à competência da revisão
- **THEN** o sistema retorna o valor versionado correspondente ou erro claro se a competência estiver fora da cobertura

## ADDED Requirements

### Requirement: Cobertura mínima para fixtures P0–P2
O sistema SHALL manter ao menos uma versão de tabelas cuja cobertura de competências permita executar as fixtures golden das modalidades P0, P1 e das revisões P2 do catálogo sem falha por competência ausente nessas fixtures.

#### Scenario: Fixture P2 encontra competência
- **GIVEN** a versão de tabelas usada pelas fixtures de regressão
- **WHEN** uma fixture de revisão P2 solicita lookup nas competências do caso de teste
- **THEN** o lookup sucede para todas as competências da fixture
