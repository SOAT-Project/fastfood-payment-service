import { MercadoPagoService } from "src/infra/external/mercadopago/MercadoPagoService";
import { CreateDynamicQrCodeRequest } from "src/infra/external/mercadopago/model/CreateDynamicQrCodeRequest";

describe("MercadoPagoService Integration", () => {
    let service: MercadoPagoService;

    beforeAll(() => {
        service = new MercadoPagoService(/* config params if needed */);
    });

    it("should create a dynamic QR code", async () => {
        const request: CreateDynamicQrCodeRequest = {
            external_reference: "order-123",
        };
        const response = await service.createDynamicQrCode(request);
        expect(response).toHaveProperty("qr_data");
        expect(response.qr_data).toBeDefined();
    });
});
