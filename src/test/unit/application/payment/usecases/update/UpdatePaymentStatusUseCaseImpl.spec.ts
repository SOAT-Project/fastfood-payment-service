import { UpdatePaymentStatusCommand } from "src/application/payment/command/update/UpdatePaymentStatusCommand";
import { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { UpdatePaymentStatusUseCaseImpl } from "src/application/payment/usecases/update/UpdatePaymentStatusUseCaseImpl";
import { Payment } from "src/domain/payment/Payment";
import { PaymentId } from "src/domain/payment/PaymentId";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";

describe("UpdatePaymentStatusUseCaseImpl", () => {
    let paymentRepositoryGateway: jest.Mocked<PaymentRepositoryGateway>;
    let useCase: UpdatePaymentStatusUseCaseImpl;

    beforeEach(() => {
        paymentRepositoryGateway = {
            findByOrderId: jest.fn(),
            update: jest.fn(),
        } as any;
        useCase = new UpdatePaymentStatusUseCaseImpl(paymentRepositoryGateway);
    });

    it("should update payment status for valid order", async () => {
        const command = new UpdatePaymentStatusCommand(
            "order-123",
            PaymentStatus.APPROVED,
        );
        const paymentId = PaymentId.of(Math.random());
        const existingPayment = Payment.with(
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

        const updatedPayment = Payment.with(
            existingPayment.getId(),
            existingPayment.getValue(),
            existingPayment.getExternalReference(),
            existingPayment.getQrCode(),
            PaymentStatus.APPROVED,
            existingPayment.getOrderId(),
            existingPayment.getCustomerId(),
            existingPayment.getCreatedAt(),
            new Date(),
            undefined,
        );
        paymentRepositoryGateway.findByOrderId.mockResolvedValue(
            existingPayment,
        );
        paymentRepositoryGateway.update.mockResolvedValue(updatedPayment);

        const result = await useCase.execute(command);
        expect(result.newPaymentStatus).toBe(PaymentStatus.APPROVED);
        expect(paymentRepositoryGateway.findByOrderId).toHaveBeenCalledWith(
            "order-123",
        );
        expect(paymentRepositoryGateway.update).toHaveBeenCalledWith(
            existingPayment,
            PaymentStatus.APPROVED,
        );
    });

    it("should throw if payment not found", async () => {
        const command = new UpdatePaymentStatusCommand(
            "order-404",
            PaymentStatus.APPROVED,
        );
        paymentRepositoryGateway.findByOrderId.mockResolvedValue(null);
        await expect(useCase.execute(command)).rejects.toThrow();
    });
});
