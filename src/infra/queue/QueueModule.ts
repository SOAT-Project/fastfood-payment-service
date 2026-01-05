import { forwardRef, Module } from "@nestjs/common";
import { SqsModule } from "@ssut/nestjs-sqs";
import { SqsQueueService } from "./SqsQueueService";
import { OrderConsumer } from "./consumer/OrderConsumer";
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
                        name: (() => {
                            const name = configService.get<string>(
                                "AWS_ORDER_TO_PAYMENT_QUEUE_NAME",
                            );
                            if (!name)
                                throw new Error(
                                    "AWS_ORDER_TO_PAYMENT_QUEUE_NAME is not set",
                                );
                            return name;
                        })(),
                        suppressFifoWarning: true,
                        queueUrl: (() => {
                            const url = configService.get<string>(
                                "AWS_ORDER_TO_PAYMENT_QUEUE_URL",
                            );
                            if (!url)
                                throw new Error(
                                    "AWS_ORDER_TO_PAYMENT_QUEUE_URL is not set",
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
                        name: (() => {
                            const name = configService.get<string>(
                                "AWS_PAYMENT_TO_ORDER_QUEUE_NAME",
                            );
                            if (!name)
                                throw new Error(
                                    "AWS_PAYMENT_TO_ORDER_QUEUE_NAME is not set",
                                );
                            return name;
                        })(),
                        suppressFifoWarning: true,
                        queueUrl: (() => {
                            const url = configService.get<string>(
                                "AWS_PAYMENT_TO_ORDER_QUEUE_URL",
                            );
                            if (!url)
                                throw new Error(
                                    "AWS_PAYMENT_TO_ORDER_QUEUE_URL is not set",
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
        OrderConsumer,
    ],
    exports: ["QueueService", "PaymentEventProducerGateway"],
})
export class QueueModule {}
