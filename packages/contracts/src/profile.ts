import type { Row } from "./rows.ts";

export interface PublicAllianceState
{
    alliance: Row;
    leader: Row;
    totals: Row;
    sciences: readonly Row[];
    video: Row | undefined;
    withEffects: boolean;
}

export interface PublicAllianceProfile
{
    profile: Row | undefined;
    alliance: PublicAllianceState | undefined;
}
