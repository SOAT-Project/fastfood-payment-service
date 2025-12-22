export class GetPaymentStatusByExternalReferenceOutput {
    paymentStatus: string;

    constructor(paymentStatus: string) {
        this.paymentStatus = paymentStatus;
    }

    public static from(
        paymentStatus: string,
    ): GetPaymentStatusByExternalReferenceOutput {
        return new GetPaymentStatusByExternalReferenceOutput(paymentStatus);
    }
}
