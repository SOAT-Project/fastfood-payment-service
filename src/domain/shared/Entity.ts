import { ValidationHandler } from "../validation/ValidationHandler";
import { Identifier } from "./Identifier";

export abstract class Entity<ID extends Identifier> {
    protected readonly id: ID;
    protected readonly createdAt: Date;
    protected updatedAt: Date;
    protected deletedAt: Date;

    protected constructor(
        id: ID,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date,
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    public abstract validate(validation: ValidationHandler): void;

    public getId(): ID {
        return this.id;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public getDeletedAt(): Date {
        return this.deletedAt;
    }
}
