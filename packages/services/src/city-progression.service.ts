import { TimedActivityAction } from "@opencok/enums/timed-activity-action";
import { flushHeroScore } from "@opencok/hero/services/hero-score";
import { flushExpeditionScores } from "./new-expedition";
import { refreshCampaignGrants } from "./local-campaign";
import { refreshGeneralUnlocks } from "@opencok/hero/services/general-assignments";
import { refreshQuests } from "./quests";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import type { ActivityAction, TimedActivity } from "@opencok/contracts/timed-activity";
import type { CityProgressionStore } from "@opencok/contracts/city-progression";
import { num } from "@opencok/contracts/rows";
import { encode, decode } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import type { InventoryEffects } from "./inventory";
import type { CityDomain } from "./city-domain.ts";
import { CityProgressionContextFactory } from "./city-progression-context-factory.ts";

export class CityProgressionService<T>
{
    private readonly contexts: CityProgressionContextFactory<T>;
    public readonly domains = new Map<
        number,
        (
            tx: T,
            action: ActivityAction,
            activity: TimedActivity,
            now: bigint,
            economy: ActivityEconomy,
        ) => Promise<Uint8Array>
    >();

    public constructor(
        store: (tx: T, owner: string, now: bigint) => CityProgressionStore,
        private readonly domainList: readonly CityDomain[],
        rules: Rules,
        effects: InventoryEffects,
    )
    {
        this.contexts = new CityProgressionContextFactory(store, rules, effects);

        for (const domain of this.domainList)
        {
            for (const type of domain.types)
            {
                if (this.domains.has(type))
                {
                    throw new Error("Duplicate city activity domain");
                }

                this.domains.set(type, async (tx, action, activity, now, economy) => {
                    const { repository, plan } = await this.contexts.create(
                        tx,
                        activity.ownerId,
                        now,
                        economy,
                    );

                    if (action === TimedActivityAction.Finish)
                    {
                        plan.completing = activity;
                    }

                    const body = await domain.apply(plan, action, activity);
                    refreshCampaignGrants(plan);

                    if (action === TimedActivityAction.Finish && activity.type === 0)
                    {
                        refreshGeneralUnlocks(plan);
                    }

                    if (action === TimedActivityAction.Finish)
                    {
                        refreshQuests(plan, {
                            legacy: activity.type === 0 ? 3 : activity.type === 6 ? 12 : undefined,
                            daily: activity.type === 0 ? 26 : activity.type === 6 ? 27 : undefined,
                            main: activity.type === 0 ? 31 : undefined,
                            count: 1,
                        });
                    }

                    if (
                        action === TimedActivityAction.Finish
                        && [1, 8, 9, 10, 17, 2, 3].includes(activity.type)
                    )
                    {
                        const rows = activity.type === 2
                            ? plan.write.forts
                            : activity.type === 3
                            ? plan.write.hospital
                            : plan.write.armies;
                        const quantity = (rows ?? []).reduce((sum, row) => {
                            if (activity.type === 3)
                            {
                                return (
                                    sum
                                    + Math.max(
                                        0,
                                        num(
                                            plan.state.hospital.find((prior) =>
                                                prior.armyId === row.armyId
                                            ) ?? {},
                                            "heal",
                                        ) - num(row, "heal"),
                                    )
                                );
                            }

                            const prior =
                                (activity.type === 2 ? plan.state.forts : plan.state.armies).find(
                                    (prior) => prior.armyId === row.armyId,
                                );
                            const key = activity.type === 2 ? "num" : "free";

                            return sum + Math.max(0, num(row, key) - num(prior ?? {}, key));
                        }, 0);
                        refreshQuests(plan, {
                            main: activity.type === 2 ? 22 : activity.type === 3 ? 44 : 2,
                            count: quantity,
                            key: activity.itemId,
                        });
                    }

                    await flushExpeditionScores(plan);
                    await flushHeroScore(plan);
                    await repository.update(plan.write, economy);

                    return encode(body);
                });
            }
        }
    }

    public readonly accelerate = async (
        tx: T,
        activity: TimedActivity,
        remaining: bigint,
        now: bigint,
        economy: ActivityEconomy,
    ) => {
        const domain = this.domainList.find((domain) => domain.types.includes(activity.type));

        if (!domain?.accelerate)
        {
            throw new GameError(errors.unsupported, "city_progression");
        }

        const { repository, plan } = await this.contexts.create(tx, activity.ownerId, now, economy);
        await domain.accelerate(plan, activity, remaining);
        await flushExpeditionScores(plan);
        await flushHeroScore(plan);
        await repository.update(plan.write, economy);
    };

    public readonly next = async (
        tx: T,
        activity: TimedActivity,
        now: bigint,
        economy: ActivityEconomy,
    ) => {
        const domain = this.domainList.find((domain) => domain.types.includes(activity.type));

        if (!domain?.next)
        {
            return undefined;
        }

        const { repository, plan } = await this.contexts.create(tx, activity.ownerId, now, economy);
        const result = await domain.next(plan, activity);
        await flushExpeditionScores(plan);
        await flushHeroScore(plan);
        await repository.update(plan.write, economy);

        return result;
    };

    public readonly command = async (
        tx: T,
        owner: string,
        command: string,
        params: Uint8Array,
        now: bigint,
        economy: ActivityEconomy,
    ) => {
        const domain = this.domainList.find(
            (candidate) => candidate.handles?.(command) ?? candidate.commands.includes(command),
        );

        if (!domain)
        {
            throw new GameError(errors.unsupported, "city_progression");
        }

        const { repository, plan } = await this.contexts.create(
            tx,
            owner,
            now,
            economy,
            command,
            params,
        );
        const result = await domain.prepare(plan, command, decode(Buffer.from(params)));
        refreshCampaignGrants(plan);

        if (!domain.commands.includes("task.reward.get"))
        {
            refreshQuests(plan);
        }

        await flushExpeditionScores(plan);
        await flushHeroScore(plan);
        await repository.update(plan.write, economy);

        return result;
    };
}
