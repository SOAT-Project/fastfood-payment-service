import type { Response } from "express";
import { GetPaymentStatusByOrderIdResponse } from "src/infra/payment/model/request/GetPaymentStatusByOrderIdResponse";

export interface PaymentAPI {
    getQrCodeByOrderId(orderId: string, res: Response): Promise<void>;
    getStatusByOrderId(
        orderId: string,
    ): Promise<GetPaymentStatusByOrderIdResponse>;
    setStatusToPaid(orderId: string): Promise<void>;
}
