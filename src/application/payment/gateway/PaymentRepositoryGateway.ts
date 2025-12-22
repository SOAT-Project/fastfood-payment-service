import { Payment } from "src/domain/payment/Payment";

export interface PaymentRepositoryGateway {
    create(payment: Payment): Promise<Payment>;
    update(payment: Payment): Promise<Payment>;
    findByExternalReference(externalReference: string): Promise<Payment | null>;
}
