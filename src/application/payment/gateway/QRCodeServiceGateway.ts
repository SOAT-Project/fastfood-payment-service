export interface QRCodeServiceGateway {
    generateQRCodeImage(
        text: string,
        width: number,
        height: number,
    ): Promise<Buffer>;
}
