import { CreateDynamicQrCodeRequest } from "src/infra/external/mercadopago/model/CreateDynamicQrCodeRequest";

export interface PaymentService {
    createDynamicQrCode(request: CreateDynamicQrCodeRequest): Promise<string>;
}
