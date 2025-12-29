import { Payment } from "src/domain/payment/Payment";
import { PaymentId } from "src/domain/payment/PaymentId";
import { PaymentTypeOrmEntity } from "../typeorm/PaymentEntity";

export class PaymentTypeOrmMapper {
    public static toTypeOrmEntity(payment: Payment): PaymentTypeOrmEntity {
        const paymentEntity = new PaymentTypeOrmEntity();
        paymentEntity.id = payment.getId().getValue();
        paymentEntity.value = payment.getValue();
        paymentEntity.externalReference = payment.getExternalReference();
        paymentEntity.qrCode = payment.getQrCode();
        paymentEntity.status = payment.getStatus();
        paymentEntity.orderId = payment.getOrderId();
        paymentEntity.customerId = payment["customerId"];
        paymentEntity.createdAt = payment.getCreatedAt();
        paymentEntity.updatedAt = payment.getUpdatedAt();
        paymentEntity.deletedAt = payment.getDeletedAt();

        return paymentEntity;
    }

    public static fromTypeOrmEntity(
        PaymentEntity: PaymentTypeOrmEntity,
    ): Payment {
        return Payment.with(
            PaymentId.of(PaymentEntity.id),
            PaymentEntity.value,
            PaymentEntity.externalReference,
            PaymentEntity.qrCode,
            PaymentEntity.status,
            PaymentEntity.orderId,
            PaymentEntity.customerId,
            PaymentEntity.createdAt,
            PaymentEntity.updatedAt,
            PaymentEntity.deletedAt,
        );
    }
}
