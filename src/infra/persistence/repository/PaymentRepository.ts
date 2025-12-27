import { PaymentTypeOrmEntity } from "../typeorm/PaymentEntity";

export interface PaymentRepository {
    findByOrderId(orderId: string): Promise<PaymentTypeOrmEntity | null>;
    save(entity: PaymentTypeOrmEntity): Promise<PaymentTypeOrmEntity>;
}
