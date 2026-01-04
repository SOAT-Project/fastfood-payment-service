import { Injectable, Logger } from "@nestjs/common";
import { SqsService } from "@ssut/nestjs-sqs";
import { randomUUID } from "crypto";
import { QueueServiceGateway } from "src/application/queue/gateway/QueueServiceGateway";
import { QueueMessage } from "src/domain/queue/QueueMessage";

@Injectable()
export class SqsQueueService implements QueueServiceGateway {
    private readonly logger = new Logger(SqsQueueService.name);

    public constructor(private readonly sqsService: SqsService) {}

    async sendFifoMessage<T>(
        queueName: string,
        message: QueueMessage<T>,
    ): Promise<void> {
        try {
            await this.sqsService.send(queueName, {
                id: randomUUID(),
                body: JSON.stringify(message),
                groupId: message.groupId!,
                deduplicationId: randomUUID(),
            });
        } catch (error) {
            this.logger.error(
                `Failed to send message to queue ${queueName}`,
                error.stack,
            );
            throw new Error(
                `Failed to send message to queue ${queueName}`,
                error,
            );
        }
    }

    async sendMessage<T>(
        queueName: string,
        message: QueueMessage<T>,
    ): Promise<void> {
        try {
            await this.sqsService.send(queueName, {
                id: randomUUID(),
                body: JSON.stringify(message),
            });
        } catch (error) {
            this.logger.error(
                `Failed to send message to queue ${queueName}`,
                error.stack,
            );
            throw new Error(
                `Failed to send message to queue ${queueName}`,
                error,
            );
        }
    }
}
