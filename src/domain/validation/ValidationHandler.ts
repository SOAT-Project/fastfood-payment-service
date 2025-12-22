import { DomainError } from "./DomainError";

export interface ValidationHandler {
    appendDomainError(error: DomainError): ValidationHandler;
    appendValidationHandler(handler: ValidationHandler): ValidationHandler;

    getErrors(): DomainError[];
    hasError(): boolean;
}
