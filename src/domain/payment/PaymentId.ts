import { Identifier } from "../shared/Identifier";

export class PaymentId extends Identifier {
    private id: number;

    constructor(id: number) {
        super();
        this.id = id;
    }

    static of(id: number): PaymentId {
        return new PaymentId(id);
    }

    getValue(): number {
        return this.id;
    }
}
