import { TimedActivityAction } from "@opencok/enums/timed-activity-action";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, str, int, encode, type Fields } from "@opencok/messages/sfs";
import { num, long, type Row } from "@opencok/contracts/rows";
import type {
    ActivityAction,
    PreparedActivity,
    TimedActivity,
} from "@opencok/contracts/timed-activity";
import { researchDefinition, checkResearchRequirements, researchCosts } from "../rules/research";
import {
    cityInteger,
    cityAmount,
    cityDuration,
    progressionActivityData,
} from "@opencok/rules/city-progression";
import { idleDeadline } from "@opencok/rules/timed-activity";

import { CommandDomain } from "@opencok/base/domain/command-domain";
import { ResearchCommand } from "../enums/command";
import type {
    ResearchContext,
    ResearchActivityDomain,
    ResearchCompletionHooks,
} from "../contracts/context";
import { ResearchMapper } from "../mappings/research";
import { ResearchCompletion } from "./completion";

export class ResearchDomain extends CommandDomain implements ResearchActivityDomain
{
    public readonly commands = [
        ResearchCommand.Initialize,
        ResearchCommand.Start,
        ResearchCommand.CompleteDirectly,
    ];
    public readonly types = [6];
    private readonly completion: ResearchCompletion;

    public constructor(
        hooks: ResearchCompletionHooks,
        private readonly mapper = new ResearchMapper(),
    )
    {
        super();
        this.completion = new ResearchCompletion(hooks, mapper);
    }

    private current(context: ResearchContext, itemId: string): Row
    {
        return (
            context.state.sciences.find((row) => row.itemId === itemId) ?? {
                uid: context.owner,
                itemId,
                level: 0,
                cd: idleDeadline,
            }
        );
    }

    public readonly prepare: ResearchActivityDomain["prepare"] = async (
        context: ResearchContext,
        command: string,
        params: Fields,
    ): Promise<PreparedActivity> => {
        if (command === ResearchCommand.Initialize)
        {
            return {
                event: null,
                response: encode({
                    science: this.mapper.data(
                        context.state.sciences,
                        context.state.queues,
                        context.rules,
                    ),
                }),
            };
        }

        const itemId = str(params, "itemId"),
            row = this.current(context, itemId),
            rule = researchDefinition(context.rules, itemId, num(row, "level"));
        const maximum = cityInteger(rule.max_lv, 0, 99);

        if (num(row, "level") >= maximum)
        {
            throw new GameError(errors.researchMax, "city_progression");
        }

        researchDefinition(context.rules, itemId, num(row, "level") + 1);

        if (
            context.state.queues.some((queue) =>
                num(queue, "type") === 6 && queue.itemId === itemId
            )
            || long(row, "cd") !== idleDeadline
        )
        {
            throw new GameError(errors.occupied, "city_progression");
        }

        const academy = context.state.buildings.find(
            (building) => num(building, "itemId") === 403000 && num(building, "level") > 0,
        );

        if (!academy)
        {
            throw new GameError(errors.troopBuilding, "city_progression");
        }

        context.idleBuilding(academy);
        checkResearchRequirements(context.state, context.rules, rule);
        const payment = int(params, "gold", 0);

        if (![0, 1].includes(payment))
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        const durationMs = cityDuration(
            cityInteger(rule.time_research ?? 0),
            context.effect(69)
                + context.generalEffect(69, 403000)
                + context.effect(303)
                + context.effect(2147)
                + context.effect(2191),
            context.effect(774) * 3600 + context.effect(2148),
        );
        const direct = command === ResearchCommand.CompleteDirectly;
        context.checkPower(
            cityAmount(researchDefinition(context.rules, itemId, num(row, "level") + 1).power ?? 0)
                - cityAmount(rule.power ?? 0),
        );
        context.spend(researchCosts(rule, context.effect), direct || payment === 1);

        for (const pair of rule.science_point?.split("|").filter(Boolean) ?? [])
        {
            const [id, rawCount, ...extra] = pair.split(";");

            if (!id || extra.length)
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            const count = Math.max(
                0,
                cityInteger(rawCount) - (id === "210090" ? context.effect(756) : 0),
            );
            context.spendItem(id, cityInteger(Math.trunc(count)));
        }

        const data = context.data("research", {
            target: { level: num(row, "level") + 1, star: 0, progress: 0 },
        });
        const costItem = sfs.array(
            Object.keys(data.items).map((id) =>
                sfs.object({
                    itemId: sfs.string(id),
                    count: sfs.int(context.economy.quantity?.(id) ?? 0),
                })
            ),
        );

        if (direct)
        {
            context.accelerate(durationMs);

            return {
                response: encode({
                    ...this.completion.complete(context, row, data),
                    resource: sfs.object(context.resource()),
                    gold: sfs.long(context.balance("gold")),
                    costItem,
                }),
            };
        }

        const pending = { ...row, cd: context.now + durationMs };
        context.write.sciences = [pending];

        return {
            type: 6,
            itemId,
            durationMs,
            data,
            responseKind: "nested",
            item: encode({ itemId: sfs.string(itemId) }),
            response: encode({
                costItem,
                resource: sfs.object(context.resource()),
                gold: sfs.long(context.balance("gold")),
            }),
        };
    };

    public readonly apply: ResearchActivityDomain["apply"] = async (
        context: ResearchContext,
        action: ActivityAction,
        activity: TimedActivity,
    ) => {
        const row = context.state.sciences.find((science) => science.itemId === activity.itemId),
            data = progressionActivityData(activity.data);

        if (!row || (data && data.kind !== "research"))
        {
            throw new GameError(errors.queue, "city_progression");
        }

        const queues = context.state.queues.filter(
            (queue) => num(queue, "type") === 6 && queue.itemId === activity.itemId,
        );

        if (queues.length !== 1 || queues[0]!.uuid !== activity.queueId)
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        researchDefinition(context.rules, activity.itemId, num(row, "level") + 1);

        if (action === TimedActivityAction.Start)
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        if (action === TimedActivityAction.Restore || action === TimedActivityAction.Reschedule)
        {
            context.write.sciences = [{ ...row, cd: activity.dueAt }];

            return this.mapper.research(row, context.rules, activity.dueAt);
        }

        if (action === TimedActivityAction.Cancel)
        {
            context.refund(data);
            context.write.sciences = [{ ...row, cd: idleDeadline }];

            return { resource: sfs.object(context.resource()) };
        }

        return this.completion.complete(context, row, data);
    };
}
