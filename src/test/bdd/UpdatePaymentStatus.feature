Feature: Atualizar status do pagamento
  Como um usuário do sistema de pagamentos
  Quero atualizar o status de um pagamento por id do pedido
  Para refletir o andamento do pagamento

  Scenario: Atualizar status do pagamento com sucesso
    Given um pedido existente com id "order-123" e status atual "PENDING"
    When o caso de uso de atualização de status é executado
    Then o status deve ser atualizado com sucesso

  Scenario: Falha ao atualizar status para pedido inexistente
    Given um pedido inexistente
    When o caso de uso de atualização de status é executado
    Then deve lançar um erro de não encontrado
