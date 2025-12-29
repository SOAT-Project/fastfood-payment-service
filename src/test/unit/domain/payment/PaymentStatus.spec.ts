import { PaymentStatus } from "src/domain/payment/PaymentStatus";

describe("PaymentStatus Domain", () => {
    it("should have valid statuses", () => {
        expect(PaymentStatus.PENDING).toBeDefined();
        expect(PaymentStatus.APPROVED).toBeDefined();
        expect(PaymentStatus.CANCELLED).toBeDefined();
        expect(PaymentStatus.IN_PROCESS).toBeDefined();
        expect(PaymentStatus.REJECTED).toBeDefined();
    });

    it("should not allow invalid status", () => {
        const invalidStatus = "INVALID_STATUS";
        expect(
            Object.values(PaymentStatus).includes(
                invalidStatus as PaymentStatus,
            ),
        ).toBe(false);
    });
});
