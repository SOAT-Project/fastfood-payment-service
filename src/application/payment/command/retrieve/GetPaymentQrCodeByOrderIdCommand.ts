export class GetPaymentQrCodeByOrderIdCommand {
    orderId: string;

    constructor(orderId: string) {
        this.orderId = orderId;
    }
}
