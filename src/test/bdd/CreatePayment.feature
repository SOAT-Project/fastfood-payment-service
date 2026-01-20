Feature: Criar pagamento
  Como um usuário do sistema de pagamentos
  Quero criar um pagamento para um pedido
  Para que o pedido possa ser processado

  Scenario: Criar pagamento com sucesso
    Given um pedido válido com id "order-123" e valor 100
    When o caso de uso de criação de pagamento é executado
    Then o pagamento deve ser criado com sucesso

  Scenario: Falha ao criar pagamento com valor inválido
    Given um pedido com valor negativo
    When o caso de uso de criação de pagamento é executado
    Then deve lançar um erro de criação de pagamento

  Scenario: Falha ao criar pagamento sem QR code
    Given um pedido válido mas o serviço de QR code não retorna
    When o caso de uso de criação de pagamento é executado
    Then deve lançar um erro de QR code não retornado

  Scenario: Não criar pagamento duplicado para o mesmo pedido
    Given um pedido já existente com id "order-789"
    When o caso de uso de criação de pagamento é executado
    Then não deve criar um novo pagamento
