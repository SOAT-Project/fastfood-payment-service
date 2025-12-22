export class UpdatePaymentStatusOutput {
    externalReference: string;
    newPaymentStatus: string;
    updatedAt: Date;

    constructor(
        externalReference: string,
        newPaymentStatus: string,
        updatedAt: Date,
    ) {
        this.externalReference = externalReference;
        this.newPaymentStatus = newPaymentStatus;
        this.updatedAt = updatedAt;
    }

    public static from(
        externalReference: string,
        newPaymentStatus: string,
        updatedAt: Date,
    ): UpdatePaymentStatusOutput {
        return new UpdatePaymentStatusOutput(
            externalReference,
            newPaymentStatus,
            updatedAt,
        );
    }
}
