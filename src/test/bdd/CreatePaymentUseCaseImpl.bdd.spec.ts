import { defineFeature, loadFeature } from "jest-cucumber";
import { CreatePaymentUseCaseImpl } from "src/application/payment/usecases/create/CreatePaymentUseCaseImpl";
import { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { PaymentService } from "src/application/payment/gateway/PaymentService";
import { CreatePaymentCommand } from "src/application/payment/command/create/CreatePaymentCommand";
import { Payment } from "src/domain/payment/Payment";
import { PaymentId } from "src/domain/payment/PaymentId";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { DataSource } from "typeorm";
import {
    initializeTransactionalContext,
    addTransactionalDataSource,
} from "typeorm-transactional";

const feature = loadFeature("src/test/bdd/CreatePayment.feature");

defineFeature(feature, (test) => {
    let paymentRepositoryGateway: jest.Mocked<PaymentRepositoryGateway>;
    let paymentService: jest.Mocked<PaymentService>;
    let useCase: CreatePaymentUseCaseImpl;
    let command: CreatePaymentCommand;
    let error: Error | undefined;
    let result: any;
    let dataSource: DataSource;

    beforeAll(async () => {
        initializeTransactionalContext();
        dataSource = new DataSource({ type: "sqlite", database: ":memory:" });
        await dataSource.initialize();
        addTransactionalDataSource(dataSource);
    });

    beforeEach(() => {
        paymentRepositoryGateway = {
            create: jest.fn(),
            update: jest.fn(),
            findByOrderId: jest.fn(),
        } as any;
        paymentService = {
            createDynamicQrCode: jest.fn(),
        } as any;
        useCase = new CreatePaymentUseCaseImpl(
            paymentRepositoryGateway,
            paymentService,
        );
        error = undefined;
        result = undefined;
    });

    test("Criar pagamento com sucesso", ({ given, when, then }) => {
        given(
            /^um pedido válido com id "([^"]*)" e valor (\d+)$/,
            (orderId, value) => {
                command = new CreatePaymentCommand(
                    orderId,
                    "customer-123",
                    parseInt(value),
                    [
                        {
                            productId: "prod-1",
                            quantity: 2,
                            price: parseInt(value) / 2,
                        },
                    ],
                );
                const paymentId = PaymentId.of(Math.random());
                const createdPayment = Payment.with(
                    paymentId,
                    parseInt(value),
                    orderId,
                    "",
                    PaymentStatus.PENDING,
                    orderId,
                    "customer-123",
                    new Date(),
                    new Date(),
                    undefined,
                );
                paymentService.createDynamicQrCode.mockResolvedValueOnce(
                    "qr-code-string",
                );
                paymentRepositoryGateway.create.mockResolvedValueOnce(
                    createdPayment,
                );
                paymentRepositoryGateway.update.mockResolvedValueOnce(
                    Payment.with(
                        createdPayment.getId(),
                        createdPayment.getValue(),
                        createdPayment.getExternalReference(),
                        "qr-code-string",
                        createdPayment.getStatus(),
                        createdPayment.getOrderId(),
                        createdPayment.getCustomerId(),
                        createdPayment.getCreatedAt(),
                        createdPayment.getUpdatedAt(),
                        undefined,
                    ),
                );
            },
        );

        when("o caso de uso de criação de pagamento é executado", async () => {
            try {
                result = await useCase.execute(command);
            } catch (e) {
                error = e as Error;
            }
        });

        then("o pagamento deve ser criado com sucesso", () => {
            expect(paymentRepositoryGateway.create).toHaveBeenCalled();
            expect(paymentRepositoryGateway.update).toHaveBeenCalled();
            expect(paymentService.createDynamicQrCode).toHaveBeenCalled();
            expect(error).toBeUndefined();
        });
    });

    test("Falha ao criar pagamento com valor inválido", ({
        given,
        when,
        then,
    }) => {
        given("um pedido com valor negativo", () => {
            command = new CreatePaymentCommand(
                "order-123",
                "customer-123",
                -100,
                [{ productId: "prod-1", quantity: 2, price: 50 }],
            );
        });

        when("o caso de uso de criação de pagamento é executado", async () => {
            try {
                result = await useCase.execute(command);
            } catch (e) {
                error = e as Error;
            }
        });

        then("deve lançar um erro de criação de pagamento", () => {
            expect(error).toBeDefined();
            expect(error?.message).toContain("Could not create Payment");
        });
    });

    test("Falha ao criar pagamento sem QR code", ({ given, when, then }) => {
        given("um pedido válido mas o serviço de QR code não retorna", () => {
            command = new CreatePaymentCommand(
                "order-456",
                "customer-456",
                200,
                [{ productId: "prod-2", quantity: 1, price: 200 }],
            );
            const paymentId = PaymentId.of(Math.random());
            const createdPayment = Payment.with(
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
            paymentService.createDynamicQrCode.mockResolvedValueOnce(
                null as any,
            );
            paymentRepositoryGateway.create.mockResolvedValueOnce(
                createdPayment,
            );
        });

        when("o caso de uso de criação de pagamento é executado", async () => {
            try {
                result = await useCase.execute(command);
            } catch (e) {
                error = e as Error;
            }
        });

        then("deve lançar um erro de QR code não retornado", () => {
            expect(error).toBeDefined();
            expect(error?.message).toContain(
                "QR Code text was not returned from Payment Service",
            );
        });
    });

    test("Não criar pagamento duplicado para o mesmo pedido", ({
        given,
        when,
        then,
    }) => {
        given(/^um pedido já existente com id "([^"]*)"$/, (orderId) => {
            command = new CreatePaymentCommand(orderId, "customer-789", 150, [
                { productId: "prod-3", quantity: 3, price: 50 },
            ]);
            const existingPayment = Payment.with(
                PaymentId.of(Math.random()),
                150,
                orderId,
                "existing-qr-code",
                PaymentStatus.PENDING,
                orderId,
                "customer-789",
                new Date(),
                new Date(),
                undefined,
            );
            paymentRepositoryGateway.findByOrderId.mockResolvedValueOnce(
                existingPayment,
            );
        });

        when("o caso de uso de criação de pagamento é executado", async () => {
            try {
                result = await useCase.execute(command);
            } catch (e) {
                error = e as Error;
            }
        });

        then("não deve criar um novo pagamento", () => {
            expect(paymentRepositoryGateway.create).not.toHaveBeenCalled();
            expect(error).toBeUndefined();
        });
    });
});
