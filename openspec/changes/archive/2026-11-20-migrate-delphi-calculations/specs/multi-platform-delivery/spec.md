# Spec Delta

## Purpose

Define como desktop e web (e o contrato para mobile futuro) consomem o mesmo catálogo, caso e motor de cálculo, evitando divergência de regras entre plataformas.

## ADDED Requirements

### Requirement: Mesmo núcleo em desktop e web
O sistema SHALL executar as modalidades pelo mesmo `calculation-core` e pelas mesmas `reference-tables` no cliente desktop e na aplicação web.

#### Scenario: Paridade de resultado entre plataformas
- **GIVEN** o mesmo caso e a mesma versão de tabelas
- **WHEN** a mesma modalidade é executada no desktop e na web
- **THEN** os totais principais são idênticos

### Requirement: Superfície desktop operacional
O sistema SHALL oferecer um aplicativo desktop capaz de criar/abrir casos, selecionar modalidades, executar cálculos e exibir demonstrativos.

#### Scenario: Fluxo completo no desktop
- **WHEN** o usuário cria um caso, seleciona uma modalidade e executa o cálculo
- **THEN** o desktop exibe o resultado estruturado do motor

### Requirement: Superfície web operacional
O sistema SHALL oferecer uma aplicação web capaz de criar/abrir casos, selecionar modalidades, executar cálculos e exibir demonstrativos.

#### Scenario: Fluxo completo na web
- **WHEN** o usuário cria um caso, seleciona uma modalidade e executa o cálculo
- **THEN** a web exibe o resultado estruturado do motor

### Requirement: Contrato preparado para mobile
O sistema SHALL expor APIs ou contratos de dados suficientes para um cliente mobile futuro consumir catálogo, casos e execução de cálculo sem reimplementar regras.

#### Scenario: Cliente mobile consome contrato
- **WHEN** um cliente usa apenas o contrato público documentado
- **THEN** consegue listar modalidades, abrir um caso e solicitar um cálculo sem acesso à UI desktop/web
