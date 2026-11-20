# modality-catalog Specification

## Purpose

Define o catálogo canônico das modalidades de cálculo previdenciário do Tempo Certo, para que desktop, web e futuros clientes mobile exponham e disparem as mesmas opções do Delphi.

## Requirements

### Requirement: Catálogo completo das modalidades Delphi
O sistema SHALL expor um catálogo versionado contendo todas as modalidades presentes no Delphi (`tipoapo` 0–16 e variantes de menu EC 103/2019), cada uma com identificador estável, nome exibido e grupo.

#### Scenario: Listagem das modalidades principais
- **GIVEN** o catálogo carregado
- **WHEN** um cliente solicita a lista de modalidades principais
- **THEN** o sistema retorna ao menos: tempo de contribuição comum/especial; RMI Lei 9.876; RMI concomitantes; RMI ORTN/OTN Lei 8.213/91; diferenças RMI; diferenças salário-de-benefício; simulação de salários-de-benefício; melhor benefício (tempo, idade, especial); diferenças salário mínimo; diferenças art. 45; contribuições em atraso; valor do benefício EC 103/2019; simulação de tempo EC 103/2019; pensão por morte — acumulação; apuração do divisor mínimo

#### Scenario: Identificadores estáveis
- **WHEN** o catálogo é consultado em versões sucessivas sem remoção de modalidade
- **THEN** cada modalidade mantém o mesmo `id` estável

### Requirement: Variantes EC 103/2019 no catálogo
O sistema SHALL incluir no catálogo as variantes de menu EC 103/2019 de tempo (arts. 15 e 16) e de valor do benefício (arts. 15–21, 19, 23 e auxílio-doença), vinculadas à modalidade pai correspondente.

#### Scenario: Consulta das variantes de valor EC 103
- **WHEN** o cliente solicita as variantes da modalidade de valor do benefício EC 103/2019
- **THEN** o sistema retorna as regras de transição e disposições transitórias listadas no menu Delphi

### Requirement: Seleção de modalidades em um caso
O sistema SHALL permitir que um caso associe uma ou mais modalidades do catálogo antes da execução do cálculo.

#### Scenario: Caso com múltiplas modalidades
- **GIVEN** um caso aberto
- **WHEN** o usuário seleciona duas modalidades válidas do catálogo
- **THEN** o caso persiste ambas e as disponibiliza para execução

#### Scenario: Modalidade inexistente rejeitada
- **WHEN** um cliente tenta associar um `id` que não existe no catálogo
- **THEN** o sistema rejeita a operação com erro de validação
