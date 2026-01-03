import { SQS } from "@aws-sdk/client-sqs";
import { Injectable } from "@nestjs/common";
import { QueueServiceGateway } from "src/application/queue/gateway/QueueServiceGateway";
import { QueueMessage } from "src/domain/queue/QueueMessage";

@Injectable()
export class SqsQueueService implements QueueServiceGateway {
    private sqs = new SQS();

    async sendMessage<T>(
        queueName: string,
        message: QueueMessage<T>,
    ): Promise<void> {
        await this.sqs.sendMessage({
            QueueUrl: queueName,
            MessageBody: JSON.stringify(message),
        });
    }

    async receiveMessages<T>(queueName: string): Promise<QueueMessage<T>[]> {
        const result = await this.sqs.receiveMessage({
            QueueUrl: queueName,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 10,
        });

        if (!result.Messages) return [];

        return result.Messages.map((msg) => {
            const body = JSON.parse(msg.Body!);
            return QueueMessage.with<T>(
                body.id,
                body.payload,
                new Date(body.occurredAt),
            );
        });
    }
}
