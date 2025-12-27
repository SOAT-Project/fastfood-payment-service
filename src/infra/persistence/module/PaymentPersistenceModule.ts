import { Module } from "@nestjs/common";
import { PaymentTypeOrmRepository } from "../typeorm/repository/PaymentTypeOrmRepository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentTypeOrmEntity } from "../typeorm/PaymentEntity";
import { PaymentRepositoryGatewayImpl } from "../PaymentRepositoryGatewayImpl";

@Module({
    imports: [TypeOrmModule.forFeature([PaymentTypeOrmEntity])],
    providers: [
        {
            provide: "PaymentRepositoryGateway",
            useClass: PaymentRepositoryGatewayImpl,
        },
        {
            provide: "PaymentTypeOrmRepository",
            useClass: PaymentTypeOrmRepository,
        },
    ],
    exports: ["PaymentTypeOrmRepository", "PaymentRepositoryGateway"],
})
export class PaymentPersistenceModule {}
