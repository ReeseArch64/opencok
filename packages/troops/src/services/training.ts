import { TimedActivityAction } from "@opencok/enums/timed-activity-action";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, str, int, encode, type Fields } from "@opencok/messages/sfs";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import type {
    ActivityAction,
    PreparedActivity,
    TimedActivity,
} from "@opencok/contracts/timed-activity";
import {
    cityInteger,
    cityDuration,
    progressionActivityData,
} from "@opencok/rules/city-progression";
import {
    troopDefinition,
    troopQueueType,
    troopBuilding,
    troopCosts,
    totalBuildingParameter,
    transferTroops,
    reserveTroops,
} from "../rules/military";
import { idleDeadline } from "@opencok/rules/timed-activity";

import { unitPower } from "@opencok/rules/military";
import { CommandDomain } from "@opencok/base/domain/command-domain";
import type {
    TroopsContext,
    TroopsActivityDomain,
    TroopsCompletionHooks,
} from "../contracts/context";
import { trainingCapacity } from "../rules/capacity";
import { TrainingCommand } from "../enums/command";
import { progressionBoolean } from "@opencok/validations/city-parameters";

export class TrainingDomain extends CommandDomain implements TroopsActivityDomain
{
    public readonly commands = [
        TrainingCommand.Train,
        TrainingCommand.CompleteDirectly,
        TrainingCommand.Dismiss,
    ];
    public readonly types = [1, 8, 9, 10, 17];

    public constructor(private readonly hooks: TroopsCompletionHooks)
    {
        super();
    }

    private current(context: TroopsContext, armyId: string): Row
    {
        return (
            context.state.armies.find((row) => row.armyId === armyId) ?? {
                uid: context.owner,
                armyId,
                level: 0,
                free: 0,
                defence: 0,
                march: 0,
                pve: 0,
                train: 0,
                finishTime: 0n,
                foodCostTime: context.now,
            }
        );
    }

    private complete(context: TroopsContext, row: Row, count: number)
    {
        if (count <= 0 || num(row, "train") !== count)
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        const [, free] = transferTroops(count, num(row, "free"), count);
        const completed = { ...row, free, train: 0, finishTime: 0n, foodCostTime: context.now };
        context.write.armies = [completed];
        const power = unitPower(troopDefinition(context.rules, text(row, "armyId")), count);
        context.power(power);
        context.recordHero(4, text(row, "armyId"), count);
        this.hooks.expedition(context, 5, cityInteger(row.armyId), count);
        const targetCondition = ({ 1: "1", 8: "2", 9: "4", 10: "6" } as Record<number, string>)[
            troopQueueType(troopDefinition(context.rules, text(row, "armyId")))
        ];

        if (targetCondition)
        {
            this.hooks.target(context, 2, count, targetCondition);
        }

        if (power > 0n)
        {
            this.hooks.expedition(context, 3, 3, cityInteger(power));
        }

        return {
            id: sfs.string(text(row, "armyId")),
            free: sfs.int(cityInteger(free + num(row, "defence"))),
        };
    }

    public readonly prepare: TroopsActivityDomain["prepare"] = async (
        context: TroopsContext,
        command: string,
        params: Fields,
    ): Promise<PreparedActivity> => {
        const armyId = str(params, "id"),
            rule = troopDefinition(context.rules, armyId),
            type = troopQueueType(rule),
            row = this.current(context, armyId);

        if (![1, 8, 9, 10, 17].includes(type))
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        const count = cityInteger(int(params, "num"), command === TrainingCommand.Dismiss ? 0 : 1);

        if (command === TrainingCommand.Dismiss)
        {
            const [free] = transferTroops(num(row, "free"), 0, count);
            context.write.armies = [{ ...row, free }];
            context.power(-unitPower(rule, count));

            return { response: encode({ id: sfs.string(armyId), free: sfs.int(free) }) };
        }

        const building = troopBuilding(context.state, rule);

        if (count > trainingCapacity(context, type))
        {
            throw new GameError(errors.invalid, "training_capacity");
        }

        reserveTroops(context.state, armyId, count);
        context.checkPower(unitPower(rule, count));

        if (
            num(row, "train") !== 0
            || context.state.queues.some((queue) =>
                num(queue, "type") === type && text(queue, "itemId")
            )
        )
        {
            throw new GameError(errors.occupied, "city_progression");
        }

        if (
            !context.state.queues.some(
                (queue) =>
                    num(queue, "type") === type
                    && long(queue, "updateTime") === idleDeadline
                    && long(queue, "endTime") >= context.now,
            )
        )
        {
            throw new GameError(errors.full, "city_progression");
        }

        const speedId = ({ 1: 113, 8: 114, 9: 115, 10: 116 } as Record<number, number>)[type];
        const base = (cityInteger(rule.time) * count)
            / (1 + totalBuildingParameter(context.state, context.rules, 410000, 1) / 100);
        const durationMs = cityDuration(
            base,
            context.effect(66)
                + context.generalEffect(66, num(building, "itemId"))
                + (speedId
                    ? context.effect(speedId)
                        + context.generalEffect(speedId, num(building, "itemId"))
                    : 0)
                + context.effect(301)
                + context.effect(2150)
                + context.effect(2192),
            context.effect(2149),
        );
        const direct = command === TrainingCommand.CompleteDirectly,
            purchase = direct ? Object.hasOwn(params, "max") : progressionBoolean(params, "gold");
        context.spend(
            troopCosts(rule, count, context.effect(453) + context.effect(2151)),
            purchase,
        );
        const itemCount = Math.ceil((cityInteger(rule.fine_iron ?? 0) * count) / 100);

        if (itemCount)
        {
            context.spendItem("211508", itemCount);
        }

        if (direct)
        {
            context.accelerate(durationMs, purchase);
        }

        const pending = {
            ...row,
            train: count,
            finishTime: direct ? context.now : context.now + durationMs,
            foodCostTime: context.now,
        };

        if (direct && progressionBoolean(params, "complete"))
        {
            return {
                response: encode({
                    ...this.complete(context, pending, count),
                    resource: sfs.object(context.resource()),
                    gold: sfs.long(context.balance("gold")),
                }),
            };
        }

        context.write.armies = [pending];

        return {
            type,
            itemId: armyId,
            durationMs: direct ? 0n : durationMs,
            ready: direct,
            responseKind: "nested",
            data: context.data("train", { units: { [armyId]: count } }),
            item: encode({ itemId: sfs.string(armyId), allId: sfs.string(armyId) }),
            response: encode({
                resource: sfs.object(context.resource()),
                ...(purchase || direct ? { gold: sfs.long(context.balance("gold")) } : {}),
            }),
        };
    };

    public readonly apply: TroopsActivityDomain["apply"] = async (
        context: TroopsContext,
        action: ActivityAction,
        activity: TimedActivity,
    ): Promise<Fields> => {
        const armyId = activity.itemId;
        const row = context.state.armies.find((army) => army.armyId === armyId),
            data = progressionActivityData(activity.data);
        const rule = troopDefinition(context.rules, armyId);

        if (
            !row
            || troopQueueType(rule) !== activity.type
            || num(row, "train") <= 0
            || (data && (data.kind !== "train" || data.units?.[armyId] !== num(row, "train")))
        )
        {
            throw new GameError(errors.queue, "city_progression");
        }

        const saved = context.state.queues.find((queue) => queue.uuid === activity.queueId);

        if (
            !saved || saved.itemId !== armyId
            || long(row, "finishTime") !== long(saved, "updateTime")
        )
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        if (action === TimedActivityAction.Start)
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        if (action === TimedActivityAction.Restore || action === TimedActivityAction.Reschedule)
        {
            context.write.armies = [{ ...row, finishTime: activity.dueAt }];

            return { itemId: sfs.string(armyId), allId: sfs.string(armyId) };
        }

        if (action === TimedActivityAction.Cancel)
        {
            context.refund(data);
            context.write.armies = [{ ...row, train: 0, finishTime: 0n }];

            return { resource: sfs.object(context.resource()) };
        }

        return this.complete(context, row, num(row, "train"));
    };
}
