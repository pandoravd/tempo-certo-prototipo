# Spec Delta

## Purpose

Define o fornecimento versionado de tabelas e índices previdenciários (salário mínimo, tetos, correção e afins) usados pelo motor de cálculo em todas as plataformas.

## ADDED Requirements

### Requirement: Conjuntos de tabelas versionados
O sistema SHALL manter conjuntos de tabelas com identificador de versão e data de vigência, consultáveis pelo motor e pelos clientes.

#### Scenario: Consulta da versão vigente
- **WHEN** um cliente solicita as tabelas vigentes em uma data
- **THEN** o sistema retorna o conjunto cuja vigência cobre essa data, com seu `versionId`

### Requirement: Tipos mínimos de tabela
O sistema SHALL disponibilizar ao menos salários mínimos, tetos previdenciários e índices de atualização necessários às modalidades do catálogo.

#### Scenario: Lookup de salário mínimo
- **WHEN** o motor solicita o salário mínimo para uma competência
- **THEN** o sistema retorna o valor correspondente ou erro se a competência estiver fora da cobertura

### Requirement: Atualização sem quebrar histórico
O sistema SHALL permitir publicar novas versões de tabelas sem alterar retroativamente resultados já gravados que referenciem versões anteriores.

#### Scenario: Resultado antigo preserva versão
- **GIVEN** um resultado calculado com `versionId` V1
- **WHEN** uma nova versão V2 de tabelas é publicada
- **THEN** o resultado antigo continua associado a V1 e não muda seus totais
