import type { QuestRule as Rule, QuestRecord as Row } from "./records";
import type { RewardRandom } from "@opencok/economy/contracts/reward-preview";

export interface ReconnectTask
{
    accepted: boolean;
    id: string;
    num: number;
    state: number;
    type: number;
    trigger: number;
    phase: number;
    predecessor: string | undefined;
    reward: string | undefined;
}

export interface ReconnectTaskPlan
{
    tasks: readonly ReconnectTask[];
    inserts: readonly ReconnectTask[];
    updates: readonly ReconnectTask[];
    pushes: readonly { command: string; tasks: readonly ReconnectTask[]; }[];
}

export interface ReconnectTaskContext
{
    platform: string;
    registrationPlatform: string | null;
    chinaPlatform: boolean;
    level: number;
    castleLevel: number;
    containsBuildings: (requirements: readonly string[]) => boolean;
    initialCount: (rule: Rule) => number;
    random: RewardRandom;
}

export interface ReconnectTaskCountState
{
    profile: Row;
    buildings: readonly Row[];
    armies: readonly Row[];
    equipment: readonly Row[];
    scienceLevels: ReadonlyMap<string, number>;
    resourceOutput: ReadonlyMap<number, number>;
    playerInfo: Row | undefined;
    prestigeLevel: number;
    civilizationCastle: Row | undefined;
}
