import type { Value } from "@opencok/messages/sfs";
import type { Row } from "./rows.ts";

import type { PlayerEffectSnapshot } from "./power.ts";
import type { WorldResourceOwnerSnapshot } from "./world-point-detail.ts";
import type { AvatarSystemMail } from "./files.ts";

export interface ReconnectBaseState
{
    profile: Row | undefined;
    armies: readonly Row[];
    generals: readonly Row[];
    skills: readonly Row[];
}

export interface FriendshipMine
{
    itemId: number;
    level: number;
    exp: number;
    miner: number;
    mineTime: bigint;
    call: number;
}

export interface FriendshipMineView extends FriendshipMine
{
    requiredExp: number;
    maxMiners: number;
}

export interface FriendshipMineStore
{
    friendshipMine(uid: string, initial: () => FriendshipMine): Promise<Row>;
}

export interface ReconnectTask
{
    accepted: boolean;
    id: string;
    num: number;
    state: number;
    type: number;
    trigger: number;
    phase: number;
    predecessor: string | undefined;
    reward: string | undefined;
}

export interface ReconnectTaskPlan
{
    tasks: readonly ReconnectTask[];
    inserts: readonly ReconnectTask[];
    updates: readonly ReconnectTask[];
    pushes: readonly { command: string; tasks: readonly ReconnectTask[]; }[];
}

export interface ReconnectProgressState extends ReconnectBaseState
{
    allianceResearch?: readonly Row[];
    profile: Row;
    resource: Row;
    effects: PlayerEffectSnapshot;
    buildings: readonly Row[];
    equipment: readonly Row[];
    queues: readonly Row[];
    tasks: readonly Row[];
    playerInfo: Row | undefined;
    registrationPlatform: string | null;
    civilizationCastle: Row | undefined;
    glory: Row | undefined;
    weakness: readonly Row[];
    walls: readonly Row[];
    hospital?: readonly Row[];
    knight: Row | undefined;
    items: readonly Row[];
    newGenerals: WorldResourceOwnerSnapshot["newGenerals"];
    marches: ReconnectMarchState;
    mine?: Row;
    world?: Row;
}

export interface ReconnectMarchState
{
    rows: readonly Row[];
    teams: readonly (Row & { family: number; })[];
    points: readonly Row[];
    profiles: readonly Row[];
    alliances: readonly Row[];
    states: readonly Row[];
    offices: readonly Row[];
    dragons: readonly Row[];
    skills: readonly Row[];
    miracles: readonly Row[];
    territories: readonly Row[];
}

export interface ReconnectProgressWrite
{
    mail: readonly (AvatarSystemMail & { itemIdFlag: 0 | 1; })[];
    resource: { food: bigint; foodbind: bigint; lastUpdateTime: bigint; starvingMillis: bigint; };
    tasks: Pick<ReconnectTaskPlan, "inserts" | "updates">;
    armies: readonly { armyId: string; free: number; defence: number; }[];
    weakness: readonly {
        armyId: string;
        weakness: number;
        marchWeakness: number;
        heal: number;
        finishTime: bigint;
    }[];
    weaknessTime: bigint | undefined;
    generalResets: readonly string[];
    skillResets: readonly string[];
    skillCooldownResets: readonly string[];
    buildingRefreshes: readonly { uuid: string; refreshTime: bigint; }[];
    troopChanges: readonly {
        armyId: string;
        freeBefore: number;
        freeAfter: number;
        defenceBefore: number;
        defenceAfter: number;
        weakened: number;
        dead: number;
    }[];
}

export type ReconnectResearchProjection = (rows: readonly Row[], queues: readonly Row[]) => Value;
