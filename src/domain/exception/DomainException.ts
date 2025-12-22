import { DomainError } from "../validation/DomainError";

export class DomainException extends Error {
    protected errors: DomainError[];

    protected constructor(message: string, errors: DomainError[]) {
        super(message);
        this.errors = errors;
    }

    public getErrors(): DomainError[] {
        return this.errors;
    }

    public static with(errors: DomainError[]): DomainException {
        return new DomainException("", errors);
    }
}
