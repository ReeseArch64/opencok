import { Schema } from "mongoose";
import { mongoDocumentFields } from "../../base/mongo-document-fields";
import { ResourceSpawnJobStatus } from "../../enums/resource-spawn-job-status";
import { integerValidator } from "../../validators/integer";

export const worldResourceSpawnJobSchema = new Schema(
    {
        ...mongoDocumentFields,
        worldRegionId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "WorldRegion",
        },
        sourceDepositPublicId: { type: Schema.Types.UUID, default: null },
        configurationPublicId: { type: Schema.Types.UUID, required: true },
        eligibleAt: { type: Date, required: true },
        jobStatus: {
            type: String,
            required: true,
            enum: Object.values(ResourceSpawnJobStatus),
            default: ResourceSpawnJobStatus.Pending,
        },
        attemptCount: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 2147483647,
            validate: integerValidator,
        },
        claimedAt: { type: Date, default: null },
        claimExpiresAt: { type: Date, default: null },
        completedAt: { type: Date, default: null },
        spawnedWorldObjectPublicId: { type: Schema.Types.UUID, default: null },
        lastError: { type: String, maxlength: 2000, default: null },
    },
    {
        collection: "world_resource_spawn_jobs",
        strict: "throw",
        timestamps: true,
        bufferCommands: false,
        autoCreate: false,
        autoIndex: false,
    },
);
worldResourceSpawnJobSchema.index(
    { publicId: 1 },
    { unique: true, name: "resource_spawn_job_public_id" },
);
worldResourceSpawnJobSchema.index(
    { jobStatus: 1, eligibleAt: 1 },
    {
        name: "resource_spawn_job_due",
        partialFilterExpression: { deletedAt: null, archivedAt: null },
    },
);
worldResourceSpawnJobSchema.index(
    { sourceDepositPublicId: 1 },
    {
        unique: true,
        name: "resource_spawn_job_active_source",
        partialFilterExpression: {
            sourceDepositPublicId: { $type: "binData" },
            jobStatus: {
                $in: [
                    ResourceSpawnJobStatus.Pending,
                    ResourceSpawnJobStatus.Processing,
                ],
            },
            deletedAt: null,
            archivedAt: null,
        },
    },
);
worldResourceSpawnJobSchema.index(
    { spawnedWorldObjectPublicId: 1 },
    {
        unique: true,
        name: "resource_spawn_job_result_unique",
        partialFilterExpression: {
            spawnedWorldObjectPublicId: { $type: "binData" },
        },
    },
);
worldResourceSpawnJobSchema.pre("validate", function()
{
    const processing = this.jobStatus === ResourceSpawnJobStatus.Processing;
    if (
        processing
            ? !this.claimedAt
                || !this.claimExpiresAt
                || !this.eligibleAt
                || this.claimExpiresAt <= this.claimedAt
                || this.claimedAt < this.eligibleAt
                || this.attemptCount < 1
            : this.claimExpiresAt != null
    )
    {
        this.invalidate("claimExpiresAt", "Reserva de trabalho inválida");
    }
    const completed = this.jobStatus === ResourceSpawnJobStatus.Completed;
    if (
        completed
            ? !this.completedAt
                || !this.eligibleAt
                || this.completedAt < this.eligibleAt
                || this.spawnedWorldObjectPublicId == null
                || this.attemptCount < 1
            : this.completedAt != null
                || this.spawnedWorldObjectPublicId != null
    )
    {
        this.invalidate("completedAt", "Conclusão de trabalho inválida");
    }
    if (
        this.jobStatus === ResourceSpawnJobStatus.Failed
        && (!this.lastError?.trim() || this.attemptCount < 1)
    )
    {
        this.invalidate(
            "lastError",
            "Falha exige tentativa e descrição do erro",
        );
    }
});
