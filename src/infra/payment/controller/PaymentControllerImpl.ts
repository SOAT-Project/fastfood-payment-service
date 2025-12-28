import { Inject, Injectable } from "@nestjs/common";
import { PaymentController } from "./PaymentController";
import { UpdatePaymentStatusUseCase } from "src/application/payment/usecases/update/UpdatePaymentStatusUseCase";
import { GetPaymentStatusByOrderIdUseCase } from "src/application/payment/usecases/retrieve/GetPaymentStatusByOrderIdUseCase";
import { GetPaymentStatusByOrderIdCommand } from "src/application/payment/command/retrieve/GetPaymentStatusByOrderIdCommand";
import { GetPaymentStatusByOrderIdResponse } from "../model/response/GetPaymentStatusByOrderIdResponse";
import { UpdatePaymentStatusCommand } from "src/application/payment/command/update/UpdatePaymentStatusCommand";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { SetPaymentStatusToPaidResponse } from "../model/response/SetPaymentStatusToPaidResponse";
import { GetPaymentQrCodeByOrderIdUseCase } from "src/application/payment/usecases/retrieve/GetPaymentQrCodeByOrderIdUseCase";
import { GetPaymentQrCodeByOrderIdCommand } from "src/application/payment/command/retrieve/GetPaymentQrCodeByOrderIdCommand";

@Injectable()
export class PaymentControllerImpl implements PaymentController {
    constructor(
        @Inject("UpdatePaymentStatusUseCase")
        private readonly updatePaymentStatusUseCase: UpdatePaymentStatusUseCase,
        @Inject("GetPaymentStatusByOrderIdUseCase")
        private readonly getPaymentStatusByOrderIdUseCase: GetPaymentStatusByOrderIdUseCase,
        @Inject("GetPaymentQrCodeByOrderIdUseCase")
        private readonly getPaymentQrCodeByOrderIdUseCase: GetPaymentQrCodeByOrderIdUseCase,
    ) {}

    async getQrCodeByOrderId(
        orderId: string,
    ): Promise<Buffer<ArrayBufferLike>> {
        const command: GetPaymentQrCodeByOrderIdCommand =
            new GetPaymentQrCodeByOrderIdCommand(orderId);

        const output =
            await this.getPaymentQrCodeByOrderIdUseCase.execute(command);

        return output.qrCodeBuffer;
    }

    async getStatusByOrderId(
        orderId: string,
    ): Promise<GetPaymentStatusByOrderIdResponse> {
        const command: GetPaymentStatusByOrderIdCommand =
            new GetPaymentStatusByOrderIdCommand(orderId);

        const output =
            await this.getPaymentStatusByOrderIdUseCase.execute(command);

        return new GetPaymentStatusByOrderIdResponse(output.paymentStatus);
    }

    async setStatusToPaid(
        orderId: string,
    ): Promise<SetPaymentStatusToPaidResponse> {
        const command: UpdatePaymentStatusCommand =
            new UpdatePaymentStatusCommand(orderId, PaymentStatus.APPROVED);

        const output = await this.updatePaymentStatusUseCase.execute(command);

        return new SetPaymentStatusToPaidResponse(
            output.externalReference,
            output.orderId,
            output.newPaymentStatus,
            output.updatedAt,
        );
    }
}
