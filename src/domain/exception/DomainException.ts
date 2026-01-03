import { DomainError } from "../validation/DomainError";

export class DomainException extends Error {
    protected errors: DomainError[];

    protected constructor(message: string, errors: DomainError[]) {
        super(message);
        this.errors = errors;
    }

    getErrors(): DomainError[] {
        return this.errors;
    }
}
