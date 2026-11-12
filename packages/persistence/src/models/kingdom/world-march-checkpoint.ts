import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
import { WorldMarch } from "./world-march";
import { CommandReceipt } from "./command-receipt";
import { MarchCheckpointStatus } from "../../enums/march-checkpoint-status";
import { WorldMarchStatus } from "../../enums/world-march-status";

@Entity({ name: "world_march_checkpoints" })
@ForeignKey(() => WorldMarch, ["marchId", "characterId"], ["id", "characterId"], {
    name: "world_march_checkpoint_march",
    onDelete: "RESTRICT",
})
@ForeignKey(() => CommandReceipt, ["receiptId", "characterId"], ["id", "characterId"], {
    name: "world_march_checkpoint_receipt",
    onDelete: "RESTRICT",
})
@Index("world_march_checkpoint_version_unique", ["marchId", "marchVersion"], { unique: true })
@Index("world_march_checkpoint_pending_unique", ["marchId"], {
    unique: true,
    where: "checkpoint_status = 'pending'",
})
@Index("world_march_checkpoint_due", ["dueAt"], { where: "checkpoint_status = 'pending'" })
@Check("world_march_checkpoint_version", `march_version >= 1`)
@Check(
    "world_march_checkpoint_state",
    `(checkpoint_status = 'pending' AND processed_at IS NULL AND receipt_id IS NULL) OR (checkpoint_status = 'completed' AND processed_at IS NOT NULL AND processed_at >= due_at AND receipt_id IS NOT NULL)`,
)
export class WorldMarchCheckpoint extends BaseEntity
{
    @Column({ name: "march_id", type: "integer", update: false })
    marchId: number;

    @Column({ name: "character_id", type: "integer", update: false })
    characterId: number;

    @Column({ name: "march_version", type: "bigint", update: false })
    marchVersion: string;

    @Column({
        name: "march_status",
        type: "enum",
        enum: WorldMarchStatus,
        enumName: "world_march_status",
        update: false,
    })
    marchStatus: WorldMarchStatus;

    @Column({ name: "due_at", type: "timestamptz", update: false })
    dueAt: Date;

    @Column({
        name: "checkpoint_status",
        type: "enum",
        enum: MarchCheckpointStatus,
        enumName: "march_checkpoint_status",
        default: MarchCheckpointStatus.Pending,
    })
    checkpointStatus: MarchCheckpointStatus;

    @Column({ name: "processed_at", type: "timestamptz", nullable: true })
    processedAt: Date | null;

    @Column({ name: "receipt_id", type: "integer", nullable: true })
    receiptId: number | null;
}
