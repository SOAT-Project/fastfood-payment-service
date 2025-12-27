import { Module } from "@nestjs/common";
import { RestPaymentController } from "src/infra/web/RestPaymentController";
import { PaymentControllerImpl } from "../controller/PaymentControllerImpl";
import { UpdatePaymentStatusUseCaseImpl } from "src/application/payment/usecases/update/UpdatePaymentStatusUseCaseImpl";
import { GetPaymentStatusByOrderIdUseCaseImpl } from "src/application/payment/usecases/retrieve/GetPaymentStatusByOrderIdUseCaseImpl";
import { PaymentRepositoryGatewayImpl } from "src/infra/persistence/PaymentRepositoryGatewayImpl";
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
            provide: "PaymentRepositoryGateway",
            useClass: PaymentRepositoryGatewayImpl,
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
        "PaymentRepositoryGateway",
        "UpdatePaymentStatusUseCase",
        "GetPaymentStatusByOrderIdUseCase",
    ],
})
export class PaymentModule {}
