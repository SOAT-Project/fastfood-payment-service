import { UUID } from "crypto";
import { ValueObject } from "./ValueObject";

export abstract class PublicIdentifier extends ValueObject {
    abstract getValue(): UUID;
}
