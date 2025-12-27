import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PaymentRepository } from "../../repository/PaymentRepository";
import { PaymentTypeOrmEntity } from "../PaymentEntity";

@Injectable()
export class PaymentTypeOrmRepository
    extends Repository<PaymentTypeOrmEntity>
    implements PaymentRepository
{
    constructor(dataSource: DataSource) {
        super(PaymentTypeOrmEntity, dataSource.createEntityManager());
    }

    async findByOrderId(orderId: string): Promise<PaymentTypeOrmEntity | null> {
        return this.findOne({ where: { orderId } });
    }
}
