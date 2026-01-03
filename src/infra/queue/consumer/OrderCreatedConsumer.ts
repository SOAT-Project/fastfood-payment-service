import { Injectable } from "@nestjs/common";
import type { OrderCreatedEvent } from "../model/OrderCreatedEvent";
import { SqsMessageHandler } from "@ssut/nestjs-sqs";

@Injectable()
export class OrderCreatedConsumer {
    @SqsMessageHandler("order-created-queue", false)
    async handleMessage(message: OrderCreatedEvent): Promise<void> {
        // Chame o caso de uso para criar pagamento, por exemplo
        // this.createPaymentUseCase.execute(message);
        console.log("Pedido recebido:", message);
    }
}
