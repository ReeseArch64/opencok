import type { QuestRule } from "./records";
import type { RewardPreview, RewardRandom } from "@opencok/economy/contracts/reward-preview";
import type { Value } from "@opencok/messages/sfs";

export interface ReconnectTaskNumericRuntime
{
    javaDecimal(raw: unknown, bits: 32 | 64): bigint;
}

export interface ReconnectTaskPlanningRuntime extends ReconnectTaskNumericRuntime
{
    javaIntHashMapOrder(keys: Iterable<number>): number[];
    mailBlank(value: string | undefined): boolean;
}

export interface ReconnectTaskCountCatalog
{
    readonly reconnect: { readonly positionUnlock?: readonly QuestRule[]; };
    building(id: string, level: number, star: number, progress: number): {
        readonly effects?: { readonly productionPerHour?: unknown; };
    };
}

export interface ReconnectTaskMappingCatalog
{
    readonly items: ReadonlyMap<string, QuestRule>;
}

export interface ReconnectTaskPreviewContext
{
    kingdomId: number;
    version: string;
    now: number;
}

export interface ReconnectTaskMappingRuntime<TCatalog extends ReconnectTaskMappingCatalog>
{
    signed(value: unknown, bits: 32 | 64): bigint;
    invalid(): never;
    previewRewards(
        id: string | undefined,
        rules: TCatalog,
        context: ReconnectTaskPreviewContext,
        random: RewardRandom,
    ): readonly RewardPreview[];
    rewardPreviewArray(rewards: readonly RewardPreview[]): Value;
}

export interface ReconnectTaskPersistenceRuntime
{
    integer(value: unknown): number;
    unique(ids: readonly string[]): void;
    updated(rows: readonly unknown[]): void;
}
