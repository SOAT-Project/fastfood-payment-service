export interface PaymentStatusUpdatedEvent {
    orderId: string;
    paidAt: string;
    amount: number;
}
