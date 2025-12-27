import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { SwaggerConfig } from "./infra/config/SwaggerConfig";
import { AppModule } from "./infra/module/AppModule";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
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

    SwaggerConfig.setup(app);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
