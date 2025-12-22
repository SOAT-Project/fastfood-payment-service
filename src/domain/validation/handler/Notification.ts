import { DomainError } from "../DomainError";
import { ValidationHandler } from "../ValidationHandler";

export class Notification implements ValidationHandler {
    private errors: DomainError[] = [];

    private constructor(errors: DomainError[]) {
        this.errors = errors;
    }

    public static create(errors: DomainError[] = []): Notification {
        return new Notification(errors);
    }

    appendDomainError(error: DomainError): Notification {
        this.errors.push(error);
        return this;
    }

    appendValidationHandler(handler: ValidationHandler): Notification {
        this.errors.push(...handler.getErrors());
        return this;
    }

    getErrors(): DomainError[] {
        return this.errors;
    }

    hasError(): boolean {
        return this.errors.length > 0;
    }
}
