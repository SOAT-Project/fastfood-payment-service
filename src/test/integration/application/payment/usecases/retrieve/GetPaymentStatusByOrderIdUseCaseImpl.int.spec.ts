import { GetPaymentStatusByOrderIdCommand } from "src/application/payment/command/retrieve/GetPaymentStatusByOrderIdCommand";
import { GetPaymentStatusByOrderIdUseCaseImpl } from "src/application/payment/usecases/retrieve/GetPaymentStatusByOrderIdUseCaseImpl";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { PaymentRepositoryGatewayImpl } from "src/infra/persistence/PaymentRepositoryGatewayImpl";
import { PaymentRepository } from "src/infra/persistence/repository/PaymentRepository";
import { PaymentTypeOrmEntity } from "src/infra/persistence/typeorm/PaymentEntity";

describe("GetPaymentStatusByOrderIdUseCaseImpl Integration", () => {
    let paymentRepository: PaymentRepository;
    let paymentRepositoryGateway: PaymentRepositoryGatewayImpl;
    let useCase: GetPaymentStatusByOrderIdUseCaseImpl;

    beforeAll(() => {
        paymentRepository = {
            findByOrderId: jest.fn(),
        } as any;
        paymentRepositoryGateway = new PaymentRepositoryGatewayImpl(
            paymentRepository,
        );
        useCase = new GetPaymentStatusByOrderIdUseCaseImpl(
            paymentRepositoryGateway,
        );
    });

    it("should return payment status for valid order", async () => {
        const payment = new PaymentTypeOrmEntity();
        payment.id = 1;
        payment.orderId = "order-123";
        payment.qrCode = "some-qr-code-data";
        payment.status = PaymentStatus.PENDING;
        payment.value = 100;
        payment.externalReference = "ext-ref-123";
        payment.customerId = "customer-123";

        jest.spyOn(paymentRepository, "findByOrderId").mockResolvedValueOnce(
            payment,
        );

        const command = new GetPaymentStatusByOrderIdCommand("order-123");
        const result = await useCase.execute(command);
        expect(result.paymentStatus).toBe(PaymentStatus.PENDING);
    });
});
