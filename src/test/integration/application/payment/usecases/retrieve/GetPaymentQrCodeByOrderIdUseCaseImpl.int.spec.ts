import { GetPaymentQrCodeByOrderIdCommand } from "src/application/payment/command/retrieve/GetPaymentQrCodeByOrderIdCommand";
import { QRCodeServiceGateway } from "src/application/payment/gateway/QRCodeServiceGateway";
import { GetPaymentQrCodeByOrderIdUseCaseImpl } from "src/application/payment/usecases/retrieve/GetPaymentQrCodeByOrderIdUseCaseImpl";
import { PaymentRepositoryGatewayImpl } from "src/infra/persistence/PaymentRepositoryGatewayImpl";

describe("GetPaymentQrCodeByOrderIdUseCaseImpl Integration", () => {
    let paymentRepositoryGateway: PaymentRepositoryGatewayImpl;
    let qrCodeServiceGateway: QRCodeServiceGateway;
    let useCase: GetPaymentQrCodeByOrderIdUseCaseImpl;

    beforeAll(() => {
        paymentRepositoryGateway = new PaymentRepositoryGatewayImpl();
        qrCodeServiceGateway = {
            generateQrCode: jest.fn().mockResolvedValue("qr-code-string"),
        } as any;
        useCase = new GetPaymentQrCodeByOrderIdUseCaseImpl(
            paymentRepositoryGateway,
            qrCodeServiceGateway,
        );
    });

    it("should return QR code for valid order", async () => {
        const command = new GetPaymentQrCodeByOrderIdCommand("order-123");
        const result = await useCase.execute(command);
        expect(result.qrCode).toBe("qr-code-string");
    });
});
