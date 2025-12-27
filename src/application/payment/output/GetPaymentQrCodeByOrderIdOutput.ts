export class GetPaymentStatusByOrderIdOutput {
    paymentStatus: string;

    constructor(paymentStatus: string) {
        this.paymentStatus = paymentStatus;
    }

    public static from(paymentStatus: string): GetPaymentStatusByOrderIdOutput {
        return new GetPaymentStatusByOrderIdOutput(paymentStatus);
    }
}
