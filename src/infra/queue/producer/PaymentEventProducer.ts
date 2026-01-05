import { Inject, Injectable } from "@nestjs/common";
import type { QueueServiceGateway } from "src/application/queue/gateway/QueueServiceGateway";
import { QueueMessage } from "src/domain/queue/QueueMessage";
import type { PaymentStatusUpdatedEvent } from "../model/PaymentStatusUpdatedEvent";
import { SqsMessageHandler } from "@ssut/nestjs-sqs";
import { PaymentEventProducerGateway } from "src/application/payment/gateway/PaymentEventProducerGateway";

@Injectable()
export class PaymentEventProducer implements PaymentEventProducerGateway {
    constructor(
        @Inject("QueueService")
        private readonly queueService: QueueServiceGateway,
    ) {}

    @SqsMessageHandler("order-paid-queue", false)
    async publishPaymentStatusUpdated(
        event: PaymentStatusUpdatedEvent,
    ): Promise<void> {
        const message = QueueMessage.with(
            event.orderId,
            "ORDER_PAID",
            event,
            new Date(event.paidAt),
        );

        await this.queueService.sendFifoMessage(
            "payment-to-order.fifo",
            message,
        );
    }
}
