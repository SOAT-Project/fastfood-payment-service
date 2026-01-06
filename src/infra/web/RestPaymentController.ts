import {
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { type PaymentController } from "../payment/controller/PaymentController";
import { PaymentAPI } from "./rest/api/PaymentAPI";
import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Query,
    Res,
} from "@nestjs/common";
import type { Response } from "express";
import { GetPaymentStatusByOrderIdResponse } from "../payment/model/response/GetPaymentStatusByOrderIdResponse";
import { SetPaymentStatusToPaidResponse } from "../payment/model/response/SetPaymentStatusToPaidResponse";

@ApiTags("Payments")
@Controller("payments")
export class RestPaymentController implements PaymentAPI {
    constructor(
        @Inject("PaymentController")
        private readonly paymentController: PaymentController,
    ) {}

    @Get([
        "/health",
        "/api/actuator/health/readiness",
        "/api/actuator/health/liveness",
    ])
    actuatorHealth() {
        return { status: "ok" };
    }

    @Post("set-to-paid")
    @ApiOperation({ summary: "Set Payment Status to Paid by Order ID" })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                order_id: {
                    type: "string",
                    description: "The ID of the order",
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: "Payment status set to paid successfully",
    })
    @ApiResponse({
        status: 404,
        description: "Payment not found for the given Order ID",
    })
    @ApiResponse({
        status: 500,
        description: "Internal server error",
    })
    setStatusToPaid(
        @Body("order_id") orderId: string,
    ): Promise<SetPaymentStatusToPaidResponse> {
        return this.paymentController.setStatusToPaid(orderId);
    }

    @Get("qrcode")
    @ApiOperation({ summary: "Get QR Code by Order ID" })
    @ApiQuery({
        name: "orderId",
        required: true,
        type: String,
        description: "The ID of the order",
    })
    @ApiResponse({
        status: 200,
        description: "QR Code retrieved successfully",
        type: String,
    })
    @ApiResponse({
        status: 404,
        description: "Payment not found for the given Order ID",
    })
    @ApiResponse({
        status: 500,
        description: "Internal server error",
    })
    async getQrCodeByOrderId(
        @Query("orderId") orderId: string,
        @Res() res: Response,
    ): Promise<void> {
        const qrcode = await this.paymentController.getQrCodeByOrderId(orderId);
        res.setHeader("Content-Type", "image/png");
        res.send(qrcode);
    }

    @Get("status")
    @ApiOperation({ summary: "Get Payment Status by Order ID" })
    @ApiQuery({
        name: "orderId",
        required: true,
        type: String,
        description: "The ID of the order",
    })
    @ApiResponse({
        status: 200,
        description: "Payment status retrieved successfully",
        type: String,
    })
    @ApiResponse({
        status: 404,
        description: "Payment not found for the given Order ID",
    })
    @ApiResponse({
        status: 500,
        description: "Internal server error",
    })
    getStatusByOrderId(
        @Query("orderId") orderId: string,
    ): Promise<GetPaymentStatusByOrderIdResponse> {
        return this.paymentController.getStatusByOrderId(orderId);
    }
}
