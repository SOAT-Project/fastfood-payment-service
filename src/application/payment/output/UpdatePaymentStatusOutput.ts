export class UpdatePaymentStatusOutput {
    externalReference: string;
    orderId: string;
    newPaymentStatus: string;
    updatedAt: Date;

    constructor(
        externalReference: string,
        orderId: string,
        newPaymentStatus: string,
        updatedAt: Date,
    ) {
        this.externalReference = externalReference;
        this.orderId = orderId;
        this.newPaymentStatus = newPaymentStatus;
        this.updatedAt = updatedAt;
    }

    public static from(
        externalReference: string,
        orderId: string,
        newPaymentStatus: string,
        updatedAt: Date,
    ): UpdatePaymentStatusOutput {
        return new UpdatePaymentStatusOutput(
            externalReference,
            orderId,
            newPaymentStatus,
            updatedAt,
        );
    }
}
