import { GetPaymentStatusByOrderIdCommand } from "src/application/payment/command/retrieve/GetPaymentStatusByOrderIdCommand";
import { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { GetPaymentStatusByOrderIdUseCaseImpl } from "src/application/payment/usecases/retrieve/GetPaymentStatusByOrderIdUseCaseImpl";
import { Payment } from "src/domain/payment/Payment";
import { PaymentId } from "src/domain/payment/PaymentId";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";

describe("GetPaymentStatusByOrderIdUseCaseImpl", () => {
    let paymentRepositoryGateway: jest.Mocked<PaymentRepositoryGateway>;
    let useCase: GetPaymentStatusByOrderIdUseCaseImpl;

    beforeEach(() => {
        paymentRepositoryGateway = {
            findByOrderId: jest.fn(),
        } as any;
        useCase = new GetPaymentStatusByOrderIdUseCaseImpl(
            paymentRepositoryGateway,
        );
    });

    it("should return payment status for valid order", async () => {
        const command = new GetPaymentStatusByOrderIdCommand("order-123");
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
        paymentRepositoryGateway.findByOrderId.mockResolvedValue(payment);

        const result = await useCase.execute(command);
        expect(result.paymentStatus).toBe(PaymentStatus.PENDING);
        expect(paymentRepositoryGateway.findByOrderId).toHaveBeenCalledWith(
            "order-123",
        );
    });

    it("should throw if payment not found", async () => {
        const command = new GetPaymentStatusByOrderIdCommand("order-404");
        paymentRepositoryGateway.findByOrderId.mockResolvedValue(null);
        await expect(useCase.execute(command)).rejects.toThrow();
    });
});
