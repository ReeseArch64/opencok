import type {
    ConstructionCatalog,
    ConstructionContext,
    ConstructionRecord,
    ConstructionAssets,
} from "./construction";
import type { ProgressionActivityData } from "@opencok/economy/contracts/progression-activity";
import type { RewardPreview, RewardRandom } from "@opencok/economy/contracts/reward-preview";
import type { Fields, Value } from "@opencok/messages/sfs";

export interface ConstructionRuntime<
    TCatalog extends ConstructionCatalog,
    TContext extends ConstructionContext<TCatalog>,
>
{
    text(row: ConstructionRecord, key: string): string;
    num(row: ConstructionRecord, key: string): number;
    long(row: ConstructionRecord, key: string): bigint;
    cityInteger(value: unknown, minimum?: number, maximum?: number): number;
    cityLevel(row: ConstructionRecord): number;
    cityDuration(seconds: number, speed: number, reductionSeconds?: number): bigint;
    reducedCityCost(value: bigint, ...reductions: number[]): bigint;
    progressionActivityData(value: unknown): ProgressionActivityData | undefined;
    readonly cityAssets: ConstructionAssets;
    readonly idleDeadline: bigint;
    prestige(context: TContext): number;
    cityUnlockCount(context: TContext, type: number): bigint;
    building(row: ConstructionRecord, rules: TCatalog, next?: boolean, now?: number): Fields;
    previewRewards(
        rewardId: string | undefined,
        rules: TCatalog,
        context: { kingdomId: number; version: string; now: number; },
        random: RewardRandom,
    ): readonly RewardPreview[];
    rewardPreviewArray(rewards: readonly RewardPreview[]): Value;
    refreshPrayerBuilding(
        context: TContext,
        previous: ConstructionRecord,
        next: ConstructionRecord,
    ): void;
    recordTargetTask(context: TContext, type: 3, count: number): void;
    enrollCastleLevel(context: TContext, row: ConstructionRecord): void;
    recordExpeditionScore(context: TContext, type: 3, parameter: 1, count: number): void;
}
