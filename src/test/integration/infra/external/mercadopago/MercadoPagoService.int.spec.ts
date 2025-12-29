import { AxiosResponse } from "axios";
import { of } from "rxjs";
import { MercadoPagoConfig } from "src/infra/config/MercadoPagoConfig";
import { MercadoPagoService } from "src/infra/external/mercadopago/MercadoPagoService";
import { CreateDynamicQrCodeItem } from "src/infra/external/mercadopago/model/CreateDynamicQrCodeItem";
import { CreateDynamicQrCodeRequest } from "src/infra/external/mercadopago/model/CreateDynamicQrCodeRequest";

describe("MercadoPagoService Integration", () => {
    let service: MercadoPagoService;
    let mercadoPagoConfig: MercadoPagoConfig;

    beforeAll(() => {
        const httpServiceMock = { post: jest.fn(), get: jest.fn() } as any;
        const configServiceMock = {
            get: (key: string) => {
                const config = {
                    MERCADO_PAGO_COLLECTOR_ID: "test-collector-id",
                    MERCADO_PAGO_POS_ID: "test-pos-id",
                    MERCADO_PAGO_BASE_URL: "https://api.mercadopago.com",
                    MERCADO_PAGO_ACCESS_TOKEN: "test-access-token",
                };
                return config[key];
            },
        } as any;
        mercadoPagoConfig = new MercadoPagoConfig(configServiceMock);
        service = new MercadoPagoService(httpServiceMock, mercadoPagoConfig);
    });

    it("should create a dynamic QR code", async () => {
        const items: CreateDynamicQrCodeItem[] = [
            new CreateDynamicQrCodeItem("Test Item", 1, 100.0),
        ];
        const request: CreateDynamicQrCodeRequest = {
            externalReference: "test-external-ref",
            totalAmount: 100.0,
            items,
            orderNumber: 12345,
        };

        const httpResponse: AxiosResponse<any> = {
            data: {
                qr_code: "test-qr-code",
            },
            status: 200,
            statusText: "OK",
            headers: {},
            config: {
                headers: new (require("axios").AxiosHeaders)(),
            },
        };

        (service as any).httpService.post.mockReturnValue(of(httpResponse));

        const response = await service.createDynamicQrCode(request);
        expect(response).toBe("test-qr-code");
    });
});
