import { UseCase } from "src/application/shared/UseCase";
import { GetPaymentStatusByOrderIdCommand } from "../../command/retrieve/GetPaymentStatusByOrderIdCommand";
import { GetPaymentStatusByOrderIdOutput } from "../../output/GetPaymentStatusByOrderIdOutput";

export abstract class GetPaymentStatusByOrderIdUseCase extends UseCase<
    GetPaymentStatusByOrderIdCommand,
    GetPaymentStatusByOrderIdOutput
> {}
