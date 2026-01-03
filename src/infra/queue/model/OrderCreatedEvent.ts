export interface OrderCreatedEvent {
    eventType: "ORDER_CREATED";
    orderId: string;
    customerId: string;
    totalAmount: number;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    createdAt: string;
}
