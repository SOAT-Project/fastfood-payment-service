import { ValueObject } from "./ValueObject";

export abstract class Identifier extends ValueObject {
    abstract getValue(): number;
}
