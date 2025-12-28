import { HttpModule } from "@nestjs/axios";
import { MercadoPagoConfig } from "src/infra/config/MercadoPagoConfig";
import { MercadoPagoService } from "../mercadopago/MercadoPagoService";
import { Module } from "@nestjs/common";

@Module({
    imports: [HttpModule],
    providers: [MercadoPagoService, MercadoPagoConfig],
    exports: [MercadoPagoService],
})
export class MercadoPagoModule {}
