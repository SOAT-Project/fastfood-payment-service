import { Inject, Injectable } from "@nestjs/common";
import { GetPaymentQrCodeByOrderIdUseCase } from "./GetPaymentQrCodeByOrderIdUseCase";
import { GetPaymentQrCodeByOrderIdCommand } from "../../command/retrieve/GetPaymentQrCodeByOrderIdCommand";
import { GetPaymentQrCodeByOrderIdOutput } from "../../output/GetPaymentQrCodeByOrderIdOutput";
import type { PaymentRepositoryGateway } from "../../gateway/PaymentRepositoryGateway";
import { NotFoundException } from "src/domain/exception/NotFoundException";
import { DomainError } from "src/domain/validation/DomainError";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { IllegalStateException } from "src/domain/exception/IllegalStateException";
import type { QRCodeServiceGateway } from "../../gateway/QRCodeServiceGateway";

@Injectable()
export class GetPaymentQrCodeByOrderIdUseCaseImpl extends GetPaymentQrCodeByOrderIdUseCase {
    private paymentRepositoryGateway: PaymentRepositoryGateway;
    private qrCodeServiceGateway: QRCodeServiceGateway;

    constructor(
        @Inject("PaymentRepositoryGateway")
        paymentRepositoryGateway: PaymentRepositoryGateway,
        @Inject("QRCodeServiceGateway")
        qrCodeServiceGateway: QRCodeServiceGateway,
    ) {
        super();
        this.paymentRepositoryGateway = paymentRepositoryGateway;
        this.qrCodeServiceGateway = qrCodeServiceGateway;
    }

    public async execute(
        command: GetPaymentQrCodeByOrderIdCommand,
    ): Promise<GetPaymentQrCodeByOrderIdOutput> {
        const orderId = command.orderId;

        const payment =
            await this.paymentRepositoryGateway.findByOrderId(orderId);

        if (!payment) {
            throw NotFoundException.with([
                new DomainError("Payment not found for the given order ID."),
            ]);
        }

        if (payment.getStatus() !== PaymentStatus.PENDING) {
            throw IllegalStateException.with([
                new DomainError(
                    "QR code can only be retrieved for pending payments.",
                ),
            ]);
        }

        if (!payment.getQrCode()) {
            throw IllegalStateException.with([
                new DomainError("Payment does not have a QR code."),
            ]);
        }

        const qrCodeImg = await this.qrCodeServiceGateway.generateQRCodeImage(
            payment.getQrCode(),
            300,
            300,
        );

        return GetPaymentQrCodeByOrderIdOutput.from(qrCodeImg);
    }
}
