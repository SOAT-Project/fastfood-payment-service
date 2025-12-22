import { DomainError } from "../validation/DomainError";
import { ValidationHandler } from "../validation/ValidationHandler";
import { Validator } from "../validation/Validator";
import { Payment } from "./Payment";

export class PaymentValidator extends Validator {
    private payment: Payment;

    constructor(payment: Payment, handler: ValidationHandler) {
        super(handler);
        this.payment = payment;
    }

    public validate(): void {
        this.checkValueConstraints();
        this.checkStatusConstraints();
    }

    private checkValueConstraints(): void {
        const value = this.payment.getValue();

        if (value === null || value === undefined) {
            this.validateHandler().appendDomainError(
                new DomainError("'value' should not be null"),
            );
        }

        if (value <= 0) {
            this.validateHandler().appendDomainError(
                new DomainError("'value' should be greater than 0"),
            );
        }
    }

    private checkStatusConstraints(): void {
        const status = this.payment.getStatus();

        if (status === null || status === undefined) {
            this.validateHandler().appendDomainError(
                new DomainError("'status' should not be null"),
            );
        }
    }
}
