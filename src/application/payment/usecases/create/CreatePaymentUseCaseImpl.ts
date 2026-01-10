import type { PaymentRepositoryGateway } from "src/application/payment/gateway/PaymentRepositoryGateway";
import type { PaymentService } from "../../gateway/PaymentService";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { CreatePaymentUseCase } from "./CreatePaymentUseCase";
import { CreatePaymentCommand } from "../../command/create/CreatePaymentCommand";
import { Payment } from "src/domain/payment/Payment";
import { Notification } from "src/domain/validation/handler/Notification";
import { NotificationException } from "src/domain/exception/NotificationException";
import { CreateDynamicQrCodeRequest } from "src/infra/external/mercadopago/model/CreateDynamicQrCodeRequest";
import { randomUUID } from "node:crypto";
import { CreateDynamicQrCodeItem } from "src/infra/external/mercadopago/model/CreateDynamicQrCodeItem";
import { IllegalStateException } from "src/domain/exception/IllegalStateException";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CreatePaymentUseCaseImpl extends CreatePaymentUseCase {
    private readonly logger = new Logger(CreatePaymentUseCaseImpl.name);

    constructor(
        @Inject("PaymentRepositoryGateway")
        private readonly paymentRepositoryGateway: PaymentRepositoryGateway,
        @Inject("PaymentService")
        private readonly paymentService: PaymentService,
    ) {
        super();
    }

    @Transactional()
    async execute({
        totalAmount,
        orderId,
        customerId,
        items,
    }: CreatePaymentCommand): Promise<void> {
        const existingPayment =
            await this.paymentRepositoryGateway.findByOrderId(orderId);

        if (existingPayment) {
            this.logger.warn(`Payment already exists for orderId: ${orderId}`);
            return;
        }

        const notification = Notification.create();

        const externalReference = randomUUID().toString();

        const payment = notification.validate<Payment>(() =>
            Payment.newPayment(
                totalAmount,
                externalReference,
                "",
                orderId,
                customerId,
            ),
        );

        if (notification.hasError()) {
            this.logger.error(
                `Payment validation failed for orderId: ${orderId})`,
            );

            throw new NotificationException(
                "Could not create Payment",
                notification,
            );
        }

        const savedPayment =
            await this.paymentRepositoryGateway.create(payment);

        const dynamicQrCodeItems: CreateDynamicQrCodeItem[] = items.map(
            (item) => ({
                title: item.productId,
                quantity: item.quantity,
                totalAmount: item.price * item.quantity,
                unitMeasure: "unit",
                unitPrice: item.price,
            }),
        );

        const dynamicQrCodeRequest = new CreateDynamicQrCodeRequest(
            orderId,
            externalReference,
            savedPayment.getValue(),
            dynamicQrCodeItems,
        );

        const qrCodeText =
            await this.paymentService.createDynamicQrCode(dynamicQrCodeRequest);

        if (!qrCodeText) {
            throw new IllegalStateException(
                "QR Code text was not returned from Payment Service",
                [],
            );
        }

        savedPayment.setQrCode(qrCodeText);

        await this.paymentRepositoryGateway.update(savedPayment);
    }
}
