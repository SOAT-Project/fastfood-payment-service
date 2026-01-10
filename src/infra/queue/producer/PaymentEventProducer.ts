import { Inject, Injectable } from "@nestjs/common";
import type { QueueServiceGateway } from "src/application/queue/gateway/QueueServiceGateway";
import { QueueMessage } from "src/domain/queue/QueueMessage";
import type { PaymentStatusUpdatedEvent } from "../model/PaymentStatusUpdatedEvent";
import { SqsMessageHandler } from "@ssut/nestjs-sqs";
import { PaymentEventProducerGateway } from "src/application/payment/gateway/PaymentEventProducerGateway";
import { randomUUID } from "node:crypto";

@Injectable()
export class PaymentEventProducer implements PaymentEventProducerGateway {
    constructor(
        @Inject("QueueService")
        private readonly queueService: QueueServiceGateway,
    ) {}

    @SqsMessageHandler("fastfood-soat-terraform-payment-to-order.fifo", false)
    async publishPaymentStatusUpdated(
        event: PaymentStatusUpdatedEvent,
    ): Promise<void> {
        const message = QueueMessage.with(
            "ORDER_PAID",
            event.orderId,
            event.paidAt,
            event.amount,
        );

        await this.queueService.sendFifoMessage(
            "fastfood-soat-terraform-payment-to-order.fifo",
            message,
        );
    }
}
