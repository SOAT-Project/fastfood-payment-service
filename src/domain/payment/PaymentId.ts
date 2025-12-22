import { Identifier } from "../shared/Identifier";

export class PaymentId extends Identifier {
    private id: number;

    constructor(id: number) {
        super();
        this.id = id;
    }

    public static of(id: number): PaymentId {
        return new PaymentId(id);
    }

    public getValue(): number {
        return this.id;
    }
}
