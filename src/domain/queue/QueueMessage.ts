export class QueueMessage<T = any> {
    eventType: string;
    orderId: string;
    paidAt: string;
    amount: number;
    groupId?: string;

    protected constructor(
        eventType: string,
        orderId: string,
        paidAt: string,
        amount: number,
        groupId: string | undefined,
    ) {
        this.eventType = eventType;
        this.orderId = orderId;
        this.paidAt = paidAt;
        this.amount = amount;
        this.groupId = groupId;
    }

    static with<T>(
        eventType: string,
        orderId: string,
        paidAt: string,
        amount: number,
        groupId?: string,
    ): QueueMessage<T> {
        return new QueueMessage<T>(eventType, orderId, paidAt, amount, groupId);
    }
}
