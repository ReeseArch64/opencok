import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { randomInt, randomUUID } from "node:crypto";
import type { PreparedActivity } from "@opencok/base/contracts/activity";
import type {
    ConstructionCatalog,
    ConstructionContext,
    ConstructionRecord as Row,
} from "../contracts/construction";
import type { ConstructionRuntime } from "../contracts/construction-runtime";
import { sfs, str, int, encode, type Fields } from "@opencok/messages/sfs";
import { buildingDisplayParameters } from "../mappings/display";
import { buildingQueueType as cityQueueType } from "../rules/queues";
import { ConstructionCommand } from "../enums/command";
import { ConstructionCompletion } from "./completion";
import { ConstructionPolicy } from "../rules/construction";

export class ConstructionCommands<
    TCatalog extends ConstructionCatalog,
    TContext extends ConstructionContext<TCatalog>,
>
{
    public constructor(
        private readonly runtime: ConstructionRuntime<TCatalog, TContext>,
        private readonly completion: ConstructionCompletion<TCatalog, TContext>,
        private readonly policy: ConstructionPolicy<TCatalog, TContext>,
    )
    {}

    private noAssociatedActivity(context: TContext, row: Row)
    {
        const { text, num } = this.runtime;

        const type = cityQueueType(num(row, "itemId"));

        if (
            type !== undefined
            && context.state.queues.some((queue) =>
                num(queue, "type") === type && text(queue, "itemId")
            )
        )
        {
            throw new GameError(errors.occupied, "city_progression");
        }
    }

    public readonly prepare = async (
        context: TContext,
        command: string,
        params: Fields,
    ): Promise<PreparedActivity> => {
        const {
            text,
            num,
            cityInteger,
            cityDuration,
            reducedCityCost,
            cityAssets,
            building,
            previewRewards,
            rewardPreviewArray,
            recordExpeditionScore,
            cityUnlockCount,
        } = this.runtime;

        if (command === ConstructionCommand.Unlock)
        {
            const request = str(params, "M__REQUEST_ID__H");

            if (request !== "info" && request !== "glory")
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            command = `buildingUnlock.${request}`;
        }

        if (command === ConstructionCommand.UnlockMiracle)
        {
            const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000);

            if (!castle || num(castle, "level") < 30)
            {
                throw new GameError(errors.troopBuilding, "city_progression");
            }

            if (context.state.buildings.some((row) => num(row, "itemId") === 422000))
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            const position = context.rules.positions.get("9955");

            if (
                !position?.building
                || !position.position
                || context.state.buildings.some((row) =>
                    num(row, "pos") === Number(position.position)
                )
            )
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            const row: Row = {
                uuid: randomUUID(),
                uid: context.owner,
                itemId: cityInteger(position.building),
                pos: cityInteger(position.position),
                level: 30,
                star: 0,
                progress: 0,
                opType: 0,
                refreshTime: context.now,
                reward: 0,
                unlockFlag: 0,
            };
            context.write.buildings = [row];
            const power = BigInt(this.completion.definition(context, row).power ?? 0);
            context.power(power, power);

            if (power > 0n)
            {
                recordExpeditionScore(context, 3, 1, cityInteger(power));
            }

            return { response: encode(building(row, context.rules, false, Number(context.now))) };
        }

        if (command === ConstructionCommand.Move)
        {
            const pos1 = cityInteger(int(params, "pos1")),
                pos2 = cityInteger(int(params, "pos2"));

            if (pos1 === pos2)
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            const from = context.state.buildings.find((row) => num(row, "pos") === pos1),
                to = context.state.buildings.find((row) => num(row, "pos") === pos2);

            if (!from)
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            context.idleBuilding(from);
            this.policy.position(context, pos2, text(from, "itemId"));

            if (to)
            {
                context.idleBuilding(to);
                this.policy.position(context, pos1, text(to, "itemId"));
            }

            const payment = int(params, "gold", 0);

            if (![0, 1].includes(payment))
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            context.spendItem("200032", 1, payment === 1);
            context.write.buildings = [
                { ...from, pos: pos2 },
                ...(to ? [{ ...to, pos: pos1 }] : []),
            ];

            return {
                response: encode({
                    count: sfs.int(context.economy.quantity?.("200032") ?? 0),
                    remainGold: sfs.long(context.balance("gold")),
                }),
            };
        }

        if (command === ConstructionCommand.UnlockInfo)
        {
            return {
                response: encode({
                    count: sfs.long(
                        cityUnlockCount(context, cityInteger(int(params, "type"))),
                    ),
                }),
            };
        }

        if (command === ConstructionCommand.UnlockGlory)
        {
            const row = context.ownBuilding(str(params, "uuid"));
            context.idleBuilding(row);
            const rule = this.completion.definition(context, row),
                conditions = rule.unlockConditions ?? [];

            if (!conditions.length || num(row, "unlockFlag") !== 0)
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            const allowed = conditions.every(
                (condition) =>
                    cityUnlockCount(context, condition.code)
                        >= BigInt(condition.value ?? 0),
            );

            if (!allowed)
            {
                if (int(params, "cost", 0) !== 1 || !rule.unlockPayment)
                {
                    throw new GameError(errors.resource, "city_progression");
                }

                const payment = rule.unlockPayment;

                if (payment.paymentId <= 1)
                {
                    context.economy.gold(
                        -payment.amount
                            * BigInt(payment.paymentId === 1 ? num(row, "costUnlockTimes") + 1 : 1),
                    );
                }
                else
                {
                    context.spendItem(String(payment.paymentId), cityInteger(payment.amount));
                }
            }

            const updated = {
                ...row,
                unlockFlag: 1,
                costUnlockTimes: num(row, "costUnlockTimes") + (allowed ? 0 : 1),
            };
            context.write.buildings = [updated];

            return {
                response: encode({
                    ...building(updated, context.rules, false, Number(context.now)),
                    remainGold: sfs.long(context.balance("gold")),
                }),
            };
        }

        if (command === ConstructionCommand.Reward)
        {
            const row = context.state.buildings.find((value) => num(value, "itemId") === 400000);

            if (!row || num(row, "reward") !== 1)
            {
                throw new GameError(errors.rewardClaimed, "city_progression");
            }

            const rewardId = buildingDisplayParameters(this.completion.definition(context, row))[3];

            if (!rewardId || !context.rules.reconnect.rewards?.has(rewardId))
            {
                throw new GameError(errors.unsupported, "city_progression");
            }

            const rewards = previewRewards(
                rewardId,
                context.rules,
                {
                    kingdomId: context.rules.kingdomId,
                    version: "12.06.0",
                    now: Number(context.now),
                },
                randomInt,
            );

            for (const reward of rewards)
            {
                if (reward.kind === "item" && reward.type === 7)
                {
                    context.economy.item(reward.id, cityInteger(reward.count, 1));
                }
                else if (reward.kind === "count" && reward.type === 5)
                {
                    context.economy.gold(BigInt(cityInteger(reward.value)));
                }
                else if (reward.kind === "count" && reward.type === 6)
                {
                    context.experience(cityInteger(reward.value));
                }
                else if (reward.kind === "count" && reward.type >= 0 && reward.type <= 4)
                {
                    context.economy.resource(
                        cityAssets[reward.type]!,
                        BigInt(cityInteger(reward.value)),
                    );
                }
                else
                {
                    throw new GameError(errors.unsupported, "city_progression");
                }
            }

            context.write.buildings = [{ ...row, reward: 0 }];

            return { response: encode({ reward: rewardPreviewArray(rewards) }) };
        }

        const creating = command === ConstructionCommand.Create;
        const row: Row = creating
            ? {
                uuid: randomUUID(),
                uid: context.owner,
                itemId: cityInteger(str(params, "itemId")),
                pos: cityInteger(int(params, "pos")),
                level: 0,
                star: 0,
                progress: 0,
                opType: 0,
                refreshTime: context.now,
                updateTime: 0n,
                reward: 0,
                effectTime: 0n,
                unlockFlag: 0,
                costUnlockTimes: 0,
                putId: "",
            }
            : context.ownBuilding(str(params, "uuid"));
        context.idleBuilding(row);
        const current = this.completion.definition(context, row);

        if (creating)
        {
            this.policy.position(context, num(row, "pos"), text(row, "itemId"));

            if (
                context.state.buildings.some((building) => num(building, "pos") === num(row, "pos"))
            )
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            if (
                context.state.buildings.length >= 256
                || (current.maxInstances
                    && context.state.buildings.filter((building) => building.itemId === row.itemId)
                            .length
                        >= current.maxInstances)
            )
            {
                throw new GameError(errors.invalid, "city_progression");
            }
        }
        else
        {
            this.noAssociatedActivity(context, row);
        }

        if (command === ConstructionCommand.Destroy)
        {
            if (current.maxInstances === 1 || num(row, "level") === 0)
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            const durationMs = BigInt(cityInteger(current.demolitionSeconds ?? 0, 1)) * 1000n;
            context.write.buildings = [{ ...row, opType: 2 }];

            return {
                type: 0,
                itemId: text(row, "uuid"),
                durationMs,
                data: context.data("destroy"),
                response: encode({}),
            };
        }

        this.policy.requirements(context, current);

        if (
            (current.unlockConditions?.length ?? 0) > 0
            && num(row, "star") > 0
            && num(row, "unlockFlag") !== 1
        )
        {
            throw new GameError(errors.locked, "city_progression");
        }

        const next = context.rules.nextBuilding(
            text(row, "itemId"),
            num(row, "level"),
            num(row, "star"),
            num(row, "progress"),
            Number(context.now),
        );

        if (
            next.level === num(row, "level")
            && next.starLevel === num(row, "star")
            && next.starProgress === num(row, "progress")
        )
        {
            throw new GameError(errors.buildingMax, "city_progression");
        }

        const payment = int(params, "gold", 0);

        if (![0, 1, 2].includes(payment))
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        const reduction =
            context.effect(num(row, "level") < 19 ? 772 : num(row, "level") < 30 ? 2078 : 773)
                * 3600
            + context.effect(2145);
        const durationMs = cityDuration(
            current.constructionSeconds ?? 0,
            context.effect(68)
                + context.generalEffect(68, num(row, "itemId"), text(row, "uuid"))
                + context.effect(302)
                + context.effect(2144)
                + context.effect(2190),
            reduction,
        );
        const costs: Partial<Record<(typeof cityAssets)[number], bigint>> = {};

        for (const asset of cityAssets)
        {
            costs[asset] = reducedCityCost(
                current.costs?.[asset] ?? 0n,
                asset === "silver"
                    ? 0
                    : context.effect(
                        ({ wood: 752, food: 753, iron: 754, stone: 755 } as const)[asset],
                    ),
                context.effect(454) + context.effect(2143),
            );
        }

        context.checkPower(BigInt(next.power ?? 0) - BigInt(current.power ?? 0));
        context.spend(costs, payment !== 0);

        for (const item of current.requiredItems ?? [])
        {
            context.spendItem(
                String(item.itemId),
                cityInteger(item.quantity ?? 1n),
                payment !== 0 && item.itemId !== 200065,
            );
        }

        const data = context.data("upgrade", {
            target: { level: next.level, star: next.starLevel, progress: next.starProgress },
        });

        if (payment === 1)
        {
            context.accelerate(durationMs);

            return { response: encode(this.completion.complete(context, row, data)) };
        }

        const pending = { ...row, opType: 1 };
        context.write.buildings = [pending];
        this.completion.makeDomainQueue(context, pending);

        return {
            type: 0,
            itemId: text(row, "uuid"),
            durationMs,
            data,
            response: encode(building(pending, context.rules, true, Number(context.now))),
            responseKind: "queue",
        };
    };
}
