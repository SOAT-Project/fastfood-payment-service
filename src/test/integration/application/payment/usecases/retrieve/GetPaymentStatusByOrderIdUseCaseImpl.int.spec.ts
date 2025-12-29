import { GetPaymentStatusByOrderIdCommand } from "src/application/payment/command/retrieve/GetPaymentStatusByOrderIdCommand";
import { GetPaymentStatusByOrderIdUseCaseImpl } from "src/application/payment/usecases/retrieve/GetPaymentStatusByOrderIdUseCaseImpl";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { PaymentRepositoryGatewayImpl } from "src/infra/persistence/PaymentRepositoryGatewayImpl";

describe("GetPaymentStatusByOrderIdUseCaseImpl Integration", () => {
    let paymentRepositoryGateway: PaymentRepositoryGatewayImpl;
    let useCase: GetPaymentStatusByOrderIdUseCaseImpl;

    beforeAll(() => {
        paymentRepositoryGateway = new PaymentRepositoryGatewayImpl();
        useCase = new GetPaymentStatusByOrderIdUseCaseImpl(
            paymentRepositoryGateway,
        );
    });

    it("should return payment status for valid order", async () => {
        // Prepare test data in repository
        // ...
        const command = new GetPaymentStatusByOrderIdCommand("order-123");
        const result = await useCase.execute(command);
        expect(result.status).toBe(PaymentStatus.PAID);
    });
});
