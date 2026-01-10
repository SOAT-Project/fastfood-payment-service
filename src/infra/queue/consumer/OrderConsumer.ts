import { Inject, Injectable, Logger } from "@nestjs/common";
import { SqsMessageHandler } from "@ssut/nestjs-sqs";
import { CreatePaymentUseCase } from "src/application/payment/usecases/create/CreatePaymentUseCase";
import { CreatePaymentCommand } from "src/application/payment/command/create/CreatePaymentCommand";
import type { Message } from "@aws-sdk/client-sqs";
import { OrderEvent } from "../model/OrderEvent";

@Injectable()
export class OrderConsumer {
    private readonly logger = new Logger(OrderConsumer.name);

    constructor(
        @Inject("CreatePaymentUseCase")
        private readonly createPaymentUseCase: CreatePaymentUseCase,
    ) {}

    @SqsMessageHandler("fastfood-soat-terraform-order-to-payment.fifo", false)
    async handleMessage(message: Message): Promise<void> {
        try {
            this.logger.log(
                `Received message in OrderConsumer: ${message.MessageId}`,
            );

            const messageBody = message.Body;

            if (!messageBody) {
                this.logger.warn("Received empty message body.");
                return;
            }

            const parsedBody: OrderEvent = JSON.parse(messageBody);

            this.logger.log(
                `Processing order event for orderId: ${parsedBody.orderId}`,
            );

            const command = new CreatePaymentCommand(
                parsedBody.orderId,
                parsedBody.customerId.toString(),
                parsedBody.totalAmount,
                parsedBody.items,
            );

            await this.createPaymentUseCase.execute(command);
        } catch (error) {
            this.logger.error(
                `Error processing message: ${error.message}`,
                error.stack,
            );
        }
    }
}
