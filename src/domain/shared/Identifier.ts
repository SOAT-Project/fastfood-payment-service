import { ValueObject } from "./ValueObject";

export abstract class Identifier extends ValueObject {
    public abstract getValue(): number;
}
