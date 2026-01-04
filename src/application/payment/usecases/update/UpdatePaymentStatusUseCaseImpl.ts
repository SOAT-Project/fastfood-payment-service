import { UpdatePaymentStatusCommand } from "src/application/payment/command/update/UpdatePaymentStatusCommand";
import { UpdatePaymentStatusUseCase } from "./UpdatePaymentStatusUseCase";
import { UpdatePaymentStatusOutput } from "src/application/payment/output/UpdatePaymentStatusOutput";
import type { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { NotFoundException } from "src/domain/exception/NotFoundException";
import { DomainError } from "src/domain/validation/DomainError";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { Inject, Injectable } from "@nestjs/common";
import { IllegalStateException } from "src/domain/exception/IllegalStateException";
import { Transactional } from "typeorm-transactional";
import type { PaymentEventProducerGateway } from "../../gateway/PaymentEventProducerGateway";
import { PaymentStatusUpdatedEvent } from "src/infra/queue/model/PaymentStatusUpdatedEvent";

@Injectable()
export class UpdatePaymentStatusUseCaseImpl extends UpdatePaymentStatusUseCase {
    constructor(
        @Inject("PaymentRepositoryGateway")
        private readonly paymentRepositoryGateway: PaymentRepositoryGateway,
        @Inject("PaymentEventProducerGateway")
        private readonly paymentEventProducerGateway: PaymentEventProducerGateway,
    ) {
        super();
    }

    @Transactional()
    async execute(
        command: UpdatePaymentStatusCommand,
    ): Promise<UpdatePaymentStatusOutput> {
        const orderId = command.orderId;
        const newStatus = this.validateStatus(command.newStatus);

        const payment =
            await this.paymentRepositoryGateway.findByOrderId(orderId);

        if (!payment) {
            throw NotFoundException.with([
                new DomainError("Payment not found for the given order ID."),
            ]);
        }

        payment.updateStatus(newStatus);

        const updatedPayment =
            await this.paymentRepositoryGateway.update(payment);

        const paymentStatusUpdatedEvent: PaymentStatusUpdatedEvent = {
            orderId: updatedPayment.getOrderId(),
            paidAt: updatedPayment.getCreatedAt().toISOString(),
            amount: updatedPayment.getValue(),
        };

        await this.paymentEventProducerGateway.publishPaymentStatusUpdated(
            paymentStatusUpdatedEvent,
        );

        return UpdatePaymentStatusOutput.from(
            updatedPayment.getExternalReference(),
            updatedPayment.getOrderId(),
            updatedPayment.getStatus(),
            updatedPayment.getUpdatedAt(),
        );
    }

    private validateStatus(newStatus: string): PaymentStatus {
        const paymentStatus = Object.values(PaymentStatus).find(
            (status) => status === newStatus,
        );

        if (!paymentStatus) {
            throw IllegalStateException.with([
                new DomainError("Invalid payment status provided."),
            ]);
        }

        return paymentStatus;
    }
}
