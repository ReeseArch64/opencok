import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
import { ConstructionJobStatus } from "../../enums/construction-job-status";
import { City } from "./city";
import { CityBuilding } from "./city-building";
import { CommandReceipt } from "./command-receipt";

@Entity({ name: "construction_jobs" })
@ForeignKey(() => CityBuilding, ["buildingId", "cityId"], ["id", "cityId"], {
    name: "construction_job_building",
    onDelete: "RESTRICT",
})
@ForeignKey(() => City, ["cityId", "characterId"], ["id", "characterId"], {
    name: "construction_job_owner",
    onDelete: "RESTRICT",
})
@ForeignKey(() => CommandReceipt, ["startReceiptId", "characterId"], ["id", "characterId"], {
    name: "construction_job_receipt",
    onDelete: "RESTRICT",
})
@Index("construction_job_receipt_unique", ["startReceiptId"], { unique: true })
@Index("construction_job_pending_building", ["buildingId"], {
    unique: true,
    where: "\"job_status\" = 'pending'",
})
@Index("construction_job_due", ["completesAt"], { where: "\"job_status\" = 'pending'" })
@Check(
    "construction_job_levels",
    "\"from_level\" >= 0 AND \"target_level\"::bigint = \"from_level\"::bigint + 1",
)
@Check("construction_job_configuration", "\"configuration_version\" >= 1")
@Check("construction_job_deadline", "\"completes_at\" >= \"started_at\"")
@Check(
    "construction_job_completion",
    "(\"job_status\" = 'completed' AND \"completed_at\" IS NOT NULL AND \"completed_at\" >= \"completes_at\") OR (\"job_status\" = 'pending' AND \"completed_at\" IS NULL)",
)
export class ConstructionJob extends BaseEntity
{
    @Column({ name: "building_id", type: "integer", update: false })
    buildingId: number;

    @Column({ name: "city_id", type: "integer", update: false })
    cityId: number;

    @Column({ name: "character_id", type: "integer", update: false })
    characterId: number;

    @Column({ name: "start_receipt_id", type: "integer", update: false })
    startReceiptId: number;

    @Column({ name: "configuration_public_id", type: "uuid", update: false })
    configurationPublicId: string;

    @Column({ name: "configuration_version", type: "integer", update: false })
    configurationVersion: number;

    @Column({ name: "from_level", type: "integer", update: false })
    fromLevel: number;

    @Column({ name: "target_level", type: "integer", update: false })
    targetLevel: number;

    @Column({ name: "started_at", type: "timestamptz", update: false })
    startedAt: Date;

    @Column({ name: "completes_at", type: "timestamptz", update: false })
    completesAt: Date;

    @Column({
        name: "job_status",
        type: "enum",
        enum: ConstructionJobStatus,
        enumName: "construction_job_status",
        default: ConstructionJobStatus.Pending,
    })
    jobStatus: ConstructionJobStatus;

    @Column({ name: "completed_at", type: "timestamptz", nullable: true })
    completedAt: Date | null;
}
