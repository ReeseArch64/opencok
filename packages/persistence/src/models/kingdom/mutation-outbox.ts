import "reflect-metadata";
import {
    Check,
    Column,
    CreateDateColumn,
    Entity,
    ForeignKey,
    Generated,
    Index,
    PrimaryColumn,
} from "typeorm";
import { CommandReceipt } from "./command-receipt";

@Entity({ name: "mutation_outbox" })
@ForeignKey(() => CommandReceipt, ["receiptId"], ["id"], {
    name: "mutation_outbox_receipt",
    onDelete: "RESTRICT",
})
@Index("mutation_outbox_due", ["nextAttemptAt"], { where: "\"published_at\" IS NULL" })
@Check("mutation_outbox_counters", "\"event_index\" >= 0 AND \"attempt_count\" >= 0")
@Check("mutation_outbox_event_type", "length(btrim(\"event_type\")) > 0")
@Check(
    "mutation_outbox_publication",
    "\"published_at\" IS NULL OR \"published_at\" >= \"created_at\"",
)
@Check("mutation_outbox_payload_bounds", "octet_length(\"payload\") <= 1048576")
export class MutationOutbox
{
    @PrimaryColumn({ name: "receipt_id", type: "integer", update: false })
    receiptId: number;

    @PrimaryColumn({ name: "event_index", type: "integer", update: false })
    eventIndex: number;

    @Generated("uuid")
    @Column({
        name: "public_id",
        type: "uuid",
        unique: true,
        default: () => "gen_random_uuid()",
        update: false,
    })
    publicId: string;

    @Column({ name: "event_type", type: "varchar", length: 128, update: false })
    eventType: string;

    @Column({ type: "bytea", update: false })
    payload: Buffer;

    @CreateDateColumn({ name: "created_at", type: "timestamptz", update: false })
    createdAt: Date;

    @Column({ name: "published_at", type: "timestamptz", nullable: true })
    publishedAt: Date | null;

    @Column({ name: "attempt_count", type: "integer", default: 0 })
    attemptCount: number;

    @Column({ name: "next_attempt_at", type: "timestamptz", default: () => "now()" })
    nextAttemptAt: Date;
}
