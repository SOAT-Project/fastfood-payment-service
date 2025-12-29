import { NotificationException } from "src/domain/exception/NotificationException";
import { Payment } from "src/domain/payment/Payment";
import { PaymentId } from "src/domain/payment/PaymentId";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";

describe("Payment Domain", () => {
    it("should create a valid payment", () => {
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
        expect(payment.getId()).toBe(paymentId);
        expect(payment.getOrderId()).toBe("order-123");
        expect(payment.getValue()).toBe(100);
        expect(payment.getStatus()).toBe(PaymentStatus.PENDING);
    });

    it("should throw error for invalid amount", () => {
        const paymentId = PaymentId.of(Math.random());
        const payment = () =>
            Payment.with(
                paymentId,
                -50,
                "order-123",
                "qr-code-string",
                PaymentStatus.PENDING,
                "order-123",
                "customer-123",
                new Date(),
                new Date(),
                undefined,
            );
        expect(payment).toThrow(NotificationException);
    });

    it("should throw error for null orderId", () => {
        const paymentId = PaymentId.of(Math.random());
        expect(() => {
            Payment.with(
                paymentId,
                100,
                null as any, // força erro
                "qr-code-string",
                PaymentStatus.PENDING,
                "",
                "customer-123",
                new Date(),
                new Date(),
                undefined,
            );
        }).toThrow(NotificationException);
    });

    it("should throw error for null customerId", () => {
        const paymentId = PaymentId.of(Math.random());
        const payment = () =>
            Payment.with(
                paymentId,
                100,
                "order-123",
                "qr-code-string",
                PaymentStatus.PENDING,
                "order-123",
                null as any, // força erro
                new Date(),
                new Date(),
                undefined,
            );
        expect(payment).toThrow();
    });
});
