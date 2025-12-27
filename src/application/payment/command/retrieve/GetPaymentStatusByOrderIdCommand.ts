export class GetPaymentStatusByOrderIdCommand {
    orderId: string;

    constructor(orderId: string) {
        this.orderId = orderId;
    }
}
