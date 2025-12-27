import { UseCase } from "src/application/shared/UseCase";
import { GetPaymentStatusByOrderIdOutput } from "../../output/GetPaymentQrCodeByOrderIdOutput";
import { GetPaymentStatusByOrderIdCommand } from "../../command/retrieve/GetPaymentStatusByOrderIdCommand";

export abstract class GetPaymentStatusByOrderIdUseCase extends UseCase<
    GetPaymentStatusByOrderIdCommand,
    GetPaymentStatusByOrderIdOutput
> {}
