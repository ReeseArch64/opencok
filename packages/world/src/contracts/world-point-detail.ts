import type { Row } from "./rows.ts";

export interface WorldCityEffects
{
    profile: Row;
    throneRewards: readonly unknown[];
}

export interface WorldResourceOwnerIdentity
{
    effects: { profile: Row; };
}

export interface WorldPointDetailQuery
{
    point: number;
    kingdomId: number;
    now: number;
    cityExtras?: boolean;
    resourceEffects?: boolean;
}

export interface WorldPointOwnerSnapshot
{
    profile?: Row;
    statistics?: Row;
    registration?: Row;
    alliance?: Row;
    member?: Row;
}

export interface WorldPointDetailSnapshot<
    TEffects extends WorldCityEffects = WorldCityEffects,
    TOwner extends WorldResourceOwnerIdentity = WorldResourceOwnerIdentity,
>
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
        effects: TEffects;
    };
    barbarian?: { row: Row | undefined; };
    neutralResource?: { march: Row | undefined; };
    special?: WorldSpecialDetailSnapshot<TOwner>;
    resourceGroup?: readonly Row[];
    resource?: { march: Row | undefined; owner?: TOwner; };
}

export type WorldExplorationSelector = (point: Row, marches: readonly Row[]) => string | undefined;

export interface WorldPointDetailStore<
    TEffects extends WorldCityEffects = WorldCityEffects,
    TOwner extends WorldResourceOwnerIdentity = WorldResourceOwnerIdentity,
>
{
    read(
        observer: string,
        query: WorldPointDetailQuery,
        selectExploration?: WorldExplorationSelector,
        turret?: WorldTurretReader,
    ): Promise<WorldPointDetailSnapshot<TEffects, TOwner>>;
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

export interface WorldSpecialDetailSnapshot<
    TOwner extends WorldResourceOwnerIdentity = WorldResourceOwnerIdentity,
>
{
    territory?: Row;
    marches: readonly Row[];
    leader?: Row;
    team?: Row;
    ownerProfile?: Row;
    ownerAlliance?: Row;
    ownerEffects?: TOwner;
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
