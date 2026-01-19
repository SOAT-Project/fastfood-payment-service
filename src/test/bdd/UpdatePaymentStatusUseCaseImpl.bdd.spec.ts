import { defineFeature, loadFeature } from "jest-cucumber";
import { UpdatePaymentStatusUseCaseImpl } from "src/application/payment/usecases/update/UpdatePaymentStatusUseCaseImpl";
import { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { PaymentEventProducerGateway } from "src/application/payment/gateway/PaymentEventProducerGateway";
import { UpdatePaymentStatusCommand } from "src/application/payment/command/update/UpdatePaymentStatusCommand";
import { Payment } from "src/domain/payment/Payment";
import { PaymentId } from "src/domain/payment/PaymentId";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { DataSource } from "typeorm";
import {
    initializeTransactionalContext,
    addTransactionalDataSource,
} from "typeorm-transactional";

const feature = loadFeature("src/test/bdd/UpdatePaymentStatus.feature");

defineFeature(feature, (test) => {
    let paymentRepositoryGateway: jest.Mocked<PaymentRepositoryGateway>;
    let paymentEventProducerGateway: jest.Mocked<PaymentEventProducerGateway>;
    let useCase: UpdatePaymentStatusUseCaseImpl;
    let command: UpdatePaymentStatusCommand;
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
            update: jest.fn(),
        } as any;
        paymentEventProducerGateway = {
            publishPaymentStatusUpdated: jest.fn(),
        } as any;
        useCase = new UpdatePaymentStatusUseCaseImpl(
            paymentRepositoryGateway,
            paymentEventProducerGateway,
        );
        error = undefined;
        result = undefined;
    });

    test("Atualizar status do pagamento com sucesso", ({
        given,
        when,
        then,
    }) => {
        given(
            /^um pedido existente com id "([^"]*)" e status atual "([^"]*)"$/,
            (orderId, currentStatus) => {
                command = new UpdatePaymentStatusCommand(
                    orderId,
                    PaymentStatus.APPROVED,
                );
                const paymentId = PaymentId.of(Math.random());
                const payment = Payment.with(
                    paymentId,
                    100,
                    orderId,
                    "qr-code-string",
                    currentStatus as PaymentStatus,
                    orderId,
                    "customer-123",
                    new Date(),
                    new Date(),
                    undefined,
                );
                paymentRepositoryGateway.findByOrderId.mockResolvedValue(
                    payment,
                );
                paymentRepositoryGateway.update.mockResolvedValue(
                    Payment.with(
                        payment.getId(),
                        payment.getValue(),
                        payment.getExternalReference(),
                        payment.getQrCode(),
                        PaymentStatus.APPROVED,
                        payment.getOrderId(),
                        payment.getCustomerId(),
                        payment.getCreatedAt(),
                        payment.getUpdatedAt(),
                        undefined,
                    ),
                );
            },
        );

        when("o caso de uso de atualização de status é executado", async () => {
            try {
                result = await useCase.execute(command);
            } catch (e) {
                error = e as Error;
            }
        });

        then("o status deve ser atualizado com sucesso", () => {
            expect(result.newPaymentStatus).toBe(PaymentStatus.APPROVED);
            expect(error).toBeUndefined();
        });
    });

    test("Falha ao atualizar status para pedido inexistente", ({
        given,
        when,
        then,
    }) => {
        given("um pedido inexistente", () => {
            command = new UpdatePaymentStatusCommand(
                "order-404",
                PaymentStatus.APPROVED,
            );
            paymentRepositoryGateway.findByOrderId.mockResolvedValue(null);
        });

        when("o caso de uso de atualização de status é executado", async () => {
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
});
