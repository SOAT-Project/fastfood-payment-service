import { DomainError } from "../validation/DomainError";
import { DomainException } from "./DomainException";

export class IllegalStateException extends DomainException {
    constructor(aMessage: string, someErrors: DomainError[]) {
        super(aMessage, someErrors);
    }

    public static with(errors: DomainError[]): DomainException {
        return new IllegalStateException(
            errors[0]?.message ?? "Illegal state",
            errors,
        );
    }
}
