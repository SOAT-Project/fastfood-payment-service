import { UseCase } from "src/application/shared/UseCase";
import { GetPaymentQrCodeByOrderIdCommand } from "../../command/retrieve/GetPaymentQrCodeByOrderIdCommand";
import { GetPaymentQrCodeByOrderIdOutput } from "../../output/GetPaymentQrCodeByOrderIdOutput";

export abstract class GetPaymentQrCodeByOrderIdUseCase extends UseCase<
    GetPaymentQrCodeByOrderIdCommand,
    GetPaymentQrCodeByOrderIdOutput
> {}
