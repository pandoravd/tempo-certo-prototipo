# calculation-core Specification

## Purpose

Define o motor compartilhado de cálculos previdenciários do Tempo Certo, com resultados determinísticos e auditáveis a partir do caso e das tabelas de referência.

## Requirements

### Requirement: Execução determinística por modalidade
O sistema SHALL calcular cada modalidade solicitada a partir do caso, das tabelas de referência vigentes e dos parâmetros da modalidade, produzindo o mesmo resultado para as mesmas entradas.

#### Scenario: Recálculo idêntico
- **GIVEN** um caso e um conjunto de tabelas fixos
- **WHEN** a mesma modalidade é executada duas vezes
- **THEN** os resultados numéricos e totais principais são idênticos

### Requirement: Saída estruturada e auditável
O sistema SHALL retornar, para cada execução, totais, linhas de detalhe relevantes à modalidade e metadados (modalidade, versão do motor, versão das tabelas usadas).

#### Scenario: Resultado de tempo de contribuição
- **WHEN** a modalidade de tempo de contribuição comum e especial é executada com vínculos válidos
- **THEN** o resultado inclui anos, meses e dias totais e o detalhamento por vínculo

#### Scenario: Resultado de RMI
- **WHEN** uma modalidade de RMI é executada com salários e parâmetros válidos
- **THEN** o resultado inclui salário-de-benefício, coeficiente e renda mensal inicial

### Requirement: Validação de entradas antes do cálculo
O sistema SHALL validar dados mínimos do caso exigidos pela modalidade e SHALL recusar a execução com erros claros quando faltar informação obrigatória.

#### Scenario: Vínculos ausentes em tempo de contribuição
- **GIVEN** um caso sem vínculos
- **WHEN** o usuário solicita cálculo de tempo de contribuição
- **THEN** o sistema não executa o cálculo e retorna erro indicando vínculos obrigatórios

### Requirement: Paridade com casos de referência Delphi
O sistema SHALL comparar resultados do núcleo com casos golden derivados do Delphi (ou fixtures documentadas equivalentes) para cada modalidade executável, dentro de tolerância numérica documentada por modalidade, e SHALL falhar a suíte de regressão quando um total principal divergir além da tolerância.

#### Scenario: Caso golden aprovado
- **GIVEN** um caso golden com resultado esperado do Delphi para uma modalidade
- **WHEN** o núcleo executa a mesma modalidade com as mesmas entradas e tabelas
- **THEN** os totais principais ficam dentro da tolerância definida para aquela modalidade

#### Scenario: Divergência acima da tolerância falha a regressão
- **GIVEN** um caso golden cuja execução produz total principal fora da tolerância
- **WHEN** a suíte de regressão de paridade é executada
- **THEN** o teste falha e identifica a modalidade e o campo divergente

### Requirement: Fórmulas reais sem stubs
O sistema SHALL calcular cada modalidade executável com regras previdenciárias alinhadas à unit Delphi de origem do inventário, e SHALL NOT usar fatores fixos genéricos, candidatos fictícios ou flags sem efeito no valor como substituto da regra.

#### Scenario: Diferenças usam RMI original e nova
- **GIVEN** um caso com salários e parâmetros suficientes para diferenças de RMI
- **WHEN** a modalidade de diferenças entre RMI original e nova é executada
- **THEN** o resultado inclui RMI original, RMI nova e diferença derivadas das regras de atualização, não de um multiplicador arbitrário único

#### Scenario: Melhor benefício compara cenários reais
- **GIVEN** um caso elegível a melhor benefício por tempo, idade ou especial
- **WHEN** a modalidade correspondente é executada
- **THEN** o resultado escolhe o melhor valor entre cenários definidos pela regra da modalidade, com linhas auditáveis por cenário

### Requirement: Revisões P2 executáveis
O sistema SHALL executar as revisões `sumula-2-trf4`, `teto-ec20-ec41`, `buraco-negro`, `art58-adct`, `irsm-0294`, `art21` e `art26` via a mesma API de modalidades, retornando totais e linhas de detalhe com metadados de versão do motor e das tabelas.

#### Scenario: Revisão P2 com entradas válidas
- **GIVEN** um caso e tabelas cobrindo a competência exigida pela revisão
- **WHEN** o cliente solicita `runModality` com o id de uma revisão P2 listada
- **THEN** o sistema retorna totais principais e linhas de detalhe sem erro de “não implementada”

#### Scenario: Revisão P2 sem dados obrigatórios
- **GIVEN** um caso sem os dados mínimos exigidos pela revisão
- **WHEN** a revisão é solicitada
- **THEN** o sistema recusa a execução com erro claro indicando o dado faltante

### Requirement: Inventário de erros de cálculo
O sistema SHALL manter, na suíte de testes do núcleo, cobertura que exercita cada modalidade do catálogo executável ao menos uma vez com fixture válida, de modo que falhas de validação, exceções inesperadas ou totais inválidos sejam detectadas automaticamente.

#### Scenario: Varredura de modalidades executáveis
- **WHEN** a suíte de regressão do núcleo é executada
- **THEN** cada id de modalidade executável do catálogo é invocado com uma fixture válida e produz `CalculationResult` com totais coerentes ou um `CalculationError` documentado
