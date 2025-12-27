import { UpdatePaymentStatusCommand } from "src/application/payment/command/update/UpdatePaymentStatusCommand";
import { UpdatePaymentStatusOutput } from "src/application/payment/output/UpdatePaymentStatusOutput";
import { UseCase } from "src/application/shared/UseCase";

export abstract class UpdatePaymentStatusUseCase extends UseCase<
    UpdatePaymentStatusCommand,
    UpdatePaymentStatusOutput
> {}
