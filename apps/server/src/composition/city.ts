import { CityProgressionService } from "@opencok/city/services/progression";
import { CityProgressionContextFactory } from "@opencok/city/services/context-factory";
import type { CityDomain } from "@opencok/city/contracts/domain";
import type { CityEffects } from "@opencok/city/contracts/runtime";
import type { CityProgressionStore } from "@opencok/contracts/city-progression";
import type { Rules } from "@opencok/rules/game";
import { resourceOwnerRuleContext } from "@opencok/services/world-resource-owner-context";
import { refreshCampaignGrants } from "@opencok/services/local-campaign";
import { refreshQuests } from "@opencok/services/quests";
import { flushExpeditionScores } from "@opencok/services/new-expedition";
import { refreshGeneralUnlocks } from "@opencok/hero/services/general-assignments";
import { flushHeroScore } from "@opencok/hero/services/hero-score";

export function createRealmCityProgressionHandlers<T>(
    store: (tx: T, owner: string, now: bigint) => CityProgressionStore,
    domains: readonly CityDomain[],
    rules: Rules,
    effects: CityEffects,
): CityProgressionService<T>
{
    return new CityProgressionService(
        new CityProgressionContextFactory(store, rules, effects, resourceOwnerRuleContext),
        domains,
        {
            refreshCampaignGrants,
            refreshGeneralUnlocks,
            refreshQuests,
            flushExpeditionScores,
            flushHeroScore,
        },
    );
}
