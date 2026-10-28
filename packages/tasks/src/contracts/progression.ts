import type { AvatarSystemMail } from "@opencok/mail/contracts/system-mail";
import type { QuestRecord as Row } from "./records";

export interface QuestState
{
    legacy: readonly Row[];
    fresh: Row;
    lord: Row;
    mixed: Row;
    signIn: Row;
    story: readonly Row[];
    daily: readonly Row[];
    alliance: Row;
}

export interface QuestWrite
{
    mail?: readonly AvatarSystemMail[];
    legacy?: readonly Row[];
    resetLegacy?: boolean;
    legacyPeriod?: bigint;
    dailyClaims?: string;
    fresh?: { day: number; signInTime: bigint; };
    tasks?: readonly Row[];
    story?: readonly Row[];
    daily?: readonly Row[];
    resetDaily?: boolean;
    lord?: { newDailyTaskFlushTime: bigint; newDailyTaskBoxRewardState: number; };
    signIn?: { day: number; lastRewardTime: bigint; reward: string; };
    taskStage?: number;
    allianceTasks?: number;
    allianceBox?: { threshold: number; period: bigint; };
}
