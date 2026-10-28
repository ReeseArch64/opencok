import type { RewardPreview, RewardRandom } from "@opencok/economy/contracts/reward-preview";
import type { AllianceRecordReaders } from "./readers";

export interface AllianceMembershipRuntime<TCatalog, TLedger> extends AllianceRecordReaders
{
    allianceFailure(code?: string): never;
    readonly errors: { locked: string; };
    randomUUID(): string;
    randomInt: RewardRandom;
    previewRewards(
        reward: string | undefined,
        rules: TCatalog,
        context: { kingdomId: number; version: string; now: number; },
        random: RewardRandom,
    ): readonly RewardPreview[];
    javaMailBytes(value: string | undefined): Uint8Array | null;
    activityEconomy(ledger: TLedger): { gold(delta: bigint): void; };
}

export interface AllianceMembershipMappingRuntime
{
    allianceFailure(): never;
    allianceStableId(value: string): string;
}
