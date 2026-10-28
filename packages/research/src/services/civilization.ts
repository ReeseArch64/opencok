import { TimedActivityAction } from "@opencok/enums/timed-activity-action";
import { CommandDomain } from "@opencok/base/domain/command-domain";
import { serverFeature } from "@opencok/rules/power-context";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, str, int, encode } from "@opencok/messages/sfs";
import { num, long } from "@opencok/contracts/rows";
import { civilizationScience, civilizationScienceRequirements } from "../rules/civilization";
import { CivilizationResearchMapper } from "../mappings/civilization";
import { researchCosts } from "../rules/research";
import { cityInteger, cityAmount, progressionActivityData } from "@opencok/rules/city-progression";
import type { ResearchContext, ResearchActivityDomain } from "../contracts/context";

import { ResearchCommand } from "../enums/command";

export class CivilizationScienceDomain extends CommandDomain implements ResearchActivityDomain
{
    public constructor(private readonly mapper = new CivilizationResearchMapper())
    {
        super();
    }

    public readonly commands: ResearchActivityDomain["commands"] = [
        ResearchCommand.InitializeCivilization,
        ResearchCommand.StartCivilization,
        ResearchCommand.CompleteCivilizationDirectly,
    ];

    public readonly types: ResearchActivityDomain["types"] = [19];

    public readonly prepare: ResearchActivityDomain["prepare"] = async (
        context,
        command,
        params,
    ) => {
        if (command === ResearchCommand.InitializeCivilization)
        {
            const bases = [...(context.rules.power.civilizationSciences?.keys() ?? [])]
                .map(Number)
                .filter((base) => !context.rules.power.civilizationSciences?.has(String(base - 1)))
                .sort((a, b) => a - b);

            return {
                event: null,
                response: encode({
                    civilization_science: sfs.array(
                        bases.flatMap((base) => {
                            const level = num(this.current(context, base), "level");

                            if (
                                !context.rules.power.civilizationSciences?.has(String(base + level))
                            )
                            {
                                return [];
                            }

                            const pending = context.state.queues.filter(
                                (row) => num(row, "type") === 19 && row.itemId === String(base),
                            );

                            if (pending.length > 1)
                            {
                                throw new GameError(errors.queue, "city_progression");
                            }

                            return [
                                sfs.object(
                                    this.mapper.view(
                                        context.rules,
                                        base,
                                        level,
                                        pending.length ? long(pending[0]!, "updateTime") : 0n,
                                    ),
                                ),
                            ];
                        }),
                    ),
                }),
            };
        }

        if (
            !serverFeature(context.rules, "science_race_switch", {
                kingdomId: context.rules.kingdomId,
                version: "12.06.0",
                now: Number(context.now),
            })
        )
        {
            throw new GameError(errors.unsupported, "city_progression");
        }

        const base = cityInteger(str(params, "itemId"), 1),
            row = this.current(context, base),
            level = num(row, "level");
        const rule = civilizationScience(context.rules, base, level);
        const next = civilizationScience(context.rules, base, level + 1);

        if (context.state.queues.some((q) => num(q, "type") === 19 && q.itemId === String(base)))
        {
            throw new GameError(errors.occupied, "city_progression");
        }

        civilizationScienceRequirements(context.state, context.rules, rule);
        const payment = cityInteger(int(params, "gold", 0), 0, 1),
            direct = command === ResearchCommand.CompleteCivilizationDirectly;
        const durationMs = cityAmount(rule.time_research ?? 0) * 1000n;
        context.checkPower(cityAmount(next.power ?? 0) - cityAmount(rule.power ?? 0));
        context.spend(
            researchCosts(rule, () => 0),
            direct || payment === 1,
        );

        for (const pair of rule.science_point?.split("|").filter(Boolean) ?? [])
        {
            const [id, count, ...extra] = pair.split(";");

            if (!id || extra.length)
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            context.spendItem(id, cityInteger(count));
        }

        const data = context.data("civilization", {
            target: { level: level + 1, star: 0, progress: 0 },
        });
        const costs = () => ({
            costItem: sfs.array(
                Object.keys(context.items).map((id) =>
                    sfs.object({
                        itemId: sfs.string(id),
                        count: sfs.int(context.economy.quantity?.(id) ?? 0),
                    })
                ),
            ),
            resource: sfs.object(context.resource()),
            gold: sfs.long(context.balance("gold")),
        });

        if (direct)
        {
            context.accelerate(durationMs);

            return { response: encode({ ...this.complete(context, base, level + 1), ...costs() }) };
        }

        context.write.civilizationSciences = [row];

        return {
            type: 19,
            itemId: String(base),
            durationMs,
            ready: durationMs === 0n,
            data,
            responseKind: "nested",
            item: encode({ itemId: sfs.string(String(base)) }),
            response: encode(costs()),
        };
    };

    public readonly apply: ResearchActivityDomain["apply"] = async (context, action, activity) => {
        const base = cityInteger(activity.itemId, 1),
            row = this.current(context, base),
            data = progressionActivityData(activity.data);
        const pending = context.state.queues.filter(
            (q) => num(q, "type") === 19 && q.itemId === activity.itemId,
        );

        if (
            pending.length !== 1
            || pending[0]!.uuid !== activity.queueId
            || (data && data.kind !== "civilization")
            || action === TimedActivityAction.Start
        )
        {
            throw new GameError(errors.queue, "city_progression");
        }

        civilizationScience(context.rules, base, num(row, "level") + 1);

        if (action === TimedActivityAction.Cancel)
        {
            context.refund(data);

            return { resource: sfs.object(context.resource()) };
        }

        if (action === TimedActivityAction.Restore || action === TimedActivityAction.Reschedule)
        {
            return this.mapper.view(context.rules, base, num(row, "level"), activity.dueAt);
        }

        return this.complete(context, base, data?.target?.level);
    };
    private current(context: ResearchContext, base: number)
    {
        return (
            (context.state.civilizationSciences ?? []).find((row) =>
                num(row, "baseItemID") === base
            )
                ?? {
                    userID: context.owner,
                    baseItemID: base,
                    level: 0,
                }
        );
    }

    private complete(context: ResearchContext, base: number, expected?: number)
    {
        const row = this.current(context, base),
            level = num(row, "level");

        if (expected !== undefined && expected !== level + 1)
        {
            throw new GameError(errors.queue, "city_progression");
        }

        const before = civilizationScience(context.rules, base, level),
            after = civilizationScience(context.rules, base, level + 1);
        context.write.civilizationSciences = [{ ...row, level: level + 1 }];
        const delta = cityAmount(after.power ?? 0) - cityAmount(before.power ?? 0);
        context.power(delta);
        const power = (context.state.civilizationSciences ?? []).reduce(
            (sum, entry) =>
                sum
                + cityAmount(
                    civilizationScience(
                        context.rules,
                        num(entry, "baseItemID"),
                        num(entry, "level"),
                    )
                        .power
                        ?? 0,
                ),
            0n,
        ) + delta;

        return {
            ...this.mapper.view(context.rules, base, level + 1),
            sciencePower: sfs.int(cityInteger(power)),
        };
    }
}
