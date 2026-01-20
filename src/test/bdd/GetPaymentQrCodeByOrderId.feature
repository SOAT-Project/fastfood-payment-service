Feature: Consultar QR code do pagamento
  Como um usuário do sistema de pagamentos
  Quero consultar o QR code de um pagamento por id do pedido
  Para realizar o pagamento do pedido

  Scenario: Obter QR code de pagamento com sucesso
    Given um pedido existente com id "order-123" e status "PENDING"
    When o caso de uso de consulta de QR code é executado
    Then o QR code deve ser retornado

  Scenario: Falha ao obter QR code para pedido inexistente
    Given um pedido inexistente
    When o caso de uso de consulta de QR code é executado
    Then deve lançar um erro de não encontrado

  Scenario: Falha ao obter QR code para status diferente de PENDING
    Given um pedido existente com id "order-123" e status "APPROVED"
    When o caso de uso de consulta de QR code é executado
    Then deve lançar um erro de estado inválido

  Scenario: Falha ao obter QR code vazio
    Given um pedido existente com id "order-123" e QR code vazio
    When o caso de uso de consulta de QR code é executado
    Then deve lançar um erro de estado inválido
