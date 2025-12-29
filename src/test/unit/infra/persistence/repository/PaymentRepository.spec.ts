import { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { Payment } from "src/domain/payment/Payment";
import { PaymentId } from "src/domain/payment/PaymentId";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";

describe("PaymentRepository Unit", () => {
    let repository: jest.Mocked<PaymentRepositoryGateway>;

    beforeEach(() => {
        repository = {
            findByOrderId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        };
    });

    it("should save and retrieve a payment", async () => {
        const paymentId = PaymentId.of(Math.random());
        const payment = Payment.with(
            paymentId,
            100,
            "order-123",
            "qr-code-string",
            PaymentStatus.PENDING,
            "order-123",
            "customer-123",
            new Date(),
            new Date(),
            undefined,
        );

        repository.create.mockResolvedValue(payment);

        expect(await repository.create(payment)).toBe(payment);
    });

    it("should update payment status", async () => {
        const paymentId = PaymentId.of(Math.random());
        const payment = Payment.with(
            paymentId,
            100,
            "order-123",
            "qr-code-string",
            PaymentStatus.PENDING,
            "order-456",
            "customer-123",
            new Date(),
            new Date(),
            undefined,
        );
        repository.create.mockResolvedValue(payment);

        await repository.create(payment);

        const paymentUpdated = Payment.with(
            payment.getId(),
            payment.getValue(),
            payment.getExternalReference(),
            payment.getQrCode(),
            PaymentStatus.APPROVED,
            payment.getOrderId(),
            payment.getCustomerId(),
            payment.getCreatedAt(),
            new Date(),
            payment.getDeletedAt(),
        );

        repository.update.mockResolvedValue(paymentUpdated);

        await repository.update(paymentUpdated);

        repository.findByOrderId.mockResolvedValue(paymentUpdated);

        const updated = await repository.findByOrderId("order-456");

        expect(updated?.getStatus()).toBe(PaymentStatus.APPROVED);
    });
});
