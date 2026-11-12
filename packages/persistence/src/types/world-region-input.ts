import type { Types } from "mongoose";
import type { WorldRegionType } from "../enums/world-region-type";
import type { WorldRegionStatus } from "../enums/world-region-status";

export type CreateWorldRegion = {
    worldPublicId: string;
    displayName: string;
    regionType: WorldRegionType;
    regionStatus?: WorldRegionStatus;
    activePopulationConfigurationId?: string | Types.ObjectId | null;
    minimumCellX: number;
    minimumCellY: number;
    maximumCellX: number;
    maximumCellY: number;
};
export type UpdateWorldRegion = Partial<Omit<CreateWorldRegion, "worldPublicId">>;
