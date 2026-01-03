import { HttpModule } from "@nestjs/axios";
import { MercadoPagoConfig } from "src/infra/config/MercadoPagoConfig";
import { MercadoPagoService } from "../mercadopago/MercadoPagoService";
import { Module } from "@nestjs/common";

@Module({
    imports: [HttpModule],
    providers: [
        {
            provide: "PaymentService",
            useClass: MercadoPagoService,
        },
        MercadoPagoConfig,
    ],
    exports: ["PaymentService"],
})
export class MercadoPagoModule {}
