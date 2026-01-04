import { forwardRef, Module } from "@nestjs/common";
import { SqsModule } from "@ssut/nestjs-sqs";
import { SqsQueueService } from "./SqsQueueService";
import { OrderCreatedConsumer } from "./consumer/OrderCreatedConsumer";
import { PaymentModule } from "../payment/PaymentModule";
import { PaymentEventProducer } from "./producer/PaymentEventProducer";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        forwardRef(() => PaymentModule),
        SqsModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                consumers: [
                    {
                        name: "order-created-queue",
                        queueUrl: (() => {
                            const url = configService.get<string>(
                                "AWS_ORDER_CREATED_QUEUE_URL",
                            );
                            if (!url)
                                throw new Error(
                                    "AWS_ORDER_CREATED_QUEUE_URL is not set",
                                );
                            return url;
                        })(),
                        region: (() => {
                            const region =
                                configService.get<string>("AWS_REGION");
                            if (!region)
                                throw new Error("AWS_REGION is not set");
                            return region;
                        })(),
                    },
                ],
                producers: [
                    {
                        name: "order-paid-queue",
                        queueUrl: (() => {
                            const url = configService.get<string>(
                                "AWS_ORDER_PAID_QUEUE_URL",
                            );
                            if (!url)
                                throw new Error(
                                    "AWS_ORDER_PAID_QUEUE_URL is not set",
                                );
                            return url;
                        })(),
                        region: (() => {
                            const region =
                                configService.get<string>("AWS_REGION");
                            if (!region)
                                throw new Error("AWS_REGION is not set");
                            return region;
                        })(),
                    },
                ],
            }),
            inject: [ConfigService],
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
