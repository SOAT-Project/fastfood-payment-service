import { ValidationHandler } from "./ValidationHandler";

export abstract class Validator {
    private handler: ValidationHandler;

    protected constructor(handler: ValidationHandler) {
        this.handler = handler;
    }

    public abstract validate(): void;

    protected validateHandler(): ValidationHandler {
        return this.handler;
    }
}
