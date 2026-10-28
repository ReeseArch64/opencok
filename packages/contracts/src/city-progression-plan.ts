import type { ResourceType } from "@opencok/enums/resource";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import type { HeroScoreAction } from "@opencok/hero/contracts/hero-score";
import type { Fields } from "@opencok/messages/sfs";
import type { ExpeditionScoreAction } from "./new-expedition";
import type {
    CityProgressionState,
    CityProgressionStore,
    CityProgressionWrite,
    ProgressionActivityData,
} from "./city-progression";
import type { TimedActivity } from "./timed-activity";
import type { Row } from "./rows";
import type { WorldResourceOwnerSnapshot } from "./world-resource-owner";

export interface CityProgressionPlan<TRules>
{
    readonly state: CityProgressionState;
    readonly rules: TRules;
    readonly now: bigint;
    readonly economy: ActivityEconomy;
    readonly write: CityProgressionWrite;
    readonly heroActions: HeroScoreAction[];
    readonly expeditionActions: ExpeditionScoreAction[];
    readonly scoreAt: bigint;
    readonly owner: string;
    readonly costs: Record<string, string>;
    readonly items: Record<string, number>;
    readonly effect: (id: number) => number;
    readonly generalEffect: (id: number, buildingId?: number, uuid?: string) => number;
    readonly treasurePoints?: CityProgressionStore["treasurePoints"];
    readonly birthPoint?: CityProgressionStore["birthPoint"];
    readonly foreignEffect?: (
        snapshot: WorldResourceOwnerSnapshot,
        id: number,
        at?: bigint,
    ) => number;
    completing?: Pick<TimedActivity, "type" | "itemId"> & Partial<Pick<TimedActivity, "dueAt">>;
    recordHero(type: number, parameter: string, count?: number | bigint, at?: bigint): void;
    balance(asset: string): bigint;
    spend(costs: Readonly<Partial<Record<`${ResourceType}`, bigint>>>, purchase: boolean): void;
    spendItem(itemId: string, requested: number, purchase?: boolean): void;
    accelerate(duration: bigint, troops?: boolean): void;
    data(
        kind: ProgressionActivityData["kind"],
        extra?: Partial<ProgressionActivityData>,
    ): ProgressionActivityData;
    refund(data: ProgressionActivityData | undefined): void;
    resource(): Fields;
    ownBuilding(id: string): Row;
    idleBuilding(row: Row): void;
    checkPower(additional: bigint): void;
    power(delta: bigint, building?: bigint, cured?: number): void;
    experience(amount: number): void;
}
