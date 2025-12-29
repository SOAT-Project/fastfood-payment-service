import { UpdatePaymentStatusCommand } from "src/application/payment/command/update/UpdatePaymentStatusCommand";
import { UpdatePaymentStatusUseCase } from "./UpdatePaymentStatusUseCase";
import { UpdatePaymentStatusOutput } from "src/application/payment/output/UpdatePaymentStatusOutput";
import type { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { NotFoundException } from "src/domain/exception/NotFoundException";
import { DomainError } from "src/domain/validation/DomainError";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { Inject, Injectable } from "@nestjs/common";
import { IllegalStateException } from "src/domain/exception/IllegalStateException";

@Injectable()
export class UpdatePaymentStatusUseCaseImpl extends UpdatePaymentStatusUseCase {
    private paymentRepositoryGateway: PaymentRepositoryGateway;

    constructor(
        @Inject("PaymentRepositoryGateway")
        paymentRepositoryGateway: PaymentRepositoryGateway,
    ) {
        super();
        this.paymentRepositoryGateway = paymentRepositoryGateway;
    }

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
