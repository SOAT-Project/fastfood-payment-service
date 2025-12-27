import { GetPaymentStatusByOrderIdResponse } from "../model/response/GetPaymentStatusByOrderIdResponse";
import { SetPaymentStatusToPaidResponse } from "../model/response/SetPaymentStatusToPaidResponse";

export interface PaymentController {
    getQrCodeByOrderId(orderId: string): Promise<string>;
    getStatusByOrderId(
        orderId: string,
    ): Promise<GetPaymentStatusByOrderIdResponse>;
    setStatusToPaid(orderId: string): Promise<SetPaymentStatusToPaidResponse>;
}
