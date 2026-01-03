import { DomainException } from "src/domain/exception/DomainException";
import { DomainError } from "../DomainError";
import { ValidationHandler } from "../ValidationHandler";

export class Notification implements ValidationHandler {
    private errors: DomainError[] = [];

    private constructor(errors: DomainError[]) {
        this.errors = errors;
    }

    static create(errors: DomainError[] = []): Notification {
        return new Notification(errors);
    }

    appendDomainError(error: DomainError): Notification {
        this.errors.push(error);
        return this;
    }

    validate<T>(validator: { validate(handler: ValidationHandler): void }): T {
        try {
            return validator.validate(this) as T;
        } catch (e) {
            if (e instanceof DomainException) {
                this.errors.push(...e.getErrors());
            } else {
                this.appendDomainError(
                    new DomainError("Unknown validation error"),
                );
            }

            return null as T;
        }
    }

    getErrors(): DomainError[] {
        return this.errors;
    }

    hasError(): boolean {
        return this.errors.length > 0;
    }
}
