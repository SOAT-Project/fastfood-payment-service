export class CreatePaymentCommand {
    orderId: string;
    customerId: string;
    totalAmount: number;
    items: Array<{
        productId: number;
        quantity: number;
        price: number;
    }>;

    constructor(
        orderId: string,
        customerId: string,
        totalAmount: number,
        items: Array<{ productId: number; quantity: number; price: number }>,
    ) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.totalAmount = totalAmount;
        this.items = items;
    }
}
