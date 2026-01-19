import { defineFeature, loadFeature } from "jest-cucumber";
import { GetPaymentStatusByOrderIdUseCaseImpl } from "src/application/payment/usecases/retrieve/GetPaymentStatusByOrderIdUseCaseImpl";
import { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { GetPaymentStatusByOrderIdCommand } from "src/application/payment/command/retrieve/GetPaymentStatusByOrderIdCommand";
import { Payment } from "src/domain/payment/Payment";
import { PaymentId } from "src/domain/payment/PaymentId";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { DataSource } from "typeorm";
import {
    initializeTransactionalContext,
    addTransactionalDataSource,
} from "typeorm-transactional";

const feature = loadFeature("src/test/bdd/GetPaymentStatusByOrderId.feature");

defineFeature(feature, (test) => {
    let paymentRepositoryGateway: jest.Mocked<PaymentRepositoryGateway>;
    let useCase: GetPaymentStatusByOrderIdUseCaseImpl;
    let command: GetPaymentStatusByOrderIdCommand;
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
        useCase = new GetPaymentStatusByOrderIdUseCaseImpl(
            paymentRepositoryGateway,
        );
        error = undefined;
        result = undefined;
    });

    test("Obter status de pagamento com sucesso", ({ given, when, then }) => {
        given(/^um pedido existente com id "([^"]*)"$/, (orderId) => {
            command = new GetPaymentStatusByOrderIdCommand(orderId);
            const paymentId = PaymentId.of(Math.random());
            const payment = Payment.with(
                paymentId,
                100,
                orderId,
                "qr-code-string",
                PaymentStatus.PENDING,
                orderId,
                "customer-123",
                new Date(),
                new Date(),
                undefined,
            );
            paymentRepositoryGateway.findByOrderId.mockResolvedValue(payment);
        });

        when("o caso de uso de consulta de status é executado", async () => {
            try {
                result = await useCase.execute(command);
            } catch (e) {
                error = e as Error;
            }
        });

        then(/^o status retornado deve ser "([^"]*)"$/, (status) => {
            expect(result.paymentStatus).toBe(status);
            expect(error).toBeUndefined();
        });
    });

    test("Falha ao obter status de pagamento para pedido inexistente", ({
        given,
        when,
        then,
    }) => {
        given("um pedido inexistente", () => {
            command = new GetPaymentStatusByOrderIdCommand("order-404");
            paymentRepositoryGateway.findByOrderId.mockResolvedValue(null);
        });

        when("o caso de uso de consulta de status é executado", async () => {
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
