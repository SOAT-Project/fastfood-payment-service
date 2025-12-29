import { Entity } from "../shared/Entity";
import { Identifier } from "../shared/Identifier";
import { PublicIdentifier } from "../shared/PublicIdentifier";
import { DomainError } from "../validation/DomainError";
import { DomainException } from "./DomainException";

export class NotFoundException extends DomainException {
    protected constructor(message: string, errors: DomainError[]) {
        super(message, errors);
    }

    static with(errors: DomainError[]): NotFoundException {
        if (errors.length === 1)
            return new NotFoundException(errors[0].message, [errors[0]]);

        return new NotFoundException("Not Found Exception", errors);
    }
}
