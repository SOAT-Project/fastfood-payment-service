import { PaymentStatusUpdatedEvent } from "src/infra/queue/model/PaymentStatusUpdatedEvent";

export interface PaymentEventProducerGateway {
    publishPaymentStatusUpdated(
        event: PaymentStatusUpdatedEvent,
    ): Promise<void>;
}
