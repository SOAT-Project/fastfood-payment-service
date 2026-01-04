export class QueueMessage<T = any> {
    id: string;
    payload: T;
    groupId?: string;
    occurredAt: Date;

    protected constructor(
        id: string,
        payload: T,
        groupId: string | undefined,
        occurredAt: Date,
    ) {
        this.id = id;
        this.payload = payload;
        this.groupId = groupId;
        this.occurredAt = occurredAt;
    }

    static with<T>(
        id: string,
        payload: T,
        occurredAt: Date,
        groupId?: string,
    ): QueueMessage<T> {
        return new QueueMessage<T>(id, payload, groupId, occurredAt);
    }
}
