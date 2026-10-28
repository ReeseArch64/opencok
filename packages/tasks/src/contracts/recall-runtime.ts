import type { RecallTaskCatalog, RecallTaskContext } from "./recall-context";
import type { QuestRecord, QuestRule } from "./records";
import type { QuestRecordReaders, QuestNumericRuntime } from "./runtime";
import type { RewardPreview, RewardRandom } from "@opencok/economy/contracts/reward-preview";
import type { Value } from "@opencok/messages/sfs";

export interface RecallTaskRuntime<
    TCatalog extends RecallTaskCatalog,
    TContext extends RecallTaskContext<TCatalog>,
> extends QuestRecordReaders, QuestNumericRuntime
{
    regionalRecallBand(rule: QuestRule, level: number): number;
    regionalRecallEligible(
        rule: QuestRule,
        profile: QuestRecord,
        level: number,
        now: bigint,
    ): boolean;
    regionalRecallFailure(): never;
    eventTimestamp(value: string | undefined): bigint | undefined;
    serverFeature(
        rules: TCatalog,
        key: string,
        context: { kingdomId: number; version: string; now: number; },
    ): boolean;
    pinProgressionReward(context: TContext, id: string): string;
    grantNativeProgressionReward(context: TContext, raw: string): Value[];
    applyProgressionStatus(context: TContext, id: string): void;
    previewRewards(
        id: string | undefined,
        rules: TCatalog,
        context: { kingdomId: number; version: string; now: number; },
        random: RewardRandom,
    ): readonly RewardPreview[];
    rewardPreviewArray(rewards: readonly RewardPreview[]): Value;
}
