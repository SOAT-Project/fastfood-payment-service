import { Entity } from "./Entity";
import { Identifier } from "./Identifier";

export abstract class AggregateRoot<ID extends Identifier> extends Entity<ID> {
    protected constructor(
        id: ID,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date,
    ) {
        super(id, createdAt, updatedAt, deletedAt);
    }
}
