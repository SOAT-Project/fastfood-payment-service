export class QueueMessage<T = any> {
    public id: string;
    public payload: T;
    public occurredAt: Date;

    protected constructor(id: string, payload: T, occurredAt: Date) {
        this.id = id;
        this.payload = payload;
        this.occurredAt = occurredAt;
    }

    public static with<T>(
        id: string,
        payload: T,
        occurredAt: Date,
    ): QueueMessage<T> {
        return new QueueMessage<T>(id, payload, occurredAt);
    }
}
