import { CityCommandDomain } from "./city-command-domain.ts";
import { worldMonsterMaximum } from "@opencok/rules/world-monster-detail";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { ruleAvailable } from "@opencok/rules/availability";
import { barbarianCurrentHP } from "@opencok/rules/world-scout";
import { worldBarbarianActor } from "@opencok/rules/world-monster-refresh";
import { randomInt } from "node:crypto";
import { num, text, long } from "@opencok/contracts/rows";
import { encode, int, str, sfs } from "@opencok/messages/sfs";
import { cityInteger } from "@opencok/rules/city-progression";
import { worldMutationFailure } from "@opencok/rules/world-march-runtime";
import { worldItemTarget, worldItemFree, worldItemResource } from "@opencok/rules/world-use";
import {
    worldMonsterProp,
    reusableWorldMonster,
    worldMonsterConfiguration,
    chooseWorldMonsterCells,
    spawnWorldMonsterCells,
} from "@opencok/rules/world-monsters";
import { worldItemUsed } from "@opencok/mappings/world-use";
import type { CityDomain } from "./city-domain.ts";

export const worldUseCommands = [
    "world.use",
    "create.boss",
    "world.get.monster",
    "world.get.barbarion",
    "get.act.boss.point",
];

export class WorldUseDomain extends CityCommandDomain
{
    public readonly commands: CityDomain["commands"];
    public readonly types: CityDomain["types"];
    public readonly prepare: CityDomain["prepare"];
    public readonly apply: CityDomain["apply"];

    public constructor(size: number, random = randomInt)
    {
        super();

        this.commands = worldUseCommands;

        this.types = [];

        this.prepare = async (context, command, params) => {
            if (command === "get.act.boss.point")
            {
                const world = context.state.worldMutation?.world,
                    reader = context.state.worldMonsters;

                if (!world || !reader || num(world, "worldId") !== 0)
                {
                    worldMutationFailure();
                }

                return {
                    response: encode({
                        id: sfs.int(await reader.nearestBoss(num(world, "pointId"))),
                    }),
                    event: null,
                };
            }

            if (command === "world.get.barbarion")
            {
                const world = context.state.worldMutation?.world,
                    reader = context.state.worldMonsters;

                if (
                    !world
                    || !reader
                    || num(world, "worldId") !== 0
                    || num(context.state.profile, "serverId") !== context.rules.kingdomId
                )
                {
                    worldMutationFailure();
                }

                if (
                    !ruleAvailable(context.rules.features.get("barbarion_switch"), {
                        kingdomId: context.rules.kingdomId,
                        version: text(context.state.profile, "appVersion"),
                        now: Number(context.now),
                    })
                )
                {
                    throw new GameError(errors.unsupported, "world_state");
                }

                const radius = cityInteger(context.rules.items.get("world_barbarion")?.k5, 1, 32),
                    minimum =
                        BigInt(cityInteger(context.rules.items.get("world_barbarion")?.k7 ?? 0))
                        * 60000n,
                    nearby = await reader.nearby(num(world, "pointId"), radius),
                    possible = nearby.filter(
                        (point) =>
                            num(point, "pointType") === 44
                            && text(point, "pointItem") === "4800000"
                            && long(point, "flushTime") - context.now > minimum,
                    ),
                    actors = new Map(
                        (await reader.barbarians(possible.map((point) => num(point, "id")))).map((
                            row,
                        ) => [
                            num(row, "pointId"),
                            row,
                        ]),
                    ),
                    living = possible.filter(
                        (point) =>
                            barbarianCurrentHP(
                                point,
                                actors.get(num(point, "id")),
                                context.rules,
                                context.now,
                            )
                                > 0,
                    );

                if (living.length)
                {
                    return {
                        response: encode({
                            pointId: sfs.int(num(living[random(living.length)]!, "id")),
                        }),
                        event: null,
                    };
                }

                const chosen = chooseWorldMonsterCells(
                    nearby.filter(worldItemFree),
                    true,
                    size,
                    random,
                );

                if (!chosen.length)
                {
                    return { response: encode({ pointId: sfs.int(-1) }), event: null };
                }

                const actor = worldBarbarianActor(context.rules, "4800000"),
                    points = chosen.map((point, index) => ({
                        ...point,
                        pointType: index ? 45 : 44,
                        pointItem: actor.configId,
                        flushTime: context.now + actor.duration,
                    }));
                (context.write.worldMutation ??= {}).points = points;
                context.write.worldMutation.barbarianActors = {
                    ...actor,
                    points: points.map((point) => num(point, "id")),
                };

                return {
                    response: encode({ pointId: sfs.int(num(points[0]!, "id")) }),
                    event: encode({
                        owner: sfs.string(context.owner),
                        origin: sfs.int(num(world, "pointId")),
                        points: sfs.array(
                            points.map((point) => sfs.object({ id: sfs.int(num(point, "id")) })),
                        ),
                    }),
                };
            }

            if (command === "world.get.monster")
            {
                const world = context.state.worldMutation?.world,
                    reader = context.state.worldMonsters;

                if (
                    !world
                    || !reader
                    || num(world, "worldId") !== 0
                    || num(context.state.profile, "serverId") !== context.rules.kingdomId
                )
                {
                    worldMutationFailure();
                }

                const config = context.rules.items.get("world_barbarion"),
                    radius = cityInteger(config?.k5, 1, 32),
                    target = config?.k8 ?? "",
                    minimum = BigInt(cityInteger(config?.k7 ?? 0)) * 60000n,
                    minutes = cityInteger(config?.k9, 1),
                    nearby = await reader.nearby(num(world, "pointId"), radius),
                    reusable = nearby.filter((row) =>
                        reusableWorldMonster(row, target, minimum, context.now, context.rules)
                    );
                const targetConfig = worldMonsterConfiguration(context.rules, target);

                if (reusable.length)
                {
                    return {
                        response: encode({
                            pointId: sfs.int(num(reusable[random(reusable.length)]!, "id")),
                        }),
                        event: null,
                    };
                }

                const free = nearby.filter(worldItemFree);

                if (!free.length)
                {
                    return { response: encode({ pointId: sfs.int(-1) }), event: null };
                }

                const selected = free[random(free.length)]!,
                    primary = {
                        ...selected,
                        pointType: 9,
                        pointItem: target,
                        flushTime: context.now + BigInt(minutes) * 60000n,
                    },
                    refill = await reader.area(
                        num(selected, "areaId"),
                        cityInteger(context.rules.items.get("monster")?.k1, 1, size),
                    );
                const points = [primary],
                    chosen = chooseWorldMonsterCells(refill, targetConfig.four, size, random);

                if (chosen.length)
                {
                    for (
                        const row of spawnWorldMonsterCells(
                            context.rules,
                            chosen,
                            target,
                            context.now,
                            86400,
                        )
                    )
                    {
                        if (num(row, "id") === num(primary, "id"))
                        {
                            points[0] = row;
                        }
                        else
                        {
                            points.push(row);
                        }
                    }
                }

                (context.write.worldMutation ??= {}).points = points;

                return {
                    response: encode({ pointId: sfs.int(num(primary, "id")) }),
                    event: encode({
                        owner: sfs.string(context.owner),
                        origin: sfs.int(num(primary, "id")),
                        points: sfs.array(
                            points.map((row) => sfs.object({ id: sfs.int(num(row, "id")) })),
                        ),
                    }),
                };
            }

            if (command === "create.boss")
            {
                const state = context.state.worldMutation,
                    reader = context.state.worldMonsters,
                    id = cityInteger(int(params, "pointIndex"), 1, size * size),
                    uuid = str(params, "uuid"),
                    item = context.economy.ownedItem?.(uuid);

                if (!state || !reader || !item || item.count < 1 || !context.economy.consumeItem)
                {
                    worldMutationFailure();
                }

                const rule = context.rules.goods.get(item.itemId),
                    source = state.points.find((point) => num(point, "id") === id);

                if (
                    !source
                    || !worldItemFree(source)
                    || rule?.type !== "16"
                    || (rule.type2 ?? "").length
                    || !rule.para1
                )
                {
                    worldMutationFailure();
                }

                const config = worldMonsterConfiguration(context.rules, rule.para1),
                    points = worldMonsterProp(
                        context.rules,
                        state.points,
                        id,
                        rule.para1,
                        size,
                        context.now,
                    );

                if (await reader.claimed(points.map((point) => num(point, "id"))))
                {
                    worldMutationFailure();
                }

                const main = points[0]!,
                    maximum = worldMonsterMaximum(
                        num(main, "pointType"),
                        rule.para1,
                        context.rules,
                    ),
                    created = {
                        pointIndex: sfs.int(id),
                        mmhp: sfs.int(maximum),
                        mchp: sfs.int(Math.max(0, maximum)),
                        monsterId: sfs.string(rule.para1),
                        rt: sfs.int(Number(BigInt.asIntN(32, long(main, "flushTime") / 1000n))),
                        st: sfs.int(Number(BigInt.asIntN(32, long(main, "startTime") / 1000n))),
                        isBoss: sfs.bool(config.boss),
                    };
                context.economy.consumeItem(uuid, 1);
                (context.write.worldMutation ??= {}).points = points;

                return {
                    response: encode({
                        itemId: sfs.string(item.itemId),
                        count: sfs.int(item.count - 1),
                        itemEffectObj: sfs.object({}),
                    }),
                    event: encode({
                        owner: sfs.string(context.owner),
                        origin: sfs.int(id),
                        points: sfs.array(
                            points.map((point) => sfs.object({ id: sfs.int(num(point, "id")) })),
                        ),
                        fieldCreated: sfs.object(created),
                    }),
                };
            }

            const state = context.state.worldMutation,
                id = cityInteger(int(params, "point"), 1, size * size),
                uuid = str(params, "itemUUid"),
                item = context.economy.ownedItem?.(uuid);

            if (!state || !item || item.count < 1 || !context.economy.consumeItem)
            {
                worldMutationFailure();
            }

            const row = state.points.find((row) => num(row, "id") === id),
                rule = context.rules.goods.get(item.itemId);

            if (!row || !worldItemFree(row) || !["11", "12"].includes(rule?.type ?? ""))
            {
                worldMutationFailure();
            }

            const target = worldItemTarget(rule!, random);

            if (rule!.type === "12")
            {
                const points = worldMonsterProp(
                    context.rules,
                    state.points,
                    id,
                    target,
                    size,
                    context.now,
                );

                if (
                    !context.state.worldMonsters
                    || (await context.state.worldMonsters.claimed(
                        points.map((point) => num(point, "id")),
                    ))
                )
                {
                    worldMutationFailure();
                }

                const response = worldItemUsed({ pointId: id, itemid: item.itemId });
                context.economy.consumeItem(uuid, 1);
                (context.write.worldMutation ??= {}).points = points;

                return {
                    response: encode(response),
                    event: encode({
                        owner: sfs.string(context.owner),
                        origin: sfs.int(id),
                        points: sfs.array(
                            points.map((row) => sfs.object({ id: sfs.int(num(row, "id")) })),
                        ),
                        used: sfs.object(response),
                    }),
                };
            }

            if (!context.state.worldMonsters || (await context.state.worldMonsters.claimed([id])))
            {
                worldMutationFailure();
            }

            const resource = worldItemResource(context.rules, target),
                point = {
                    ...row,
                    pointType: 3,
                    pointItem: String(resource.type),
                    resLevel: resource.level,
                    resInitValue: resource.amount,
                    resCostValue: 0,
                    flushTime: context.now + resource.duration,
                    flushFlag: 1,
                },
                response = worldItemUsed({ pointId: id, itemid: item.itemId });
            context.economy.consumeItem(uuid, 1);
            (context.write.worldMutation ??= {}).points = [point];

            return {
                response: encode(response),
                event: encode({
                    owner: sfs.string(context.owner),
                    origin: sfs.int(id),
                    points: sfs.array([sfs.object({ id: sfs.int(id) })]),
                    used: sfs.object(response),
                }),
            };
        };

        this.apply = async () => {
            worldMutationFailure();
        };
    }
}

export function createWorldUseDomain(size: number, random = randomInt): CityDomain
{
    return new WorldUseDomain(size, random);
}
