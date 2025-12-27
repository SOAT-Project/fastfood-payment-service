import { Inject, Injectable } from "@nestjs/common";
import { GetPaymentQrCodeByOrderIdUseCase } from "./GetPaymentQrCodeByOrderIdUseCase";
import { GetPaymentQrCodeByOrderIdCommand } from "../../command/retrieve/GetPaymentQrCodeByOrderIdCommand";
import { GetPaymentQrCodeByOrderIdOutput } from "../../output/GetPaymentQrCodeByOrderIdOutput";
import type { PaymentRepositoryGateway } from "../../gateway/PaymentRepositoryGateway";
import { NotFoundException } from "src/domain/exception/NotFoundException";
import { DomainError } from "src/domain/validation/DomainError";

@Injectable()
export class GetPaymentQrCodeByOrderIdUseCaseImpl extends GetPaymentQrCodeByOrderIdUseCase {
    private paymentRepositoryGateway: PaymentRepositoryGateway;

    constructor(
        @Inject("PaymentRepositoryGateway")
        paymentRepositoryGateway: PaymentRepositoryGateway,
    ) {
        super();
        this.paymentRepositoryGateway = paymentRepositoryGateway;
    }

    public execute(
        command: GetPaymentQrCodeByOrderIdCommand,
    ): Promise<GetPaymentQrCodeByOrderIdOutput> {
        const orderId = command.orderId;

        const payment = this.paymentRepositoryGateway.findByOrderId(orderId);

        if (!payment) {
            throw NotFoundException.with([
                new DomainError("Payment not found for the given order ID."),
            ]);
        }

        return GetPaymentQrCodeByOrderIdOutput.from();
    }
}
