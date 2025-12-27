export class GetPaymentQrCodeByOrderIdOutput {
    paymentStatus: string;

    constructor(paymentStatus: string) {
        this.paymentStatus = paymentStatus;
    }

    public static from(paymentStatus: string): GetPaymentQrCodeByOrderIdOutput {
        return new GetPaymentQrCodeByOrderIdOutput(paymentStatus);
    }
}
