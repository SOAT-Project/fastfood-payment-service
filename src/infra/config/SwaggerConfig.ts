import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export class SwaggerConfig {
    static setup(app: INestApplication): void {
        const config = new DocumentBuilder()
            .setTitle("FastFood SOAT - Payment Microservice API")
            .setDescription(
                "API documentation for the Payment Microservice of FastFood SOAT project",
            )
            .setVersion("1.0.0")
            .build();

        const document = SwaggerModule.createDocument(app, config);

        SwaggerModule.setup("api/docs", app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    }
}
