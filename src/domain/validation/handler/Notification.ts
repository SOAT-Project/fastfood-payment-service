import { DomainException } from "src/domain/exception/DomainException";
import { DomainError } from "../DomainError";
import { ValidationHandler } from "../ValidationHandler";
import { NotificationException } from "src/domain/exception/NotificationException";

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

    validate<T>(factory: () => T): T {
        try {
            return factory();
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
