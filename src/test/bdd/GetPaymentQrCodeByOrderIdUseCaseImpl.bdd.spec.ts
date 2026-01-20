import { defineFeature, loadFeature } from "jest-cucumber";
import { GetPaymentQrCodeByOrderIdUseCaseImpl } from "src/application/payment/usecases/retrieve/GetPaymentQrCodeByOrderIdUseCaseImpl";
import { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { QRCodeServiceGateway } from "src/application/payment/gateway/QRCodeServiceGateway";
import { GetPaymentQrCodeByOrderIdCommand } from "src/application/payment/command/retrieve/GetPaymentQrCodeByOrderIdCommand";
import { Payment } from "src/domain/payment/Payment";
import { PaymentId } from "src/domain/payment/PaymentId";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { DataSource } from "typeorm";
import {
    initializeTransactionalContext,
    addTransactionalDataSource,
} from "typeorm-transactional";

const feature = loadFeature("src/test/bdd/GetPaymentQrCodeByOrderId.feature");

defineFeature(feature, (test) => {
    let paymentRepositoryGateway: jest.Mocked<PaymentRepositoryGateway>;
    let qrCodeServiceGateway: jest.Mocked<QRCodeServiceGateway>;
    let useCase: GetPaymentQrCodeByOrderIdUseCaseImpl;
    let command: GetPaymentQrCodeByOrderIdCommand;
    let result: any;
    let error: Error | undefined;
    let dataSource: DataSource;

    beforeAll(async () => {
        initializeTransactionalContext();
        dataSource = new DataSource({ type: "sqlite", database: ":memory:" });
        await dataSource.initialize();
        addTransactionalDataSource(dataSource);
    });

    beforeEach(() => {
        paymentRepositoryGateway = {
            findByOrderId: jest.fn(),
        } as any;
        qrCodeServiceGateway = {
            generateQRCodeImage: jest.fn(),
        } as any;
        useCase = new GetPaymentQrCodeByOrderIdUseCaseImpl(
            paymentRepositoryGateway,
            qrCodeServiceGateway,
        );
        error = undefined;
        result = undefined;
    });

    test("Obter QR code de pagamento com sucesso", ({ given, when, then }) => {
        given(
            /^um pedido existente com id "([^"]*)" e status "([^"]*)"$/,
            (orderId, status) => {
                command = new GetPaymentQrCodeByOrderIdCommand(orderId);
                const paymentId = PaymentId.of(Math.random());
                const payment = Payment.with(
                    paymentId,
                    100,
                    orderId,
                    "qr-code-string",
                    status as PaymentStatus,
                    orderId,
                    "customer-123",
                    new Date(),
                    new Date(),
                    undefined,
                );
                paymentRepositoryGateway.findByOrderId.mockResolvedValue(
                    payment,
                );
                qrCodeServiceGateway.generateQRCodeImage.mockResolvedValue(
                    Buffer.from("qr-code-string"),
                );
            },
        );

        when("o caso de uso de consulta de QR code é executado", async () => {
            try {
                result = await useCase.execute(command);
            } catch (e) {
                error = e as Error;
            }
        });

        then("o QR code deve ser retornado", () => {
            expect(result.qrCodeBuffer).toEqual(Buffer.from("qr-code-string"));
            expect(error).toBeUndefined();
        });
    });

    test("Falha ao obter QR code para pedido inexistente", ({
        given,
        when,
        then,
    }) => {
        given("um pedido inexistente", () => {
            command = new GetPaymentQrCodeByOrderIdCommand("order-404");
            paymentRepositoryGateway.findByOrderId.mockResolvedValue(null);
        });

        when("o caso de uso de consulta de QR code é executado", async () => {
            try {
                result = await useCase.execute(command);
            } catch (e) {
                error = e as Error;
            }
        });

        then("deve lançar um erro de não encontrado", () => {
            expect(error).toBeDefined();
        });
    });

    test("Falha ao obter QR code para status diferente de PENDING", ({
        given,
        when,
        then,
    }) => {
        given(
            /^um pedido existente com id "([^"]*)" e status "([^"]*)"$/,
            (orderId, status) => {
                command = new GetPaymentQrCodeByOrderIdCommand(orderId);
                const paymentId = PaymentId.of(Math.random());
                const payment = Payment.with(
                    paymentId,
                    100,
                    orderId,
                    "qr-code-string",
                    status as PaymentStatus,
                    orderId,
                    "customer-123",
                    new Date(),
                    new Date(),
                    undefined,
                );
                paymentRepositoryGateway.findByOrderId.mockResolvedValue(
                    payment,
                );
            },
        );

        when("o caso de uso de consulta de QR code é executado", async () => {
            try {
                result = await useCase.execute(command);
            } catch (e) {
                error = e as Error;
            }
        });

        then("deve lançar um erro de estado inválido", () => {
            expect(error).toBeDefined();
            expect(error?.message).toContain("Illegal state");
        });
    });

    test("Falha ao obter QR code vazio", ({ given, when, then }) => {
        given('um pedido existente com id "order-123" e QR code vazio', () => {
            command = new GetPaymentQrCodeByOrderIdCommand("order-123");
            const paymentId = PaymentId.of(Math.random());
            const payment = Payment.with(
                paymentId,
                100,
                "order-123",
                "",
                PaymentStatus.PENDING,
                "order-123",
                "customer-123",
                new Date(),
                new Date(),
                undefined,
            );
            paymentRepositoryGateway.findByOrderId.mockResolvedValue(payment);
        });

        when("o caso de uso de consulta de QR code é executado", async () => {
            try {
                result = await useCase.execute(command);
            } catch (e) {
                error = e as Error;
            }
        });

        then("deve lançar um erro de estado inválido", () => {
            expect(error).toBeDefined();
            expect(error?.message).toContain("Illegal state");
        });
    });
});
