export abstract class QueueEvent {
    abstract readonly eventName: string;
    abstract readonly occurredAt: Date;
}
