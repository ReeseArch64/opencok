import type { GeneralWorldSnapshot } from "@opencok/hero/contracts/general-world";
import type { PlayerEffectSnapshot } from "./power.ts";
import type { Row } from "./rows.ts";

export interface WorldPointDetailQuery
{
    point: number;
    kingdomId: number;
    now: number;
    cityExtras?: boolean;
    resourceEffects?: boolean;
}

export interface WorldResourceOwnerSnapshot
{
    effects: PlayerEffectSnapshot;
    buildings: readonly Row[];
    newGenerals: GeneralWorldSnapshot;
}

export interface WorldPointOwnerSnapshot
{
    profile?: Row;
    statistics?: Row;
    registration?: Row;
    alliance?: Row;
    member?: Row;
}

export interface WorldPointDetailSnapshot
{
    profile: Row | undefined;
    world?: Row;
    kingdomId: number;
    remote: boolean;
    point?: Row;
    owner?: WorldPointOwnerSnapshot;
    exploration?: { march: Row | undefined; };
    city?: {
        observerStatistics: Row | undefined;
        mixed: Row | undefined;
        effects: PlayerEffectSnapshot;
    };
    barbarian?: { row: Row | undefined; };
    neutralResource?: { march: Row | undefined; };
    special?: WorldSpecialDetailSnapshot;
    resourceGroup?: readonly Row[];
    resource?: { march: Row | undefined; owner?: WorldResourceOwnerSnapshot; };
}

export type WorldExplorationSelector = (point: Row, marches: readonly Row[]) => string | undefined;

export interface WorldPointDetailStore
{
    read(
        observer: string,
        query: WorldPointDetailQuery,
        selectExploration?: WorldExplorationSelector,
        turret?: WorldTurretReader,
    ): Promise<WorldPointDetailSnapshot>;
}

export interface WorldPointOwnerDetail
{
    uid?: string;
    registerTime?: bigint;
    pic?: string;
    power?: bigint;
    killArmy?: bigint;
    afn?: string;
    rank?: number;
    vl?: number;
}

export interface WorldCityDetail
{
    slowDown: boolean;
    targetTooStrong: boolean;
    targetPower: bigint;
    lastBeDuelTime: bigint;
}

export interface WorldSpecialDetailSnapshot
{
    territory?: Row;
    marches: readonly Row[];
    leader?: Row;
    team?: Row;
    ownerProfile?: Row;
    ownerAlliance?: Row;
    ownerEffects?: WorldResourceOwnerSnapshot;
    banner?: string;
    observerBanner?: string;
    resources: readonly { row: Row; profile: Row; }[];
    kills: readonly { uid: string; content: string; profile?: Row; }[];
    boss?: Row;
    ranks: readonly Row[];
}

export type WorldTurretReader = (
    kingdomId: number,
    territory: string,
) => Promise<ReadonlyMap<string, string>>;
