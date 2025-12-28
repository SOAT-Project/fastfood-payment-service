import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MercadoPagoConfig {
    constructor(private readonly config: ConfigService) {}

    get collectorId(): string | undefined {
        return this.config.get<string>("MERCADO_PAGO_COLLECTOR_ID");
    }

    get posId(): string | undefined {
        return this.config.get<string>("MERCADO_PAGO_POS_ID");
    }

    get baseUrl(): string | undefined {
        return this.config.get<string>("MERCADO_PAGO_BASE_URL");
    }

    get accessToken(): string | undefined {
        return this.config.get<string>("MERCADO_PAGO_ACCESS_TOKEN");
    }
}
