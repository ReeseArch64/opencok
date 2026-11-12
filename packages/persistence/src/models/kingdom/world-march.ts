import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
import { City } from "./city";
import { CommandReceipt } from "./command-receipt";
import { WorldResourceDeposit } from "./world-resource-deposit";
import { WorldMarchStatus } from "../../enums/world-march-status";

@Entity({ name: "world_marches" })
@ForeignKey(() => City, ["cityId", "characterId"], ["id", "characterId"], {
    name: "world_march_owner",
    onDelete: "RESTRICT",
})
@ForeignKey(() => CommandReceipt, ["startReceiptId", "characterId"], ["id", "characterId"], {
    name: "world_march_receipt",
    onDelete: "RESTRICT",
})
@ForeignKey(() => CommandReceipt, ["completionReceiptId", "characterId"], ["id", "characterId"], {
    name: "world_march_completion_receipt",
    onDelete: "RESTRICT",
})
@ForeignKey(() => WorldResourceDeposit, ["depositId"], ["id"], {
    name: "world_march_deposit",
    onDelete: "RESTRICT",
})
@Index("world_march_start_unique", ["startReceiptId"], { unique: true })
@Index("world_march_completion_unique", ["completionReceiptId"], { unique: true })
@Index("world_march_id_owner_unique", ["id", "characterId"], { unique: true })
@Index("world_march_id_deposit_unique", ["id", "depositId"], { unique: true })
@Index("world_march_owner_status", ["characterId", "marchStatus"])
@Index("world_march_due", ["dueAt"], { where: "march_status <> 'completed'" })
@Check(
    "world_march_coordinates",
    `origin_x BETWEEN 1 AND 1200 AND origin_y BETWEEN 1 AND 1200 AND target_x BETWEEN 1 AND 1200 AND target_y BETWEEN 1 AND 1200`,
)
@Check(
    "world_march_configuration",
    `configuration_version >= 1 AND state_version >= 1 AND carry_capacity > 0`,
)
@Check("world_march_deadlines", `arrives_at >= started_at AND due_at >= started_at`)
@Check(
    "world_march_return",
    `(return_started_at IS NULL AND returns_at IS NULL) OR (return_started_at IS NOT NULL AND returns_at IS NOT NULL AND return_started_at >= started_at AND returns_at >= return_started_at)`,
)
@Check(
    "world_march_state",
    `(march_status = 'outbound' AND due_at = arrives_at AND return_started_at IS NULL AND completed_at IS NULL AND completion_receipt_id IS NULL) OR (march_status = 'gathering' AND due_at >= arrives_at AND return_started_at IS NULL AND completed_at IS NULL AND completion_receipt_id IS NULL) OR (march_status = 'returning' AND return_started_at IS NOT NULL AND due_at = returns_at AND completed_at IS NULL AND completion_receipt_id IS NULL) OR (march_status = 'completed' AND returns_at IS NOT NULL AND due_at = returns_at AND completed_at IS NOT NULL AND completed_at >= returns_at AND completion_receipt_id IS NOT NULL)`,
)
export class WorldMarch extends BaseEntity
{
    @Column({ name: "city_id", type: "integer", update: false })
    cityId: number;

    @Column({ name: "character_id", type: "integer", update: false })
    characterId: number;

    @Column({ name: "start_receipt_id", type: "integer", update: false })
    startReceiptId: number;

    @Column({ name: "completion_receipt_id", type: "integer", nullable: true })
    completionReceiptId: number | null;

    @Column({ name: "deposit_id", type: "integer", update: false })
    depositId: number;

    @Column({ name: "configuration_public_id", type: "uuid", update: false })
    configurationPublicId: string;

    @Column({ name: "configuration_version", type: "integer", update: false })
    configurationVersion: number;

    @Column({ name: "origin_x", type: "integer", update: false })
    originX: number;

    @Column({ name: "origin_y", type: "integer", update: false })
    originY: number;

    @Column({ name: "target_x", type: "integer", update: false })
    targetX: number;

    @Column({ name: "target_y", type: "integer", update: false })
    targetY: number;

    @Column({ name: "carry_capacity", type: "bigint", update: false })
    carryCapacity: string;

    @Column({ name: "started_at", type: "timestamptz", update: false })
    startedAt: Date;

    @Column({ name: "arrives_at", type: "timestamptz", update: false })
    arrivesAt: Date;

    @Column({ name: "return_started_at", type: "timestamptz", nullable: true })
    returnStartedAt: Date | null;

    @Column({ name: "returns_at", type: "timestamptz", nullable: true })
    returnsAt: Date | null;

    @Column({ name: "due_at", type: "timestamptz" })
    dueAt: Date;

    @Column({
        name: "march_status",
        type: "enum",
        enum: WorldMarchStatus,
        enumName: "world_march_status",
        default: WorldMarchStatus.Outbound,
    })
    marchStatus: WorldMarchStatus;

    @Column({ name: "completed_at", type: "timestamptz", nullable: true })
    completedAt: Date | null;

    @Column({ name: "state_version", type: "bigint", default: "1" })
    stateVersion: string;
}
