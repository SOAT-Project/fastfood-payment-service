import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { PaymentTypeOrmEntity } from "./PaymentEntity";
import { InitPaymentsTable1704475200000 } from "./migrations/1704475200000-InitPaymentsTable";
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    database: process.env.DATABASE_NAME || "postgres",
    entities: [PaymentTypeOrmEntity],
    migrations: [InitPaymentsTable1704475200000],
    synchronize: false,
});
