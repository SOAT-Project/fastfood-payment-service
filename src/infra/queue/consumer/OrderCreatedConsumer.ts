import { Inject, Injectable } from "@nestjs/common";
import type { OrderCreatedEvent } from "../model/OrderCreatedEvent";
import { SqsMessageHandler } from "@ssut/nestjs-sqs";
import { CreatePaymentUseCase } from "src/application/payment/usecases/create/CreatePaymentUseCase";
import { CreatePaymentCommand } from "src/application/payment/command/create/CreatePaymentCommand";

@Injectable()
export class OrderCreatedConsumer {
    constructor(
        @Inject("CreatePaymentUseCase")
        private readonly createPaymentUseCase: CreatePaymentUseCase,
    ) {}

    @SqsMessageHandler("order-created-queue", false)
    async handleMessage(message: OrderCreatedEvent): Promise<void> {
        const command = new CreatePaymentCommand(
            message.orderId,
            message.customerId,
            message.totalAmount,
            message.items,
        );

        await this.createPaymentUseCase.execute(command);
    }
}
