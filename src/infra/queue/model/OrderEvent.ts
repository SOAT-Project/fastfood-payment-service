export interface OrderEvent {
    eventType: string;
    orderId: string;
    customerId: string;
    totalAmount: number;
    items: Array<{
        productId: number;
        quantity: number;
        price: number;
    }>;
    createdAt: string;
}
