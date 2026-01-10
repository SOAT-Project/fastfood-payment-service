export interface OrderEvent {
    eventType: string;
    orderId: string;
    customerId: number;
    totalAmount: number;
    items: Array<{
        productId: number;
        quantity: number;
        price: number;
    }>;
    createdAt: string;
}
