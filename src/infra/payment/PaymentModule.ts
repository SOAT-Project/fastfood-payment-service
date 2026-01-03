import { Module } from "@nestjs/common";
import { RestPaymentController } from "src/infra/web/RestPaymentController";
import { UpdatePaymentStatusUseCaseImpl } from "src/application/payment/usecases/update/UpdatePaymentStatusUseCaseImpl";
import { GetPaymentStatusByOrderIdUseCaseImpl } from "src/application/payment/usecases/retrieve/GetPaymentStatusByOrderIdUseCaseImpl";
import { PaymentPersistenceModule } from "src/infra/persistence/module/PaymentPersistenceModule";
import { QRCodeService } from "src/infra/utility/qrcode/QRCodeService";
import { GetPaymentQrCodeByOrderIdUseCaseImpl } from "src/application/payment/usecases/retrieve/GetPaymentQrCodeByOrderIdUseCaseImpl";
import { PaymentControllerImpl } from "./controller/PaymentControllerImpl";
import { CreatePaymentUseCaseImpl } from "src/application/payment/usecases/create/CreatePaymentUseCaseImpl";
import { QueueModule } from "../queue/QueueModule";
import { MercadoPagoModule } from "../external/mercadopago/MercadoPagoModule";

@Module({
    imports: [PaymentPersistenceModule, QueueModule, MercadoPagoModule],
    controllers: [RestPaymentController],
    providers: [
        {
            provide: "PaymentController",
            useClass: PaymentControllerImpl,
        },
        {
            provide: "CreatePaymentUseCase",
            useClass: CreatePaymentUseCaseImpl,
        },
        {
            provide: "UpdatePaymentStatusUseCase",
            useClass: UpdatePaymentStatusUseCaseImpl,
        },
        {
            provide: "GetPaymentStatusByOrderIdUseCase",
            useClass: GetPaymentStatusByOrderIdUseCaseImpl,
        },
        {
            provide: "GetPaymentQrCodeByOrderIdUseCase",
            useClass: GetPaymentQrCodeByOrderIdUseCaseImpl,
        },
        {
            provide: "QRCodeServiceGateway",
            useClass: QRCodeService,
        },
    ],
    exports: [
        "PaymentController",
        "CreatePaymentUseCase",
        "UpdatePaymentStatusUseCase",
        "GetPaymentStatusByOrderIdUseCase",
        "GetPaymentQrCodeByOrderIdUseCase",
        "QRCodeServiceGateway",
    ],
})
export class PaymentModule {}
