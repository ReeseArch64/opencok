import type { BuildingState, BuildingCosts, BuildingResource } from "./building";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import type { ProgressionActivityData } from "@opencok/economy/contracts/progression-activity";
import type { Fields } from "@opencok/messages/sfs";
import type { TimedActivity } from "@opencok/base/contracts/activity";
import type { UpdateBuildingExperienceDto } from "../dtos/update-building-experience.dto";

export type ConstructionRecord = Record<string, string | number | bigint | Buffer | null>;

export interface ConstructionCatalog
{
    readonly kingdomId: number;
    readonly positions: ReadonlyMap<string, Readonly<Record<string, string>>>;
    readonly reconnect: { readonly rewards?: ReadonlyMap<string, unknown>; };
    building(itemId: string, level: number, star?: number, progress?: number): BuildingState;
    nextBuilding(
        itemId: string,
        level: number,
        star?: number,
        progress?: number,
        now?: number,
    ): BuildingState;
}

export interface ConstructionState
{
    readonly profile: ConstructionRecord;
    readonly buildings: readonly ConstructionRecord[];
    readonly queues: readonly ConstructionRecord[];
    readonly buildingExperience: ConstructionRecord;
}

export interface ConstructionContext<TCatalog extends ConstructionCatalog>
{
    readonly state: ConstructionState;
    readonly rules: TCatalog;
    readonly owner: string;
    readonly now: bigint;
    readonly economy: ActivityEconomy;
    readonly write: {
        buildings?: readonly ConstructionRecord[];
        queues?: readonly ConstructionRecord[];
        deletedBuildings?: readonly string[];
        buildingExperience?: UpdateBuildingExperienceDto;
    };
    readonly completing?:
        & Pick<TimedActivity, "type" | "itemId">
        & Partial<Pick<TimedActivity, "dueAt">>;
    effect(id: number): number;
    generalEffect(id: number, buildingId?: number, uuid?: string): number;
    ownBuilding(id: string): ConstructionRecord;
    idleBuilding(row: ConstructionRecord): void;
    balance(asset: string): bigint;
    spend(costs: BuildingCosts, purchase: boolean): void;
    spendItem(itemId: string, count: number, purchase?: boolean): void;
    accelerate(duration: bigint, troops?: boolean): void;
    data(
        kind: ProgressionActivityData["kind"],
        extra?: Partial<ProgressionActivityData>,
    ): ProgressionActivityData;
    refund(data: ProgressionActivityData | undefined): void;
    resource(): Fields;
    checkPower(additional: bigint): void;
    power(delta: bigint, building?: bigint, cured?: number): void;
    experience(amount: number): void;
}

export type ConstructionAssets = readonly BuildingResource[];
