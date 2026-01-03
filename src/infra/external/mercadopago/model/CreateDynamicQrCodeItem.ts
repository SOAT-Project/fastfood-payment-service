export class CreateDynamicQrCodeItem {
    constructor(
        readonly title: string,
        readonly quantity: number,
        readonly totalAmount: number,
        readonly unitMeasure: string = "unit",
    ) {}

    get unitPrice(): number {
        return this.totalAmount / this.quantity;
    }
}
