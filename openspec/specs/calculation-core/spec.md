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
O sistema SHALL permitir comparação de resultados do núcleo com casos golden derivados do Delphi, dentro de tolerância numérica documentada.

#### Scenario: Caso golden aprovado
- **GIVEN** um caso golden com resultado esperado do Delphi
- **WHEN** o núcleo executa a mesma modalidade com as mesmas entradas
- **THEN** os totais principais ficam dentro da tolerância definida para aquela modalidade
