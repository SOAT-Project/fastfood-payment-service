import { UpdatePaymentStatusCommand } from "src/application/payment/command/update/UpdatePaymentStatusCommand";
import { PaymentEventProducerGateway } from "src/application/payment/gateway/PaymentEventProducerGateway";
import { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { UpdatePaymentStatusUseCaseImpl } from "src/application/payment/usecases/update/UpdatePaymentStatusUseCaseImpl";
import { QueueServiceGateway } from "src/application/queue/gateway/QueueServiceGateway";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { PaymentRepositoryGatewayImpl } from "src/infra/persistence/PaymentRepositoryGatewayImpl";
import { PaymentRepository } from "src/infra/persistence/repository/PaymentRepository";
import { PaymentTypeOrmEntity } from "src/infra/persistence/typeorm/PaymentEntity";
import { PaymentEventProducer } from "src/infra/queue/producer/PaymentEventProducer";
import { DataSource } from "typeorm";
import {
    addTransactionalDataSource,
    initializeTransactionalContext,
} from "typeorm-transactional";

describe("UpdatePaymentStatusUseCaseImpl Integration", () => {
    let paymentRepository: PaymentRepository;
    let paymentRepositoryGateway: PaymentRepositoryGatewayImpl;
    let paymentEventProducerGateway: PaymentEventProducerGateway;
    let queueServiceGateway: QueueServiceGateway;
    let useCase: UpdatePaymentStatusUseCaseImpl;
    let dataSource: DataSource;

    beforeAll(async () => {
        initializeTransactionalContext();
        dataSource = new DataSource({ type: "sqlite", database: ":memory:" });
        await dataSource.initialize();
        addTransactionalDataSource(dataSource);

        paymentRepository = {
            findByOrderId: jest.fn(),
            save: jest.fn(),
        } as any;
        paymentRepositoryGateway = new PaymentRepositoryGatewayImpl(
            paymentRepository,
        );

        queueServiceGateway = {
            sendFifoMessage: jest.fn(),
        } as any;
        paymentEventProducerGateway = new PaymentEventProducer(
            queueServiceGateway,
        );
        useCase = new UpdatePaymentStatusUseCaseImpl(
            paymentRepositoryGateway,
            paymentEventProducerGateway,
        );
    });

    it("should update payment status for valid order", async () => {
        const payment = new PaymentTypeOrmEntity();
        payment.id = 1;
        payment.orderId = "order-123";
        payment.qrCode = "some-qr-code-data";
        payment.status = PaymentStatus.PENDING;
        payment.value = 100;
        payment.externalReference = "ext-ref-123";
        payment.customerId = "customer-123";
        payment.createdAt = new Date();

        jest.spyOn(paymentRepository, "findByOrderId").mockResolvedValueOnce(
            payment,
        );

        jest.spyOn(paymentRepository, "save").mockResolvedValueOnce({
            ...payment,
            ...{ status: PaymentStatus.APPROVED },
        });

        const command = new UpdatePaymentStatusCommand(
            "order-123",
            PaymentStatus.APPROVED,
        );

        const result = await useCase.execute(command);

        expect(result.newPaymentStatus).toBe(PaymentStatus.APPROVED);
    });

    it("should not update payment status for invalid order", async () => {
        jest.spyOn(paymentRepository, "findByOrderId").mockResolvedValueOnce(
            null,
        );

        const command = new UpdatePaymentStatusCommand(
            "order-123",
            PaymentStatus.APPROVED,
        );

        await expect(useCase.execute(command)).rejects.toThrow(
            "Not Found Exception",
        );
    });
});
