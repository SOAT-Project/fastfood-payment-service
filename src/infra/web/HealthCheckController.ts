import { ApiTags } from "@nestjs/swagger";
import { Controller, Get } from "@nestjs/common";

@ApiTags("HealthCheck")
@Controller("/health")
export class HealthCheckController {
    @Get(["", "/liveness", "/readiness"])
    actuatorHealth() {
        return { status: "ok" };
    }
}
