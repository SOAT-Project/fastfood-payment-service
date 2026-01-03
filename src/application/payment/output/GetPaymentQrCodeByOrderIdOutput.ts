export class GetPaymentQrCodeByOrderIdOutput {
    qrCodeBuffer: Buffer<ArrayBufferLike>;

    constructor(qrCodeBuffer: Buffer<ArrayBufferLike>) {
        this.qrCodeBuffer = qrCodeBuffer;
    }

    static from(
        qrCodeBuffer: Buffer<ArrayBufferLike>,
    ): GetPaymentQrCodeByOrderIdOutput {
        return new GetPaymentQrCodeByOrderIdOutput(qrCodeBuffer);
    }
}
