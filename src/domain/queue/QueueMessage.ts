export class QueueMessage<T = any> {
    id: string;
    payload: T;
    occurredAt: Date;

    protected constructor(id: string, payload: T, occurredAt: Date) {
        this.id = id;
        this.payload = payload;
        this.occurredAt = occurredAt;
    }

    static with<T>(id: string, payload: T, occurredAt: Date): QueueMessage<T> {
        return new QueueMessage<T>(id, payload, occurredAt);
    }
}
