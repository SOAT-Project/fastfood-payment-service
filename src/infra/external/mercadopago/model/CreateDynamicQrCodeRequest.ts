import { CreateDynamicQrCodeItem } from "./CreateDynamicQrCodeItem";

export class CreateDynamicQrCodeRequest {
    constructor(
        readonly orderId: string,
        readonly externalReference: string,
        readonly totalAmount: number,
        readonly items: CreateDynamicQrCodeItem[],
    ) {}
}
