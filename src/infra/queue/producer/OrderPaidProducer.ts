import { Inject, Injectable } from "@nestjs/common";
import type { QueueServiceGateway } from "src/application/queue/gateway/QueueServiceGateway";
import { QueueMessage } from "src/domain/queue/QueueMessage";
import { OrderPaidEvent } from "../model/OrderPaidEvent";

@Injectable()
export class OrderPaidProducer {
    constructor(
        @Inject("QueueService")
        private readonly queueService: QueueServiceGateway,
    ) {}

    async publishOrderPaid(event: OrderPaidEvent): Promise<void> {
        const message = QueueMessage.with(
            event.orderId,
            event,
            new Date(event.paidAt),
        );
        await this.queueService.sendMessage("order-paid-queue-url", message);
    }
}
