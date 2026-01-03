import { UseCase } from "src/application/shared/UseCase";
import { CreatePaymentCommand } from "../../command/create/CreatePaymentCommand";

export abstract class CreatePaymentUseCase extends UseCase<
    CreatePaymentCommand,
    void
> {}
