import { InstantUtils } from "src/shared/InstantUtils";
import { DefaultApiError } from "../model/DefaultApiError";
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { DomainException } from "src/domain/exception/DomainException";
import { DomainError } from "src/domain/validation/DomainError";
import { Response } from "express";
import { NotFoundException } from "src/domain/exception/NotFoundException";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof NotFoundException) {
            this.logger.error("NotFoundException", exception.stack);

            const body = new DefaultApiError(
                InstantUtils.now(),
                HttpStatus.NOT_FOUND,
                exception.getErrors(),
            );

            response.status(HttpStatus.NOT_FOUND).json(body);
            return;
        }

        if (exception instanceof DomainException) {
            this.logger.error("DomainException", exception.stack);

            const body = new DefaultApiError(
                InstantUtils.now(),
                HttpStatus.UNPROCESSABLE_ENTITY,
                exception.getErrors(),
            );

            response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(body);
            return;
        }

        if (exception instanceof HttpException) {
            this.logger.error("HttpException", exception.stack);

            const request = ctx.getRequest();
            const status = exception.getStatus();
            const responseBody: any = exception.getResponse();

            this.logger.error(
                `HttpException | Status: ${status} | URL: ${request.url} | Message: ${JSON.stringify(responseBody)} | Stack: ${exception.stack}`,
            );

            const errors: DomainError[] = Array.isArray(responseBody?.message)
                ? responseBody.message.map(
                      (msg: string) => new DomainError(msg),
                  )
                : [];

            const body = new DefaultApiError(
                InstantUtils.now(),
                status,
                errors,
            );

            response.status(status).json(body);
            return;
        }

        this.logger.error("Unhandled Exception", (exception as any)?.stack);

        const body = new DefaultApiError(
            InstantUtils.now(),
            HttpStatus.INTERNAL_SERVER_ERROR,
            [],
        );

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
    }
}
