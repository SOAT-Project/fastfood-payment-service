export class CreateDynamicQrCodeItem {
    constructor(
        public readonly title: string,
        public readonly quantity: number,
        public readonly totalAmount: number,
        public readonly unitMeasure: string = "unit",
    ) {}

    get unitPrice(): number {
        return this.totalAmount / this.quantity;
    }
}
