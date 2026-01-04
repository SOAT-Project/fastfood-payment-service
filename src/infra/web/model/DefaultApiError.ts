import { DomainError } from "src/domain/validation/DomainError";

export class DefaultApiError {
    constructor(
        public timestamp: string,
        public status: number,
        public errors: DomainError[],
    ) {}
}
