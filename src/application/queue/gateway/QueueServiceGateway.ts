import { QueueMessage } from "src/domain/queue/QueueMessage";

export interface QueueServiceGateway {
    sendMessage<T>(queueName: string, message: QueueMessage<T>): Promise<void>;
    sendFifoMessage<T>(
        queueName: string,
        message: QueueMessage<T>,
    ): Promise<void>;
}
