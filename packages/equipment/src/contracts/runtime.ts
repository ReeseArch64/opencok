import type { EquipmentCatalog, EquipmentContext, EquipmentRecord } from "./equipment";
import type { RewardRandom } from "@opencok/economy/contracts/reward-preview";
import type { ProgressionActivityData } from "@opencok/economy/contracts/progression-activity";
import type { Fields } from "@opencok/messages/sfs";

export interface EquipmentRecordReaders
{
    text(row: EquipmentRecord, key: string): string;
    num(row: EquipmentRecord, key: string): number;
    long(row: EquipmentRecord, key: string): bigint;
}

export interface EquipmentRuleRuntime extends Pick<EquipmentRecordReaders, "text" | "num">
{
    cityInteger(value: unknown, minimum?: number, maximum?: number): number;
    cityAmount(value: unknown): bigint;
    chooseWeight(weights: readonly number[], random: RewardRandom): number;
}

export interface EquipmentRuntime<
    TCatalog extends EquipmentCatalog,
    TContext extends EquipmentContext<TCatalog>,
> extends EquipmentRuleRuntime, EquipmentRecordReaders
{
    cityDuration(seconds: number, speed: number, reductionSeconds?: number): bigint;
    progressionActivityData(value: unknown): ProgressionActivityData | undefined;
    readonly idleDeadline: bigint;
    queueView(row: EquipmentRecord, body: Fields, next: boolean): Fields;
    refreshQuests(
        context: TContext,
        action?: { main?: number; daily?: number; legacy?: number; count: number; key?: string; },
    ): void;
}

export interface EquipmentProjectionRuntime extends Pick<EquipmentRecordReaders, "text" | "num">
{
    integer(row: EquipmentRecord, key: string): number;
}
