import type { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { Inject, Injectable } from "@nestjs/common";
import { CreatePaymentUseCase } from "./CreatePaymentUseCase";
import { CreatePaymentCommand } from "../../command/create/CreatePaymentCommand";

@Injectable()
export class CreatePaymentUseCaseImpl extends CreatePaymentUseCase {
    private paymentRepositoryGateway: PaymentRepositoryGateway;

    constructor(
        @Inject("PaymentRepositoryGateway")
        paymentRepositoryGateway: PaymentRepositoryGateway,
    ) {
        super();
        this.paymentRepositoryGateway = paymentRepositoryGateway;
    }

    async execute(command: CreatePaymentCommand): Promise<void> {
        return;
    }
}
