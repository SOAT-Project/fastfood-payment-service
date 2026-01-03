export interface OrderPaidEvent {
    eventType: "ORDER_PAID";
    orderId: string;
    paidAt: string;
    amount: number;
}
