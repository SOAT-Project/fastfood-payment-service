import { DomainError } from "src/domain/validation/DomainError";

export class DefaultApiError {
    constructor(timestamp: string, status: number, errors: DomainError[]) {}
}
