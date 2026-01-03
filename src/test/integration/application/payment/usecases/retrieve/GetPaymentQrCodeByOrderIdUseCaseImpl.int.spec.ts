import { GetPaymentQrCodeByOrderIdCommand } from "src/application/payment/command/retrieve/GetPaymentQrCodeByOrderIdCommand";
import { QRCodeServiceGateway } from "src/application/payment/gateway/QRCodeServiceGateway";
import { GetPaymentQrCodeByOrderIdUseCaseImpl } from "src/application/payment/usecases/retrieve/GetPaymentQrCodeByOrderIdUseCaseImpl";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { PaymentRepositoryGatewayImpl } from "src/infra/persistence/PaymentRepositoryGatewayImpl";
import { PaymentRepository } from "src/infra/persistence/repository/PaymentRepository";
import { PaymentTypeOrmEntity } from "src/infra/persistence/typeorm/PaymentEntity";
import { DataSource } from "typeorm";
import {
    addTransactionalDataSource,
    initializeTransactionalContext,
} from "typeorm-transactional";

describe("GetPaymentQrCodeByOrderIdUseCaseImpl Integration", () => {
    let paymentRepository: PaymentRepository;
    let paymentRepositoryGateway: PaymentRepositoryGatewayImpl;
    let qrCodeServiceGateway: QRCodeServiceGateway;
    let useCase: GetPaymentQrCodeByOrderIdUseCaseImpl;
    let dataSource: DataSource;

    beforeAll(async () => {
        initializeTransactionalContext();
        dataSource = new DataSource({ type: "sqlite", database: ":memory:" });
        await dataSource.initialize();
        addTransactionalDataSource(dataSource);

        paymentRepository = {
            findByOrderId: jest.fn(),
        } as any;
        paymentRepositoryGateway = new PaymentRepositoryGatewayImpl(
            paymentRepository,
        );
        qrCodeServiceGateway = {
            generateQRCodeImage: jest.fn().mockResolvedValue("qr-code-string"),
        } as any;
        useCase = new GetPaymentQrCodeByOrderIdUseCaseImpl(
            paymentRepositoryGateway,
            qrCodeServiceGateway,
        );
    });

    it("should return QR code for valid order", async () => {
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

        const command = new GetPaymentQrCodeByOrderIdCommand("order-123");
        const result = await useCase.execute(command);

        expect(result.qrCodeBuffer).toBe("qr-code-string");
    });
});
