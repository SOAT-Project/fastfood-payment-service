import { NotificationException } from "../exception/NotificationException";
import { AggregateRoot } from "../shared/AggregateRoot";
import { Notification } from "../validation/handler/Notification";
import { ValidationHandler } from "../validation/ValidationHandler";
import { PaymentId } from "./PaymentId";
import { PaymentStatus } from "./PaymentStatus";
import { PaymentValidator } from "./PaymentValidator";

export class Payment extends AggregateRoot<PaymentId> {
    private value: number;
    private externalReference: string;
    private qrCode: string;
    private status: PaymentStatus;
    private orderId: string;

    protected constructor(
        id: PaymentId,
        value: number,
        externalReference: string,
        qrCode: string,
        status: PaymentStatus,
        orderId: string,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date,
    ) {
        super(id, createdAt, updatedAt, deletedAt);
        this.value = value;
        this.externalReference = externalReference;
        this.qrCode = qrCode;
        this.status = status;
        this.orderId = orderId;
        this.selfValidation();
    }

    private selfValidation(): void {
        const notification = Notification.create();

        this.validate(notification);

        if (notification.hasError()) {
            throw new NotificationException(
                "Payment is not valid",
                notification,
            );
        }
    }

    validate(handler: ValidationHandler): void {
        new PaymentValidator(this, handler).validate();
    }

    public getValue(): number {
        return this.value;
    }

    public getStatus(): PaymentStatus {
        return this.status;
    }

    public getExternalReference(): string {
        return this.externalReference;
    }

    public updateStatus(newStatus: PaymentStatus): void {
        this.status = newStatus;
        this.updatedAt = new Date();

        this.selfValidation();
    }
}
