export class QueueMessage<T = any> {
    id: string;
    eventType: string;
    payload: T;
    groupId?: string;
    occurredAt: Date;

    protected constructor(
        id: string,
        eventType: string,
        payload: T,
        groupId: string | undefined,
        occurredAt: Date,
    ) {
        this.id = id;
        this.eventType = eventType;
        this.payload = payload;
        this.groupId = groupId;
        this.occurredAt = occurredAt;
    }

    static with<T>(
        id: string,
        eventType: string,
        payload: T,
        occurredAt: Date,
        groupId?: string,
    ): QueueMessage<T> {
        return new QueueMessage<T>(id, eventType, payload, groupId, occurredAt);
    }
}
