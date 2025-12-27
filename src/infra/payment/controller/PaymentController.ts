import { GetPaymentStatusByOrderIdResponse } from "../model/request/GetPaymentStatusByOrderIdResponse";

export interface PaymentController {
    getQrCodeByOrderId(orderId: string): Promise<string>;
    getStatusByOrderId(
        orderId: string,
    ): Promise<GetPaymentStatusByOrderIdResponse>;
    setStatusToPaid(orderId: string): Promise<void>;
}
