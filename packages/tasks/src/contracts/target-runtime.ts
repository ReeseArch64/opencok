import type { TargetTaskCatalog, TargetTaskContext } from "./target-context";
import type { QuestRecordReaders, QuestNumericRuntime } from "./runtime";
import type { RewardPreview, RewardRandom } from "@opencok/economy/contracts/reward-preview";
import type { Value } from "@opencok/messages/sfs";

export interface TargetTaskRuntime<
    TCatalog extends TargetTaskCatalog,
    TContext extends TargetTaskContext<TCatalog>,
> extends QuestNumericRuntime, QuestRecordReaders
{
    serverFeature(
        rules: TCatalog,
        key: string,
        context: { kingdomId: number; version: string; now: number; },
    ): boolean;
    recordRecallTask(
        context: TContext,
        type: number,
        amount: number | bigint,
        condition?: string,
        at?: bigint,
    ): void;
    javaMailBytes(value: string | undefined): Uint8Array | null;
    pinProgressionReward(context: TContext, id: string): string;
    mailRewardEntries(raw: string): readonly { category: string; itemId: string; count: number; }[];
    grantNativeProgressionReward(context: TContext, raw: string): Value[];
    previewRewards(
        id: string | undefined,
        rules: TCatalog,
        context: { kingdomId: number; version: string; now: number; },
        random: RewardRandom,
    ): readonly RewardPreview[];
    rewardPreviewArray(rewards: readonly RewardPreview[]): Value;
}
