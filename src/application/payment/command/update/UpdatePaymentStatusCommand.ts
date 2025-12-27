export class UpdatePaymentStatusCommand {
    orderId: string;
    newStatus: string;

    constructor(orderId: string, newStatus: string) {
        this.orderId = orderId;
        this.newStatus = newStatus;
    }
}
