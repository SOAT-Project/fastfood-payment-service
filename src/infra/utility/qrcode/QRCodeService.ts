import { Injectable } from "@nestjs/common";
import QRCode from "qrcode";
import { QRCodeServiceGateway } from "src/application/payment/gateway/QRCodeServiceGateway";

@Injectable()
export class QRCodeService implements QRCodeServiceGateway {
    async generateQRCodeImage(
        text: string,
        width: number,
        height: number,
    ): Promise<Buffer> {
        try {
            return await QRCode.toBuffer(text, {
                type: "png",
                width,
                errorCorrectionLevel: "M",
            });
        } catch (error) {
            throw new Error("Error generating QR code");
        }
    }
}
