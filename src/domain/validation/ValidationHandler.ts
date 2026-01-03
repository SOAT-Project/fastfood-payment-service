import { DomainError } from "./DomainError";

export interface ValidationHandler {
    appendDomainError(error: DomainError): ValidationHandler;
    validate<T>(validator: { validate(handler: ValidationHandler): void }): T;
    getErrors(): DomainError[];
    hasError(): boolean;
}
