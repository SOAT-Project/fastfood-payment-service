import { NestFactory } from "@nestjs/core";
import {
    addTransactionalDataSource,
    initializeTransactionalContext,
} from "typeorm-transactional";
import { ValidationPipe } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { SwaggerConfig } from "./infra/config/SwaggerConfig";
import { GlobalExceptionFilter } from "./infra/web/filters/GlobalExceptionFilter";
import { AppModule } from "./AppModule";
import helmet from "helmet";
import { DataSource } from "typeorm";

async function bootstrap() {
    initializeTransactionalContext();
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    addTransactionalDataSource(dataSource);

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    );
    app.use(helmet.hidePoweredBy());
    app.use(
        helmet.hsts({
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        }),
    );
    app.use(helmet.noSniff());

    if (process.env.NODE_ENV === "develop") {
        SwaggerConfig.setup(app);
    }

    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.listen(process.env.APPLICATION_PORT ?? 8080);
}
bootstrap();
