import { DataSource } from "typeorm";
import {
    initializeTransactionalContext,
    addTransactionalDataSource,
} from "typeorm-transactional";
import { CreatePaymentCommand } from "src/application/payment/command/create/CreatePaymentCommand";
import { PaymentService } from "src/application/payment/gateway/PaymentService";
import { CreatePaymentUseCaseImpl } from "src/application/payment/usecases/create/CreatePaymentUseCaseImpl";
import { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { PaymentRepositoryGatewayImpl } from "src/infra/persistence/PaymentRepositoryGatewayImpl";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { PaymentTypeOrmEntity } from "src/infra/persistence/typeorm/PaymentEntity";
describe("CreatePaymentUseCaseImpl Integration", () => {
    let paymentRepository: any;
    let paymentRepositoryGateway: PaymentRepositoryGateway;
    let paymentService: PaymentService;
    let useCase: CreatePaymentUseCaseImpl;
    let dataSource: DataSource;

    beforeAll(async () => {
        initializeTransactionalContext();
        dataSource = new DataSource({ type: "sqlite", database: ":memory:" });
        await dataSource.initialize();
        addTransactionalDataSource(dataSource);

        paymentRepository = {
            save: jest.fn(),
        } as any;
        paymentRepositoryGateway = new PaymentRepositoryGatewayImpl(
            paymentRepository,
        );
        paymentService = {
            createDynamicQrCode: jest.fn().mockResolvedValue("qr-code-string"),
        } as any;
        useCase = new CreatePaymentUseCaseImpl(
            paymentRepositoryGateway,
            paymentService,
        );
    });

    it("should create payment for valid order", async () => {
        const payment = new PaymentTypeOrmEntity();
        payment.id = 1;
        payment.orderId = "order-123";
        payment.qrCode = "";
        payment.status = PaymentStatus.PENDING;
        payment.value = 100;
        payment.externalReference = "ext-ref-123";
        payment.customerId = "customer-123";

        const command = new CreatePaymentCommand(
            "order-123",
            "customer-123",
            100,
            [{ productId: "prod-1", quantity: 2, price: 50 }],
        );

        jest.spyOn(paymentRepository, "save").mockResolvedValueOnce(payment);

        jest.spyOn(paymentService, "createDynamicQrCode").mockResolvedValueOnce(
            "qr-code-string",
        );

        jest.spyOn(paymentRepository, "save").mockResolvedValueOnce({
            ...payment,
            ...{ qrCode: "qr-code-string" },
        });

        expect(await useCase.execute(command)).toBeUndefined();
        expect(paymentRepository.save).toHaveBeenCalledTimes(2);
        expect(paymentService.createDynamicQrCode).toHaveBeenCalledTimes(1);
    });

    it("should throw if QR code is not returned", async () => {
        const payment = new PaymentTypeOrmEntity();
        payment.id = 1;
        payment.orderId = "order-123";
        payment.qrCode = "";
        payment.status = PaymentStatus.PENDING;
        payment.value = 100;
        payment.externalReference = "ext-ref-123";
        payment.customerId = "customer-123";

        jest.spyOn(paymentRepository, "save").mockResolvedValueOnce(payment);

        (paymentService.createDynamicQrCode as jest.Mock).mockResolvedValueOnce(
            null,
        );

        const command = new CreatePaymentCommand(
            "order-456",
            "customer-456",
            200,
            [{ productId: "prod-2", quantity: 1, price: 200 }],
        );

        await expect(useCase.execute(command)).rejects.toThrow(
            "QR Code text was not returned from Payment Service",
        );
    });
});
