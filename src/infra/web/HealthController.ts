import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Health")
@Controller()
export class HealthController {
    @Get("/health")
    check() {
        return { status: "ok" };
    }

    @Get([
        "/payment/api/actuator/health/readiness",
        "/payment/api/actuator/health/liveness",
    ])
    actuatorHealth() {
        return { status: "ok" };
    }
}
