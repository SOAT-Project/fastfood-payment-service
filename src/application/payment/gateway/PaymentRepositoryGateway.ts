import { Payment } from "src/domain/payment/Payment";

export interface PaymentRepositoryGateway {
    create(payment: Payment): Promise<Payment>;
    update(payment: Payment): Promise<Payment>;
    findByOrderId(orderId: string): Promise<Payment | null>;
}
