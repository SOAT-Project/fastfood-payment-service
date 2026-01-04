jest.mock("typeorm-transactional", () => ({
    Transactional: () => () => ({}),
}));

import { GetPaymentQrCodeByOrderIdCommand } from "src/application/payment/command/retrieve/GetPaymentQrCodeByOrderIdCommand";
import { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import { QRCodeServiceGateway } from "src/application/payment/gateway/QRCodeServiceGateway";
import { GetPaymentQrCodeByOrderIdUseCaseImpl } from "src/application/payment/usecases/retrieve/GetPaymentQrCodeByOrderIdUseCaseImpl";
import { Payment } from "src/domain/payment/Payment";
import { PaymentId } from "src/domain/payment/PaymentId";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";

describe("GetPaymentQrCodeByOrderIdUseCaseImpl", () => {
    let paymentRepositoryGateway: jest.Mocked<PaymentRepositoryGateway>;
    let qrCodeServiceGateway: jest.Mocked<QRCodeServiceGateway>;
    let useCase: GetPaymentQrCodeByOrderIdUseCaseImpl;

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
    });

    it("should return QR code for valid order", async () => {
        const command = new GetPaymentQrCodeByOrderIdCommand("order-123");
        const paymentId = PaymentId.of(Math.random());
        const payment = Payment.with(
            paymentId,
            100,
            "order-123",
            "qr-code-string",
            PaymentStatus.PENDING,
            "order-123",
            "customer-123",
            new Date(),
            new Date(),
            undefined,
        );
        paymentRepositoryGateway.findByOrderId.mockResolvedValue(payment);
        qrCodeServiceGateway.generateQRCodeImage.mockResolvedValue(
            Buffer.from("qr-code-string"),
        );

        const result = await useCase.execute(command);
        expect(result.qrCodeBuffer).toEqual(Buffer.from("qr-code-string"));
        expect(paymentRepositoryGateway.findByOrderId).toHaveBeenCalledWith(
            "order-123",
        );
    });

    it("should throw if payment not found", async () => {
        const command = new GetPaymentQrCodeByOrderIdCommand("order-404");
        paymentRepositoryGateway.findByOrderId.mockResolvedValue(null);
        await expect(useCase.execute(command)).rejects.toThrow(
            "Not Found Exception",
        );
    });

    it("should throw if payment status is not PENDING", async () => {
        const command = new GetPaymentQrCodeByOrderIdCommand("order-123");
        const paymentId = PaymentId.of(Math.random());
        const payment = Payment.with(
            paymentId,
            100,
            "order-123",
            "qr-code-string",
            PaymentStatus.APPROVED,
            "order-123",
            "customer-123",
            new Date(),
            new Date(),
            undefined,
        );
        paymentRepositoryGateway.findByOrderId.mockResolvedValue(payment);
        await expect(useCase.execute(command)).rejects.toThrow("Illegal state");
    });

    it("should throw if payment QR code is empty", async () => {
        const command = new GetPaymentQrCodeByOrderIdCommand("order-123");
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
        await expect(useCase.execute(command)).rejects.toThrow("Illegal state");
    });
});
