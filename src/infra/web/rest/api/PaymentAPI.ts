import type { Response } from "express";
import { GetPaymentStatusByOrderIdResponse } from "src/infra/payment/model/response/GetPaymentStatusByOrderIdResponse";
import { SetPaymentStatusToPaidResponse } from "src/infra/payment/model/response/SetPaymentStatusToPaidResponse";

export interface PaymentAPI {
    getQrCodeByOrderId(orderId: string, res: Response): Promise<void>;
    getStatusByOrderId(
        orderId: string,
    ): Promise<GetPaymentStatusByOrderIdResponse>;
    setStatusToPaid(orderId: string): Promise<SetPaymentStatusToPaidResponse>;
}
