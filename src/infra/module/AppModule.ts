import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WinstonModule } from "nest-winston";
import { transports, format } from "winston";
import { PaymentModule } from "../payment/module/PaymentModule";

@Module({
    imports: [
        PaymentModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DATABASE_HOST || "localhost",
            port: Number(process.env.DATABASE_PORT) || 5432,
            username: process.env.DATABASE_USERNAME || "postgres",
            password: String(process.env.DATABASE_PASSWORD ?? "P@ssw0rd"),
            database: process.env.DATABASE_NAME || "postgres",
            entities: [__dirname + "/../**/typeorm/*.{ts,js}"],
            synchronize: false,
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
    ],
})
export class AppModule {}
