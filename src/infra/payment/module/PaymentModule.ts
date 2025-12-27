import { Module } from "@nestjs/common";
import { RestPaymentController } from "src/infra/web/RestPaymentController";
import { PaymentControllerImpl } from "../controller/PaymentControllerImpl";
import { UpdatePaymentStatusUseCaseImpl } from "src/application/payment/usecases/update/UpdatePaymentStatusUseCaseImpl";
import { GetPaymentStatusByOrderIdUseCaseImpl } from "src/application/payment/usecases/retrieve/GetPaymentStatusByOrderIdUseCaseImpl";
import { PaymentPersistenceModule } from "src/infra/persistence/module/PaymentPersistenceModule";

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
    ],
    exports: [
        "PaymentController",
        "UpdatePaymentStatusUseCase",
        "GetPaymentStatusByOrderIdUseCase",
    ],
})
export class PaymentModule {}
