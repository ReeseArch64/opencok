import type { Types } from "mongoose";
import type { ResourceSpawnJobStatus } from "../enums/resource-spawn-job-status";

export type CreateWorldResourceSpawnJob = {
    worldRegionId: string | Types.ObjectId;
    sourceDepositPublicId?: string | null;
    configurationPublicId: string;
    eligibleAt: Date;
    jobStatus?: ResourceSpawnJobStatus;
    attemptCount?: number;
    claimedAt?: Date | null;
    claimExpiresAt?: Date | null;
    completedAt?: Date | null;
    spawnedWorldObjectPublicId?: string | null;
    lastError?: string | null;
};
export type UpdateWorldResourceSpawnJob = Partial<CreateWorldResourceSpawnJob>;
