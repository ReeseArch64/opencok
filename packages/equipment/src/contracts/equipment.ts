import type { BuildingState, BuildingCosts } from "@opencok/building/contracts/building";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import type { ProgressionActivityData } from "@opencok/economy/contracts/progression-activity";
import type { Fields } from "@opencok/messages/sfs";

export type EquipmentRecord = Record<string, string | number | bigint | Buffer | null>;

export type EquipmentRule = Record<string, string>;

export interface EquipmentCatalog
{
    readonly goods: ReadonlyMap<string, EquipmentRule>;
    readonly items: ReadonlyMap<string, EquipmentRule>;
    readonly power: {
        readonly equipment?: ReadonlyMap<string, EquipmentRule>;
        readonly equipmentSets?: ReadonlyMap<string, EquipmentRule>;
        readonly statuses?: ReadonlyMap<string, EquipmentRule>;
        readonly superVip?: ReadonlyMap<string, EquipmentRule>;
    };
    readonly progression: {
        readonly forgeRandom?: ReadonlyMap<string, EquipmentRule>;
        readonly equipmentRandom?: ReadonlyMap<string, EquipmentRule>;
        readonly reforgeRandom?: ReadonlyMap<string, EquipmentRule>;
    };
    building(itemId: string, level: number, star?: number, progress?: number): BuildingState;
    role(level: number): EquipmentRule;
}

export interface EquipmentWrite
{
    equipment?: readonly EquipmentRecord[];
    deletedEquipment?: readonly string[];
    deletedStates?: readonly number[];
    suitDecompositions?: readonly EquipmentRecord[];
    equipmentSelection?: string;
    materialBackup?: number;
    materialAcceleration?: { materialCdNum: number; materialCdTime: bigint; };
    queueUpdates?: readonly EquipmentRecord[];
}

export interface EquipmentContext<TCatalog extends EquipmentCatalog>
{
    readonly owner: string;
    readonly now: bigint;
    readonly rules: TCatalog;
    readonly state: {
        readonly profile: EquipmentRecord;
        readonly equipment: readonly EquipmentRecord[];
        readonly buildings: readonly EquipmentRecord[];
        readonly queues: readonly EquipmentRecord[];
        readonly suitDecompositions?: readonly EquipmentRecord[];
        readonly quests?: { readonly mixed: EquipmentRecord; };
        readonly effects: {
            readonly states: readonly EquipmentRecord[];
            readonly vip?: EquipmentRecord;
        };
        readonly newGenerals: { readonly generals: readonly EquipmentRecord[]; };
    };
    readonly write: EquipmentWrite;
    readonly economy: ActivityEconomy;
    idleBuilding(row: EquipmentRecord): void;
    effect(id: number): number;
    generalEffect(id: number, buildingId?: number, uuid?: string): number;
    spend(costs: BuildingCosts, purchase: boolean): void;
    spendItem(id: string, count: number, purchase?: boolean): void;
    balance(asset: string): bigint;
    power(delta: bigint, building?: bigint, cured?: number): void;
    data(
        kind: ProgressionActivityData["kind"],
        extra?: Partial<ProgressionActivityData>,
    ): ProgressionActivityData;
    refund(data: ProgressionActivityData | undefined): void;
    resource(): Fields;
}

export interface EquipmentCreationContext
{
    readonly owner: string;
    readonly rules: EquipmentCatalog;
    readonly state: { readonly equipment: readonly EquipmentRecord[]; };
    readonly write: { equipment?: readonly EquipmentRecord[]; };
}
