import { CreateDynamicQrCodeItem } from "./CreateDynamicQrCodeItem";

export class CreateDynamicQrCodeRequest {
    constructor(
        public readonly orderId: string,
        public readonly externalReference: string,
        public readonly totalAmount: number,
        public readonly items: CreateDynamicQrCodeItem[],
    ) {}
}
