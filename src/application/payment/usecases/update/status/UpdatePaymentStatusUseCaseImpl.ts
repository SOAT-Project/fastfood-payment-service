import { UpdatePaymentStatusCommand } from "src/application/payment/command/update/UpdatePaymentStatusCommand";
import { UpdatePaymentStatusUseCase } from "./UpdatePaymentStatusUseCase";
import { UpdatePaymentStatusOutput } from "src/application/payment/output/UpdatePaymentStatusOutput";
import { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { NotFoundException } from "src/domain/exception/NotFoundException";
import { DomainError } from "src/domain/validation/DomainError";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";

export class UpdatePaymentStatusUseCaseImpl extends UpdatePaymentStatusUseCase {
    private paymentRepositoryGateway: PaymentRepositoryGateway;

    constructor(paymentRepositoryGateway: PaymentRepositoryGateway) {
        super();
        this.paymentRepositoryGateway = paymentRepositoryGateway;
    }

    async execute(
        command: UpdatePaymentStatusCommand,
    ): Promise<UpdatePaymentStatusOutput> {
        const externalReference = command.externalReference;
        const newStatus = this.validateStatus(command.newStatus);

        const payment =
            await this.paymentRepositoryGateway.findByExternalReference(
                externalReference,
            );

        if (!payment) {
            throw NotFoundException.with([
                new DomainError(
                    "Payment not found for the given external reference.",
                ),
            ]);
        }

        payment.updateStatus(newStatus);

        const updatedPayment =
            await this.paymentRepositoryGateway.update(payment);

        return UpdatePaymentStatusOutput.from(
            updatedPayment.getExternalReference(),
            updatedPayment.getStatus(),
            updatedPayment.getUpdatedAt(),
        );
    }

    private validateStatus(newStatus: string): PaymentStatus {
        const paymentStatus = Object.values(PaymentStatus).find(
            (status) => status === newStatus,
        );

        if (!paymentStatus) {
            throw new DomainError("Invalid payment status.");
        }

        return paymentStatus;
    }
}
