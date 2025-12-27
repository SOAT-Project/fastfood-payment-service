import { Module } from "@nestjs/common";
import { PaymentTypeOrmRepository } from "../typeorm/repository/PaymentTypeOrmRepository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentTypeOrmEntity } from "../typeorm/PaymentEntity";

@Module({
    imports: [TypeOrmModule.forFeature([PaymentTypeOrmEntity])],
    providers: [
        {
            provide: "PaymentTypeOrmRepository",
            useClass: PaymentTypeOrmRepository,
        },
    ],
    exports: ["PaymentTypeOrmRepository"],
})
export class PaymentPersistenceModule {}
