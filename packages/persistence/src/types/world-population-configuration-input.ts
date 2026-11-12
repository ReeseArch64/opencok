import type { Types } from "mongoose";
export type CreateWorldPopulationConfiguration = {
    worldRegionId: string | Types.ObjectId;
    configurationVersion: number;
    maximumActiveDeposits: number;
    populationCheckIntervalSeconds: number;
    resourceRules: { configurationPublicId: string; targetActiveDeposits: number; }[];
};
