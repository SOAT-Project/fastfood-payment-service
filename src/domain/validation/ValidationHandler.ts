import { DomainError } from "./DomainError";

export interface ValidationHandler {
    appendDomainError(error: DomainError): ValidationHandler;
    validate<T>(factory: () => T): T;
    getErrors(): DomainError[];
    hasError(): boolean;
}
