import { Inject, Injectable, Logger } from "@nestjs/common";
import type { OrderCreatedEvent } from "../model/OrderCreatedEvent";
import { SqsMessageHandler } from "@ssut/nestjs-sqs";
import { CreatePaymentUseCase } from "src/application/payment/usecases/create/CreatePaymentUseCase";
import { CreatePaymentCommand } from "src/application/payment/command/create/CreatePaymentCommand";
import type { Message } from "@aws-sdk/client-sqs";

@Injectable()
export class OrderCreatedConsumer {
    private readonly logger = new Logger(OrderCreatedConsumer.name);

    constructor(
        @Inject("CreatePaymentUseCase")
        private readonly createPaymentUseCase: CreatePaymentUseCase,
    ) {}

    @SqsMessageHandler("order-created-queue", false)
    async handleMessage(message: Message): Promise<void> {
        const messageBody = message.Body;

        if (!messageBody) {
            this.logger.warn("Received empty message body.");
            return;
        }

        const parsedBody: OrderCreatedEvent = JSON.parse(messageBody);

        const command = new CreatePaymentCommand(
            parsedBody.orderId,
            parsedBody.customerId,
            parsedBody.totalAmount,
            parsedBody.items,
        );

        await this.createPaymentUseCase.execute(command);
    }
}
