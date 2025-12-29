import { Payment } from "src/domain/payment/Payment";
import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import { PaymentRepository } from "src/infra/persistence/repository/PaymentRepository";

describe("PaymentRepository Integration", () => {
    // let repository: PaymentRepository;
    // beforeAll(() => {
    //     repository = new PaymentRepository(); // configure with test db if needed
    // });
    // it("should save and retrieve a payment", async () => {
    //     const payment = new Payment(
    //         "payment-1",
    //         "order-123",
    //         100,
    //         PaymentStatus.PENDING,
    //     );
    //     await repository.save(payment);
    //     const found = await repository.findByOrderId("order-123");
    //     expect(found).toBeDefined();
    //     expect(found?.id).toBe("payment-1");
    //     expect(found?.status).toBe(PaymentStatus.PENDING);
    // });
    // it("should update payment status", async () => {
    //     const payment = await repository.findByOrderId("order-123");
    //     await repository.updateStatus(payment!, PaymentStatus.PAID);
    //     const updated = await repository.findByOrderId("order-123");
    //     expect(updated?.status).toBe(PaymentStatus.PAID);
    // });
});
