import { DomainError } from "../validation/DomainError";
import { DomainException } from "./DomainException";

export class NotFoundException extends DomainException {
    protected constructor(message: string, errors: DomainError[]) {
        super(message, errors);
    }

    static with(errors: DomainError[]): NotFoundException {
        return new NotFoundException("Not Found Exception", errors);
    }
}
