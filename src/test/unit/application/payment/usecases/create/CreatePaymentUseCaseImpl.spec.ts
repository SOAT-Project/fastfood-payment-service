jest.mock("typeorm-transactional", () => ({
    Transactional: () => () => ({}),
}));

import { CreatePaymentCommand } from "src/application/payment/command/create/CreatePaymentCommand";
import { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { PaymentService } from "src/application/payment/gateway/PaymentService";
import { CreatePaymentUseCaseImpl } from "src/application/payment/usecases/create/CreatePaymentUseCaseImpl";
import { Payment } from "src/domain/payment/Payment";
import { PaymentId } from "src/domain/payment/PaymentId";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";

describe("CreatePaymentUseCaseImpl", () => {
    let paymentRepositoryGateway: jest.Mocked<PaymentRepositoryGateway>;
    let paymentService: jest.Mocked<PaymentService>;
    let useCase: CreatePaymentUseCaseImpl;

    beforeEach(() => {
        paymentRepositoryGateway = {
            create: jest.fn(),
            update: jest.fn(),
        } as any;
        paymentService = {
            createDynamicQrCode: jest.fn(),
        } as any;
        useCase = new CreatePaymentUseCaseImpl(
            paymentRepositoryGateway,
            paymentService,
        );
    });

    it("should create payment for valid order", async () => {
        const command = new CreatePaymentCommand(
            "order-123",
            "customer-123",
            100,
            [{ productId: "prod-1", quantity: 2, price: 50 }],
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
            "qr-code-string",
        );
        paymentRepositoryGateway.create.mockResolvedValueOnce(createdPayment);

        const updatedPayment = Payment.with(
            createdPayment.getId(),
            createdPayment.getValue(),
            createdPayment.getExternalReference(),
            "qr-code-string",
            PaymentStatus.PENDING,
            createdPayment.getOrderId(),
            createdPayment.getCustomerId(),
            createdPayment.getCreatedAt(),
            createdPayment.getUpdatedAt(),
            undefined,
        );

        paymentRepositoryGateway.update.mockResolvedValueOnce(updatedPayment);

        await expect(useCase.execute(command)).resolves.toBeUndefined();
        expect(paymentRepositoryGateway.create).toHaveBeenCalledTimes(1);
        expect(paymentRepositoryGateway.update).toHaveBeenCalledTimes(1);
        expect(paymentService.createDynamicQrCode).toHaveBeenCalledTimes(1);
    });

    it("should throw if payment not valid for creation", async () => {
        const command = new CreatePaymentCommand(
            "order-123",
            "customer-123",
            -100,
            [{ productId: "prod-1", quantity: 2, price: 50 }],
        );

        await expect(useCase.execute(command)).rejects.toThrow(
            "Could not create Payment",
        );
    });

    it("should throw if QR code is not returned", async () => {
        const command = new CreatePaymentCommand(
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

        paymentService.createDynamicQrCode.mockResolvedValueOnce(null as any);
        paymentRepositoryGateway.create.mockResolvedValueOnce(createdPayment);

        await expect(useCase.execute(command)).rejects.toThrow(
            "QR Code text was not returned from Payment Service",
        );
    });
});
