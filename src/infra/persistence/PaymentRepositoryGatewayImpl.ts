import { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { Payment } from "src/domain/payment/Payment";
import { PaymentEntityMapper } from "./mapper/PaymentEntityMapper";
import { Inject, Injectable } from "@nestjs/common";
import { PaymentTypeOrmEntity } from "./typeorm/PaymentEntity";
import type { PaymentRepository } from "./repository/PaymentRepository";

@Injectable()
export class PaymentRepositoryGatewayImpl implements PaymentRepositoryGateway {
    constructor(
        @Inject("PaymentTypeOrmRepository")
        private readonly paymentRepository: PaymentRepository,
    ) {}

    async create(payment: Payment): Promise<Payment> {
        return this.save(payment);
    }

    async update(payment: Payment): Promise<Payment> {
        return this.save(payment);
    }

    async findByOrderId(orderId: string): Promise<Payment | null> {
        const paymentEntity =
            await this.paymentRepository.findByOrderId(orderId);

        if (!paymentEntity) return null;

        return PaymentEntityMapper.fromTypeOrmEntity(paymentEntity);
    }

    private async save(payment: Payment): Promise<Payment> {
        const paymentJpa: PaymentTypeOrmEntity =
            PaymentEntityMapper.toTypeOrmEntity(payment);

        return PaymentEntityMapper.fromTypeOrmEntity(
            await this.paymentRepository.save(paymentJpa),
        );
    }
}
