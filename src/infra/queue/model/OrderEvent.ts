export interface OrderEvent {
    eventType: string;
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
