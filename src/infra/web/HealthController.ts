import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Health")
@Controller("health")
export class HealthController {
    @Get()
    check() {
        return { status: "ok" };
    }

    // Compatibilidade com probes externos
    @Get(["/api/actuator/health/readiness", "/api/actuator/health/liveness"])
    actuatorHealth() {
        return { status: "ok" };
    }
}
