import type { QuestCatalog, QuestContext } from "./quest";
import type { QuestRecord, QuestRule } from "./records";
import type { ReconnectTaskContext, ReconnectTaskCountState, ReconnectTaskPlan } from "./reconnect";
import type { RewardPreview, RewardRandom } from "@opencok/economy/contracts/reward-preview";
import type { Value } from "@opencok/messages/sfs";

export interface QuestRecordReaders
{
    text(row: QuestRecord, key: string): string;
    num(row: QuestRecord, key: string): number;
    long(row: QuestRecord, key: string): bigint;
}

export interface QuestNumericRuntime
{
    cityInteger(value: unknown, minimum?: number, maximum?: number): number;
}

export interface QuestPersistenceValueRuntime
    extends QuestNumericRuntime, Pick<QuestRecordReaders, "text" | "long">
{
    cityAmount(value: unknown): bigint;
}

export interface QuestRuleRuntime<TCatalog extends QuestCatalog>
    extends QuestRecordReaders, QuestNumericRuntime
{
    reconnectTaskPlan(
        rows: readonly QuestRecord[],
        declarations: readonly QuestRule[],
        context: ReconnectTaskContext,
    ): ReconnectTaskPlan;
    reconnectContainsBuildings(
        buildings: readonly QuestRecord[],
        requirements: readonly string[],
    ): boolean;
    reconnectResourceOutput(
        buildings: readonly QuestRecord[],
        rules: TCatalog,
    ): ReadonlyMap<number, number>;
    reconnectTaskInitialCount(
        rule: QuestRule,
        state: ReconnectTaskCountState,
        rules: TCatalog,
    ): number;
}

export interface QuestRuntime<
    TCatalog extends QuestCatalog,
    TContext extends QuestContext<TCatalog>,
> extends QuestRecordReaders
{
    readonly idleDeadline: bigint;
    recordTargetTask(
        context: TContext,
        type: number,
        amount: number | bigint,
        condition?: string,
    ): void;
    recordCampaignUse(context: TContext, itemId: string, count: number): void;
    javaMailBytes(value: string | undefined): Uint8Array | null;
    newEquipment(context: TContext, id: string): QuestRecord;
    previewRewards(
        id: string | undefined,
        rules: TCatalog,
        context: { kingdomId: number; version: string; now: number; },
        random: RewardRandom,
    ): readonly RewardPreview[];
    rewardPreviewArray(rewards: readonly RewardPreview[]): Value;
    mergeSignInRewards(
        rewards: readonly RewardPreview[],
        percent: number,
    ): readonly RewardPreview[];
}
