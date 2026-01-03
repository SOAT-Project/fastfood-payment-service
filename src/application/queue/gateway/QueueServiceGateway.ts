import { QueueMessage } from "src/domain/queue/QueueMessage";

export interface QueueServiceGateway {
    sendMessage<T>(queueName: string, message: QueueMessage<T>): Promise<void>;
    receiveMessages<T>(queueName: string): Promise<QueueMessage<T>[]>;
}
