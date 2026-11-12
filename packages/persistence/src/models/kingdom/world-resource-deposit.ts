import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
import { ResourceType } from "../../enums/resource-type";
import { ResourceDepositStatus } from "../../enums/resource-deposit-status";
import { WorldObject } from "./world-object";

@Entity({ name: "world_resource_deposits" })
@ForeignKey(() => WorldObject, ["worldObjectId"], ["id"], {
    name: "resource_deposit_object",
    onDelete: "RESTRICT",
})
@Index("resource_deposit_object_unique", ["worldObjectId"], { unique: true })
@Index("resource_deposit_type_status", ["resourceType", "depositStatus"])
@Check(
    "resource_deposit_quantities",
    "\"initial_quantity\" BETWEEN 1 AND 9007199254740991 AND \"remaining_quantity\" BETWEEN 0 AND \"initial_quantity\"",
)
@Check(
    "resource_deposit_state",
    "(\"deposit_status\" = 'available' AND \"remaining_quantity\" > 0 AND \"depleted_at\" IS NULL) OR (\"deposit_status\" = 'depleted' AND \"remaining_quantity\" = 0 AND \"depleted_at\" IS NOT NULL)",
)
export class WorldResourceDeposit extends BaseEntity
{
    @Column({ name: "world_object_id", type: "integer" })
    worldObjectId: number;

    @Column({
        name: "resource_type",
        type: "enum",
        enum: ResourceType,
        enumName: "resource_type",
    })
    resourceType: ResourceType;
    @Column({ name: "configuration_public_id", type: "uuid", update: false })
    configurationPublicId: string;
    @Column({ name: "initial_quantity", type: "bigint", update: false })
    initialQuantity: string;

    @Column({ name: "remaining_quantity", type: "bigint" })
    remainingQuantity: string;

    @Column({
        name: "deposit_status",
        type: "enum",
        enum: ResourceDepositStatus,
        enumName: "resource_deposit_status",
        default: ResourceDepositStatus.Available,
    })
    depositStatus: ResourceDepositStatus;

    @Column({ name: "depleted_at", type: "timestamptz", nullable: true })
    depletedAt: Date | null;
}
