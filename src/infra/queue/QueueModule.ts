import { forwardRef, Module } from "@nestjs/common";
import { SqsModule } from "@ssut/nestjs-sqs";
import { SqsQueueService } from "./SqsQueueService";
import { OrderCreatedConsumer } from "./consumer/OrderCreatedConsumer";
import { OrderPaidProducer } from "./producer/OrderPaidProducer";
import { PaymentModule } from "../payment/PaymentModule";

@Module({
    imports: [
        forwardRef(() => PaymentModule),
        SqsModule.register({
            consumers: [
                // {
                //     name: "order-created-queue",
                //     queueUrl: "order-created-queue-url",
                // },
            ],
            producers: [],
        }),
    ],
    providers: [
        {
            provide: "QueueService",
            useClass: SqsQueueService,
        },
        OrderCreatedConsumer,
        OrderPaidProducer,
    ],
    exports: ["QueueService"],
})
export class QueueModule {}
