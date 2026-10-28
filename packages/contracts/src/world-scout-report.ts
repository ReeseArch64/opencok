import type { Row } from "./rows";
import type { WorldResourceOwnerSnapshot } from "./world-resource-owner";

export interface ScoutParticipant
{
    profile: Row;
    world: Row;
    resources: Row;
    buildings: readonly Row[];
    armies: readonly Row[];
    forts: readonly Row[];
    sciences: readonly Row[];
    generals: readonly Row[];
    dragons: readonly Row[];
    newGenerals: readonly Row[];
    production: readonly Row[];
    marches: readonly Row[];
    offices: readonly Row[];
    mixed?: Row;
    turrets?: readonly Row[];
    territorySkills?: readonly Row[];
    kingSkills?: readonly Row[];
    kingSkillLogs?: readonly Row[];
    effects: WorldResourceOwnerSnapshot;
    alliance?: Row;
}

export interface ScoutReinforcement
{
    march: Row;
    profile: Row;
    statistics: Row;
    dragons: readonly Row[];
    alliance?: Row;
}

export interface ScoutRally
{
    march: Row;
    team?: Row;
    members: readonly ScoutReinforcement[];
}

export interface WorldScoutTarget
{
    point: Row;
    participant?: ScoutParticipant;
    occupyingMarch?: Row;
    reinforcements: readonly ScoutReinforcement[];
    rallies: readonly Row[];
    rallyDetails?: readonly ScoutRally[];
    barbarian?: Row;
    cityBosses: readonly Row[];
}

export interface WorldScoutMail
{
    id: string;
    march: string;
    owner: string;
    target: number;
    targetOwner: string;
    recipient: string;
    type: 2 | 6 | 8;
    itemIdFlag?: 0 | 1;
    sender: string;
    senderName: string;
    title: string;
    contents: Uint8Array;
    createdAt: bigint;
}
