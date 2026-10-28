import type { QuestRecord, QuestRule } from "./records";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import type { QuestState, QuestWrite } from "./progression";

export interface QuestCatalog
{
    readonly kingdomId: number;
    readonly goods: ReadonlyMap<string, QuestRule>;
    readonly items: ReadonlyMap<string, QuestRule>;
    readonly mail: ReadonlyMap<string, QuestRule>;
    readonly reconnect: {
        readonly quests?: readonly QuestRule[];
        readonly rewards?: ReadonlyMap<string, unknown>;
    };
    readonly progression: {
        readonly story?: ReadonlyMap<string, QuestRule>;
        readonly daily?: ReadonlyMap<string, QuestRule>;
        readonly legacyDaily?: ReadonlyMap<string, QuestRule>;
        readonly freshSignIn?: ReadonlyMap<string, QuestRule>;
        readonly legacyRewards?: ReadonlyMap<string, QuestRule>;
        readonly questPhases?: ReadonlyMap<string, QuestRule>;
        readonly dailyRewards?: ReadonlyMap<string, QuestRule>;
        readonly signIn?: ReadonlyMap<string, QuestRule>;
    };
}

export interface QuestProgressionState
{
    readonly profile: QuestRecord;
    readonly tasks: readonly QuestRecord[];
    readonly buildings: readonly QuestRecord[];
    readonly armies: readonly QuestRecord[];
    readonly equipment: readonly QuestRecord[];
    readonly sciences: readonly QuestRecord[];
    readonly statistics: QuestRecord;
    readonly quests?: QuestState;
}

export interface QuestContext<TCatalog extends QuestCatalog>
{
    readonly owner: string;
    readonly now: bigint;
    readonly rules: TCatalog;
    readonly state: QuestProgressionState & { readonly queues: readonly QuestRecord[]; };
    readonly write: {
        quests?: QuestWrite;
        profile?: QuestRecord;
        buildings?: readonly QuestRecord[];
        deletedBuildings?: readonly string[];
        sciences?: readonly QuestRecord[];
        armies?: readonly QuestRecord[];
        equipment?: readonly QuestRecord[];
        deletedEquipment?: readonly string[];
        statistics?: QuestRecord;
        queues?: readonly QuestRecord[];
    };
    readonly economy: ActivityEconomy;
    effect(id: number): number;
    experience(amount: number): void;
}
