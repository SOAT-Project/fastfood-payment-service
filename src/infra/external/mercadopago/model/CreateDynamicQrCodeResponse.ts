import { ApiProperty } from "@nestjs/swagger";

export class CreateDynamicQrCodeResponse {
    @ApiProperty()
    qr_code: string;

    getQrCode(): string {
        return this.qr_code;
    }
}
