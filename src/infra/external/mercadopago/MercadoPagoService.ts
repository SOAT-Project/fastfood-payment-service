import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { PaymentService } from "src/application/payment/gateway/PaymentService";
import { MercadoPagoConfig } from "src/infra/config/MercadoPagoConfig";
import { CreateDynamicQrCodeResponse } from "./model/CreateDynamicQrCodeResponse";
import { CreateDynamicQrCodeRequest } from "./model/CreateDynamicQrCodeRequest";

@Injectable()
export class MercadoPagoService implements PaymentService {
    private readonly logger = new Logger(MercadoPagoService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly mercadoPagoConfig: MercadoPagoConfig,
    ) {}

    async createDynamicQrCode({
        orderId,
        externalReference,
        totalAmount,
        items: orderProducts,
    }: CreateDynamicQrCodeRequest): Promise<string> {
        try {
            this.logger.log(
                `Creating Mercado Pago dynamic QR code for orderId: ${orderId}`,
            );

            const path = `/instore/orders/qr/seller/collectors/${this.mercadoPagoConfig.collectorId}/pos/${this.mercadoPagoConfig.posId}/qrs`;

            const requestBody = {
                title: `Order ${orderId}`,
                description: `Order ${orderId}`,
                external_reference: externalReference,
                total_amount: totalAmount,
                items: orderProducts.map((orderProduct) => ({
                    title: `Product ${orderProduct.title}`,
                    total_amount: orderProduct.totalAmount,
                    quantity: orderProduct.quantity,
                    unit_price: orderProduct.unitPrice,
                    unit_measure: orderProduct.unitMeasure,
                })),
            };

            const response = await firstValueFrom(
                this.httpService.post<CreateDynamicQrCodeResponse>(
                    path,
                    requestBody,
                    {
                        baseURL: this.mercadoPagoConfig.baseUrl,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${this.mercadoPagoConfig.accessToken}`,
                        },
                    },
                ),
            );

            return response.data.qr_data;
        } catch (error: any) {
            this.logger.error("Mercado Pago error", error);

            if (error.response) {
                throw new Error(
                    `Mercado Pago API error: ${JSON.stringify(error.response.data)}`,
                );
            }

            throw new Error("Unexpected error during Mercado Pago payment");
        }
    }
}
