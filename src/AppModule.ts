import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WinstonModule } from "nest-winston";
import { transports, format } from "winston";
import { PaymentModule } from "./infra/payment/PaymentModule";
import { QueueModule } from "./infra/queue/QueueModule";
import { addTransactionalDataSource } from "typeorm-transactional";
import { DataSource } from "typeorm";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: "postgres",
                host:
                    configService.get<string>("DATABASE_HOST") ||
                    "database-1.c9wcvz6wenbw.sa-east-1.rds.amazonaws.com",
                port: configService.get<number>("DATABASE_PORT") || 5432,
                username:
                    configService.get<string>("DATABASE_USERNAME") ||
                    "postgres",
                password:
                    configService.get<string>("DATABASE_PASSWORD") ||
                    "P@ssw0rd",
                database:
                    configService.get<string>("DATABASE_NAME") || "postgres",
                entities: [__dirname + "/../**/typeorm/*.{ts,js}"],
                synchronize: false,
            }),
            inject: [ConfigService],
        }),
        WinstonModule.forRoot({
            transports: [
                new transports.Console({
                    level: "info",
                    format: format.combine(
                        format((info) => {
                            info.level = info.level.toUpperCase();
                            return info;
                        })(),
                        format.json(),
                        format.colorize({ all: true }),
                        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                        format.printf(
                            ({ timestamp, level, message }) =>
                                `[${timestamp}] ${level}: ${message}`,
                        ),
                    ),
                }),
            ],
        }),
        QueueModule,
        PaymentModule,
    ],
})
export class AppModule {}
