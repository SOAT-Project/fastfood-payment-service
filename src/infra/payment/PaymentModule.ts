import { Module } from "@nestjs/common";
import { RestPaymentController } from "src/infra/web/RestPaymentController";
import { UpdatePaymentStatusUseCaseImpl } from "src/application/payment/usecases/update/UpdatePaymentStatusUseCaseImpl";
import { GetPaymentStatusByOrderIdUseCaseImpl } from "src/application/payment/usecases/retrieve/GetPaymentStatusByOrderIdUseCaseImpl";
import { PaymentPersistenceModule } from "src/infra/persistence/module/PaymentPersistenceModule";
import { QRCodeService } from "src/infra/utility/qrcode/QRCodeService";
import { GetPaymentQrCodeByOrderIdUseCaseImpl } from "src/application/payment/usecases/retrieve/GetPaymentQrCodeByOrderIdUseCaseImpl";
import { PaymentControllerImpl } from "./controller/PaymentControllerImpl";

@Module({
    imports: [PaymentPersistenceModule],
    controllers: [RestPaymentController],
    providers: [
        {
            provide: "PaymentController",
            useClass: PaymentControllerImpl,
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
        "UpdatePaymentStatusUseCase",
        "GetPaymentStatusByOrderIdUseCase",
        "GetPaymentQrCodeByOrderIdUseCase",
        "QRCodeServiceGateway",
    ],
})
export class PaymentModule {}
