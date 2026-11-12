import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
import { WorldMarch } from "./world-march";
import { WorldResourceDeposit } from "./world-resource-deposit";
import { ResourceType } from "../../enums/resource-type";
import { GatheringJobStatus } from "../../enums/gathering-job-status";

@Entity({ name: "gathering_jobs" })
@ForeignKey(() => WorldMarch, ["marchId", "characterId"], ["id", "characterId"], {
    name: "gathering_job_owner",
    onDelete: "RESTRICT",
})
@ForeignKey(() => WorldMarch, ["marchId", "depositId"], ["id", "depositId"], {
    name: "gathering_job_march_deposit",
    onDelete: "RESTRICT",
})
@ForeignKey(() => WorldResourceDeposit, ["depositId", "resourceType"], ["id", "resourceType"], {
    name: "gathering_job_deposit_resource",
    onDelete: "RESTRICT",
})
@Index("gathering_job_march_unique", ["marchId"], { unique: true })
@Index("gathering_job_active_deposit_unique", ["depositId"], {
    unique: true,
    where: "job_status = 'gathering'",
})
@Index("gathering_job_due", ["completesAt"], { where: "job_status = 'gathering'" })
@Check(
    "gathering_job_quantities",
    `per_hour > 0 AND capacity > 0 AND collected_quantity >= 0 AND collected_quantity <= capacity AND remainder >= 0 AND remainder < 3600000`,
)
@Check("gathering_job_deadlines", `settled_at >= started_at AND completes_at >= settled_at`)
@Check(
    "gathering_job_state",
    `(job_status = 'gathering' AND completed_at IS NULL) OR (job_status = 'completed' AND completed_at IS NOT NULL AND completed_at >= settled_at)`,
)
export class GatheringJob extends BaseEntity
{
    @Column({ name: "march_id", type: "integer", update: false })
    marchId: number;

    @Column({ name: "character_id", type: "integer", update: false })
    characterId: number;

    @Column({ name: "deposit_id", type: "integer", update: false })
    depositId: number;

    @Column({
        name: "resource_type",
        type: "enum",
        enum: ResourceType,
        enumName: "resource_type",
        update: false,
    })
    resourceType: ResourceType;

    @Column({ name: "per_hour", type: "bigint", update: false })
    perHour: string;

    @Column({ name: "capacity", type: "bigint", update: false })
    capacity: string;

    @Column({ name: "collected_quantity", type: "bigint", default: "0" })
    collectedQuantity: string;

    @Column({ name: "remainder", type: "bigint", default: "0" })
    remainder: string;

    @Column({ name: "started_at", type: "timestamptz", update: false })
    startedAt: Date;

    @Column({ name: "settled_at", type: "timestamptz" })
    settledAt: Date;

    @Column({ name: "completes_at", type: "timestamptz", update: false })
    completesAt: Date;

    @Column({
        name: "job_status",
        type: "enum",
        enum: GatheringJobStatus,
        enumName: "gathering_job_status",
        default: GatheringJobStatus.Gathering,
    })
    jobStatus: GatheringJobStatus;

    @Column({ name: "completed_at", type: "timestamptz", nullable: true })
    completedAt: Date | null;
}
