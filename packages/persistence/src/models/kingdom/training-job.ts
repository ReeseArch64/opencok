import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
import { BuildingType } from "../../enums/building-type";
import { TroopType } from "../../enums/troop-type";
import { TrainingJobStatus } from "../../enums/training-job-status";
import { City } from "./city";
import { CityBuilding } from "./city-building";
import { CharacterTroops } from "./character-troops";
import { CommandReceipt } from "./command-receipt";

@Entity({ name: "training_jobs" })
@ForeignKey(
    () => CityBuilding,
    ["buildingId", "cityId", "buildingType"],
    ["id", "cityId", "buildingType"],
    {
        name: "training_job_building",
        onDelete: "RESTRICT",
    },
)
@ForeignKey(() => City, ["cityId", "characterId"], ["id", "characterId"], {
    name: "training_job_owner",
    onDelete: "RESTRICT",
})
@ForeignKey(
    () => CharacterTroops,
    ["characterTroopsId", "characterId", "troopType", "tier"],
    ["id", "characterId", "troopType", "tier"],
    {
        name: "training_job_troops",
        onDelete: "RESTRICT",
    },
)
@ForeignKey(() => CommandReceipt, ["startReceiptId", "characterId"], ["id", "characterId"], {
    name: "training_job_start_receipt",
    onDelete: "RESTRICT",
})
@ForeignKey(() => CommandReceipt, ["completionReceiptId", "characterId"], ["id", "characterId"], {
    name: "training_job_completion_receipt",
    onDelete: "RESTRICT",
})
@Index("training_job_start_unique", ["startReceiptId"], { unique: true })
@Index("training_job_completion_unique", ["completionReceiptId"], { unique: true })
@Index("training_job_pending_building", ["buildingId"], {
    unique: true,
    where: "job_status = 'pending'",
})
@Index("training_job_due", ["completesAt"], { where: "job_status = 'pending'" })
@Index("training_job_owner_status", ["characterId", "jobStatus"])
@Check("training_job_tier", `tier BETWEEN 1 AND 10`)
@Check(
    "training_job_quantities",
    `quantity > 0 AND max_batch_size >= 1 AND quantity <= max_batch_size`,
)
@Check(
    "training_job_configuration",
    `configuration_version >= 1 AND required_building_level >= 1 AND training_seconds_per_unit >= 1`,
)
@Check(
    "training_job_building_type",
    `(building_type::text = 'barracks' AND troop_type = 'infantry') OR (building_type::text = 'stable' AND troop_type = 'cavalry') OR (building_type::text = 'archery_range' AND troop_type = 'archer') OR (building_type::text = 'siege_workshop' AND troop_type = 'siege')`,
)
@Check(
    "training_job_duration",
    `completes_at >= started_at AND EXTRACT(EPOCH FROM (completes_at - started_at)) = quantity::numeric * training_seconds_per_unit::numeric`,
)
@Check(
    "training_job_completion",
    `(job_status = 'pending' AND completed_at IS NULL AND completion_receipt_id IS NULL) OR (job_status = 'completed' AND completed_at IS NOT NULL AND completed_at >= completes_at AND completion_receipt_id IS NOT NULL AND completion_receipt_id <> start_receipt_id)`,
)
export class TrainingJob extends BaseEntity
{
    @Column({ name: "building_id", type: "integer", update: false })
    buildingId: number;

    @Column({ name: "city_id", type: "integer", update: false })
    cityId: number;

    @Column({ name: "character_id", type: "integer", update: false })
    characterId: number;

    @Column({
        name: "building_type",
        type: "enum",
        enum: BuildingType,
        enumName: "building_type",
        update: false,
    })
    buildingType: BuildingType;

    @Column({ name: "character_troops_id", type: "integer", update: false })
    characterTroopsId: number;

    @Column({
        name: "troop_type",
        type: "enum",
        enum: TroopType,
        enumName: "troop_type",
        update: false,
    })
    troopType: TroopType;

    @Column({ type: "smallint", update: false })
    tier: number;

    @Column({ type: "bigint", update: false })
    quantity: string;

    @Column({ name: "start_receipt_id", type: "integer", update: false })
    startReceiptId: number;

    @Column({ name: "completion_receipt_id", type: "integer", nullable: true })
    completionReceiptId: number | null;

    @Column({ name: "configuration_public_id", type: "uuid", update: false })
    configurationPublicId: string;

    @Column({ name: "configuration_version", type: "integer", update: false })
    configurationVersion: number;

    @Column({ name: "required_building_level", type: "integer", update: false })
    requiredBuildingLevel: number;

    @Column({ name: "max_batch_size", type: "integer", update: false })
    maxBatchSize: number;

    @Column({ name: "training_seconds_per_unit", type: "integer", update: false })
    trainingSecondsPerUnit: number;

    @Column({ name: "started_at", type: "timestamptz", update: false })
    startedAt: Date;

    @Column({ name: "completes_at", type: "timestamptz", update: false })
    completesAt: Date;

    @Column({
        name: "job_status",
        type: "enum",
        enum: TrainingJobStatus,
        enumName: "training_job_status",
        default: TrainingJobStatus.Pending,
    })
    jobStatus: TrainingJobStatus;

    @Column({ name: "completed_at", type: "timestamptz", nullable: true })
    completedAt: Date | null;
}
