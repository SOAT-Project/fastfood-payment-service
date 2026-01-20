Feature: Consultar status do pagamento
  Como um usuário do sistema de pagamentos
  Quero consultar o status de um pagamento por id do pedido
  Para saber o andamento do pagamento

  Scenario: Obter status de pagamento com sucesso
    Given um pedido existente com id "order-123"
    When o caso de uso de consulta de status é executado
    Then o status retornado deve ser "PENDING"

  Scenario: Falha ao obter status de pagamento para pedido inexistente
    Given um pedido inexistente
    When o caso de uso de consulta de status é executado
    Then deve lançar um erro de não encontrado
