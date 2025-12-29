import { Payment } from "src/domain/payment/Payment";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { PaymentValidator } from "src/domain/payment/PaymentValidator";

describe("PaymentValidator", () => {
    it("should validate a valid payment", () => {
        const payment = new Payment(
            "payment-1",
            "order-123",
            100,
            PaymentStatus.PENDING,
        );
        const result = PaymentValidator.validate(payment);
        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
    });

    it("should invalidate payment with negative amount", () => {
        const payment = new Payment(
            "payment-2",
            "order-123",
            -50,
            PaymentStatus.PENDING,
        );
        const result = PaymentValidator.validate(payment);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain("Amount must be positive");
    });
});
