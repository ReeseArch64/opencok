import type { Fields } from "@opencok/messages/sfs";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import type { AllianceRecord as Row } from "./records";

export interface AllianceHeartState
{
    recipient?: Row;
    worlds: readonly Row[];
    points: readonly Row[];
    members: readonly Row[];
    pending: readonly Row[];
}

export interface AllianceHeartPoint
{
    id: number;
    uid: string;
    until: bigint;
    effect: string;
}

export interface AllianceHeartWrite
{
    points?: readonly AllianceHeartPoint[];
    pending?: { uid: string; duration: number; effect: string; };
    delivered?: readonly number[];
}

export interface AllianceHeartCatalog
{
    goods: ReadonlyMap<string, Record<string, string>>;
}

export interface AllianceHeartContext
{
    readonly owner: string;
    readonly now: bigint;
    readonly rules: AllianceHeartCatalog & { kingdomId: number; };
    readonly state: { profile: Row; allianceHeart?: AllianceHeartState; };
    readonly write: { allianceHeart?: AllianceHeartWrite; };
    readonly economy: Pick<ActivityEconomy, "ownedItem" | "consumeItem">;
}

export interface AllianceHeartSendEvent
{
    owner: string;
    points: readonly AllianceHeartPoint[];
    target: number | undefined;
    online: boolean;
    recipient: string;
    effect: string;
    until: bigint;
    name(): string;
}

export type AllianceHeartInterests = (
    points: readonly number[],
    owner: string,
    target: string,
) => Promise<readonly string[]>;

export type AllianceHeartPublisher = (
    owner: string,
    command: string,
    body: Fields,
) => Promise<unknown>;
