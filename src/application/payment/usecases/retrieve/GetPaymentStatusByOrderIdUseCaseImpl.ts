import { GetPaymentStatusByOrderIdCommand } from "../../command/retrieve/GetPaymentStatusByOrderIdCommand";
import type { PaymentRepositoryGateway } from "../../gateway/PaymentRepositoryGateway";
import { GetPaymentStatusByOrderIdUseCase } from "./GetPaymentStatusByOrderIdUseCase";
import { DomainError } from "src/domain/validation/DomainError";
import { NotFoundException } from "src/domain/exception/NotFoundException";
import { Inject, Injectable } from "@nestjs/common";
import { GetPaymentStatusByOrderIdOutput } from "../../output/GetPaymentStatusByOrderIdOutput";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class GetPaymentStatusByOrderIdUseCaseImpl extends GetPaymentStatusByOrderIdUseCase {
    constructor(
        @Inject("PaymentRepositoryGateway")
        private readonly paymentRepositoryGateway: PaymentRepositoryGateway,
    ) {
        super();
    }

    @Transactional()
    async execute(
        command: GetPaymentStatusByOrderIdCommand,
    ): Promise<GetPaymentStatusByOrderIdOutput> {
        const orderId = command.orderId;

        const payment =
            await this.paymentRepositoryGateway.findByOrderId(orderId);

        if (!payment) {
            throw NotFoundException.with([
                new DomainError("Payment not found for the given order ID."),
            ]);
        }

        return GetPaymentStatusByOrderIdOutput.from(payment.getStatus());
    }
}
