import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import type { CityProgressionStore } from "@opencok/contracts/city-progression";
import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-resource-owner";
import type { RuleContext } from "@opencok/rules/availability";
import type { QuestAction } from "@opencok/tasks/contracts/action";
import type { CityProgressionContext } from "../services/context";

export interface CityEffects
{
    world(): Promise<ReadonlyMap<number, number>>;
    emperor(): Promise<number | null | undefined>;
}

export type CityOwnerRuleContext = (
    snapshot: WorldResourceOwnerSnapshot,
    context: Omit<RuleContext, "version">,
) => RuleContext;

export interface CityContextProvider<T>
{
    create(
        tx: T,
        owner: string,
        now: bigint,
        economy: ActivityEconomy,
        command?: string,
        request?: Uint8Array,
    ): Promise<{ repository: CityProgressionStore; plan: CityProgressionContext; }>;
}

export interface CityProgressionHooks
{
    refreshCampaignGrants(context: CityProgressionContext): void;
    refreshGeneralUnlocks(context: CityProgressionContext): void;
    refreshQuests(context: CityProgressionContext, action?: QuestAction): void;
    flushExpeditionScores(context: CityProgressionContext): Promise<void>;
    flushHeroScore(context: CityProgressionContext): Promise<void>;
}
