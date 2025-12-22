export class UpdatePaymentStatusCommand {
    externalReference: string;
    newStatus: string;

    constructor(externalReference: string, newStatus: string) {
        this.externalReference = externalReference;
        this.newStatus = newStatus;
    }
}
