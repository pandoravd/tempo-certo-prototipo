# reference-tables Specification

## Purpose

Define o fornecimento versionado de tabelas e índices previdenciários (salário mínimo, tetos, correção e afins) usados pelo motor de cálculo em todas as plataformas.

## Requirements

### Requirement: Conjuntos de tabelas versionados
O sistema SHALL manter conjuntos de tabelas com identificador de versão e data de vigência, consultáveis pelo motor e pelos clientes.

#### Scenario: Consulta da versão vigente
- **WHEN** um cliente solicita as tabelas vigentes em uma data
- **THEN** o sistema retorna o conjunto cuja vigência cobre essa data, com seu `versionId`

### Requirement: Tipos mínimos de tabela
O sistema SHALL disponibilizar salários mínimos, tetos previdenciários, índices de atualização e os coeficientes/índices adicionais exigidos pelas modalidades e revisões do catálogo (incluindo IRSM e tetos de EC 20/41 quando aplicáveis).

#### Scenario: Lookup de salário mínimo
- **WHEN** o motor solicita o salário mínimo para uma competência
- **THEN** o sistema retorna o valor correspondente ou erro se a competência estiver fora da cobertura

#### Scenario: Lookup de índice de revisão
- **GIVEN** um conjunto de tabelas que inclui índices/coeficientes de uma revisão P2
- **WHEN** o motor solicita o fator aplicável à competência da revisão
- **THEN** o sistema retorna o valor versionado correspondente ou erro claro se a competência estiver fora da cobertura

### Requirement: Atualização sem quebrar histórico
O sistema SHALL permitir publicar novas versões de tabelas sem alterar retroativamente resultados já gravados que referenciem versões anteriores.

#### Scenario: Resultado antigo preserva versão
- **GIVEN** um resultado calculado com `versionId` V1
- **WHEN** uma nova versão V2 de tabelas é publicada
- **THEN** o resultado antigo continua associado a V1 e não muda seus totais

### Requirement: Cobertura mínima para fixtures P0–P2
O sistema SHALL manter ao menos uma versão de tabelas cuja cobertura de competências permita executar as fixtures golden das modalidades P0, P1 e das revisões P2 do catálogo sem falha por competência ausente nessas fixtures.

#### Scenario: Fixture P2 encontra competência
- **GIVEN** a versão de tabelas usada pelas fixtures de regressão
- **WHEN** uma fixture de revisão P2 solicita lookup nas competências do caso de teste
- **THEN** o lookup sucede para todas as competências da fixture
