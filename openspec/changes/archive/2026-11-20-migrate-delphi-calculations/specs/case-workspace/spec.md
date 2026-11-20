# Spec Delta

## Purpose

Define a gestão do caso previdenciário (segurado, vínculos, salários, modalidades e persistência) compartilhada entre desktop, web e futuros clientes mobile.

## ADDED Requirements

### Requirement: Modelo mínimo do caso
O sistema SHALL representar um caso com dados do segurado, vínculos laborais, salários de contribuição, modalidades selecionadas, status e timestamps de atualização.

#### Scenario: Criação de caso novo
- **WHEN** o usuário cria um novo caso informando ao menos o nome do segurado
- **THEN** o sistema persiste o caso com identificador único e status inicial

### Requirement: Edição do histórico de vínculos e salários
O sistema SHALL permitir incluir, editar e remover vínculos e salários do caso antes do cálculo.

#### Scenario: Inclusão de vínculo
- **GIVEN** um caso aberto
- **WHEN** o usuário adiciona um vínculo com início e fim válidos
- **THEN** o caso passa a listar esse vínculo no histórico

### Requirement: Importação e exportação portátil
O sistema SHALL permitir exportar o caso em formato portátil (JSON do produto) e reimportá-lo em outro ambiente suportado.

#### Scenario: Round-trip de exportação
- **GIVEN** um caso com vínculos e modalidades
- **WHEN** o usuário exporta e depois importa o arquivo em outra instalação
- **THEN** os dados essenciais do caso (cliente, vínculos, salários, modalidades) são restaurados

### Requirement: Importação de CNIS com conferência
O sistema SHALL aceitar importação de CNIS (quando disponível) e SHALL exigir conferência do usuário antes de aplicar os dados ao caso.

#### Scenario: Prévia antes de aplicar
- **WHEN** o usuário importa um CNIS válido
- **THEN** o sistema exibe prévia dos dados detectados e só aplica ao caso após confirmação
