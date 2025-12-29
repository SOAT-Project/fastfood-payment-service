import { PaymentStatus } from "src/domain/payment/PaymentStatus";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("payments")
export class PaymentTypeOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("decimal", { precision: 10, scale: 2, nullable: true })
    value: number;

    @Column({ name: "external_reference", nullable: false })
    externalReference: string;

    @Column({ name: "qr_code", nullable: true })
    qrCode: string;

    @Column({ type: "varchar", nullable: false })
    status: PaymentStatus;

    @Column({ type: "uuid", name: "customer_id", nullable: false })
    customerId: string;

    @Column({ type: "uuid", name: "order_id", nullable: false })
    orderId: string;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: "updated_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    })
    updatedAt: Date;

    @Column({
        name: "deleted_at",
        type: "timestamp",
        nullable: true,
    })
    deletedAt?: Date;
}
