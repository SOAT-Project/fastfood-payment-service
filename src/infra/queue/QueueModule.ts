import { forwardRef, Module } from "@nestjs/common";
import { SqsModule } from "@ssut/nestjs-sqs";
import { SqsQueueService } from "./SqsQueueService";
import { OrderCreatedConsumer } from "./consumer/OrderCreatedConsumer";
import { PaymentModule } from "../payment/PaymentModule";
import { PaymentEventProducer } from "./producer/PaymentEventProducer";

@Module({
    imports: [
        forwardRef(() => PaymentModule),
        SqsModule.register({
            consumers: [
                {
                    name: "order-created-queue",
                    queueUrl:
                        "https://sqs.sa-east-1.amazonaws.com/967154861998/order-created-queue",
                    region: "sa-east-1",
                },
            ],
            producers: [
                {
                    name: "order-paid-queue",
                    queueUrl:
                        "https://sqs.sa-east-1.amazonaws.com/967154861998/order-paid-queue",
                    region: "sa-east-1",
                },
            ],
        }),
    ],
    providers: [
        {
            provide: "QueueService",
            useClass: SqsQueueService,
        },
        {
            provide: "PaymentEventProducerGateway",
            useClass: PaymentEventProducer,
        },
        OrderCreatedConsumer,
    ],
    exports: ["QueueService", "PaymentEventProducerGateway"],
})
export class QueueModule {}
