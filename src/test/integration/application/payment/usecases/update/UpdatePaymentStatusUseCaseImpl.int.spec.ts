import { UpdatePaymentStatusCommand } from "src/application/payment/command/update/UpdatePaymentStatusCommand";
import { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { UpdatePaymentStatusUseCaseImpl } from "src/application/payment/usecases/update/UpdatePaymentStatusUseCaseImpl";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";

describe("UpdatePaymentStatusUseCaseImpl Integration", () => {
    let paymentRepositoryGateway: jest.Mocked<PaymentRepositoryGateway>;
    let useCase: UpdatePaymentStatusUseCaseImpl;

    beforeAll(() => {
        paymentRepositoryGateway = {
            findByOrderId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        };
        useCase = new UpdatePaymentStatusUseCaseImpl(paymentRepositoryGateway);
    });

    it("should update payment status for valid order", async () => {
        const command = new UpdatePaymentStatusCommand(
            "order-123",
            PaymentStatus.APPROVED,
        );

        const result = await useCase.execute(command);

        expect(result.newPaymentStatus).toBe(PaymentStatus.APPROVED);
    });
});
