export class SetPaymentStatusToPaidResponse {
    constructor(
        public external_reference: string,
        public order_id: string,
        public new_payment_status: string,
        public updated_at: Date,
    ) {}
}
