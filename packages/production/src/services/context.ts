import type { ReconnectProgressState, ReconnectProgressWrite } from "@opencok/contracts/reconnect";
import type { ProductionRate } from "@opencok/production/contracts/production";
import type { ProductionEffectProviders, ProductionWorldDecoder } from "../contracts/runtime.ts";
import { long, num, type Row } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
import { MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import { reconnectSettlementTimes } from "@opencok/rules/reconnect-timeline";
import { reconnectUpkeep } from "@opencok/rules/reconnect-upkeep";
import { settleReconnectFood } from "@opencok/rules/reconnect-resources";
import { reconnectWeaknessPlan } from "@opencok/rules/reconnect-weakness";
import { playerGameEffect } from "@opencok/rules/power-resolver";
import { worldPowerEffects } from "@opencok/rules/power-world";
import { serverFeature } from "@opencok/rules/power-context";
import { productionScale } from "@opencok/production/rules/settlement";
import { generalSkillPoints } from "@opencok/hero/services/general-power";
import { allianceScienceRule } from "@opencok/rules/alliance-science";
import { resourceGeneralBuildingEffect } from "@opencok/hero/services/general-building-effects";

export async function productionContext(
    state: ReconnectProgressState,
    rules: Rules,
    now: bigint,
    services: ProductionEffectProviders,
    decodeWorldPowerEffects: ProductionWorldDecoder,
)
{
    if (!services.worldPowerEffects)
    {
        throw new Error("Missing production world effects");
    }

    const world = decodeWorldPowerEffects(await services.worldPowerEffects(rules.kingdomId));
    const emperor = state.effects.throneRewards.length
        ? await services.emperorVersion?.(rules.kingdomId)
        : undefined;
    const abilities = generalSkillPoints(state.generals);
    const context = {
        kingdomId: rules.kingdomId,
        version: MOBILE_CLIENT_VERSION,
        now: Number(now),
    };
    const resolveAt = (at: bigint) => {
        const current = { ...context, now: Number(at) },
            snapshot = {
                ...state.effects,
                states: state.effects.states.filter((row) => long(row, "startTime") <= at),
                allianceSciences: state.effects.allianceSciences.map((row) => {
                    const pending = state.allianceResearch?.find(
                        (queue) => num(queue, "scienceId") === num(row, "scienceId"),
                    );

                    if (!pending || at < long(pending, "startTime") + long(pending, "needTime"))
                    {
                        return row;
                    }

                    allianceScienceRule(rules, num(row, "scienceId"), num(row, "level") + 1);

                    return { ...row, level: num(row, "level") + 1 };
                }),
            };
        const effects = worldPowerEffects(world, rules, current);

        return (id: Parameters<typeof playerGameEffect>[6]) =>
            playerGameEffect(snapshot, rules, current, abilities, effects, emperor, id);
    };
    const times = reconnectSettlementTimes(state, world, rules, context);
    let resource: Row = { ...state.resource },
        armies = state.armies,
        weakness = state.weakness,
        weaknessTime = long(state.glory ?? {}, "weaknessTime"),
        starvingMillis = 0n;
    const losses = new Map<string, { weakened: number; dead: number; }>();

    for (let index = 1; index < times.length; index++)
    {
        const at = times[index - 1]!,
            resolve = resolveAt(at);
        const upkeep = reconnectUpkeep(
            armies,
            state.buildings,
            rules,
            { ...context, now: Number(at) },
            {
                specialServer: serverFeature(rules, "araf_mode", context),
                consumptionRatio: 1,
                effect: resolve,
                cellarGeneralEffect: () =>
                    resourceGeneralBuildingEffect(
                        state,
                        rules,
                        { ...context, now: Number(at) },
                        72,
                        resolve,
                        () => at,
                        404000,
                    ),
            },
        );
        const settled = settleReconnectFood(resource, times[index]!, upkeep.rates, upkeep.options);
        resource = {
            ...resource,
            food: settled.food,
            foodbind: settled.foodbind,
            lastUpdateTime: settled.lastUpdateTime,
        };
        starvingMillis += settled.starvingMillis;

        if (upkeep.weakness && settled.starvingMillis > 0n)
        {
            const result = reconnectWeaknessPlan(
                armies,
                weakness,
                settled.starvingMillis,
                weaknessTime,
                upkeep.capacity,
                rules,
            );
            armies = result.armies;
            weakness = result.weakness;
            weaknessTime = result.weaknessTime;

            for (const loss of result.losses)
            {
                const previous = losses.get(loss.armyId) ?? { weakened: 0, dead: 0 };
                losses.set(loss.armyId, {
                    weakened: previous.weakened + loss.weakened,
                    dead: previous.dead + loss.dead,
                });
            }
        }
    }

    const changed = armies.filter((row) => {
        const before = state.armies.find((original) => original.armyId === row.armyId)!;

        return (
            num(row, "free") !== num(before, "free")
            || num(row, "defence") !== num(before, "defence")
        );
    });
    const write: ReconnectProgressWrite = {
        resource: {
            food: long(resource, "food"),
            foodbind: long(resource, "foodbind"),
            lastUpdateTime: long(resource, "lastUpdateTime"),
            starvingMillis,
        },
        armies: changed.map((row) => ({
            armyId: String(row.armyId),
            free: num(row, "free"),
            defence: num(row, "defence"),
        })),
        weakness: weakness
            .filter((row) => {
                const old = state.weakness.find((value) => value.armyId === row.armyId);

                return (
                    !old
                    || num(row, "weakness") !== num(old, "weakness")
                    || num(row, "marchWeakness") !== num(old, "marchWeakness")
                );
            })
            .map((row) => ({
                armyId: String(row.armyId),
                weakness: num(row, "weakness"),
                marchWeakness: num(row, "marchWeakness"),
                heal: num(row, "heal"),
                finishTime: long(row, "finishTime"),
            })),
        weaknessTime: weaknessTime !== long(state.glory ?? {}, "weaknessTime")
            ? weaknessTime
            : undefined,
        troopChanges: changed.map((row) => {
            const old = state.armies.find((value) => value.armyId === row.armyId)!;

            return {
                armyId: String(row.armyId),
                freeBefore: num(old, "free"),
                freeAfter: num(row, "free"),
                defenceBefore: num(old, "defence"),
                defenceAfter: num(row, "defence"),
                ...(losses.get(String(row.armyId)) ?? { weakened: 0, dead: 0 }),
            };
        }),
        tasks: { inserts: [], updates: [] },
        generalResets: [],
        skillResets: [],
        skillCooldownResets: [],
        buildingRefreshes: [],
        mail: [],
    };
    const rates = async (building: Row, from: bigint): Promise<readonly ProductionRate[]> => {
        const definition = rules.building(
            String(building.itemId),
            num(building, "level"),
            num(building, "star"),
            num(building, "progress"),
        );
        const resourceId = definition.effects?.productionResourceId,
            base = definition.effects?.productionPerHour,
            capacity = definition.effects?.productionCapacity ?? 4000;

        if (resourceId === undefined || resourceId < 0 || resourceId > 3 || base === undefined)
        {
            throw new Error("Missing production definition");
        }

        const horizon = BigInt(Number.MAX_SAFE_INTEGER - 1);
        const cuts = new Set(
            reconnectSettlementTimes(
                { ...state, resource: { ...state.resource, lastUpdateTime: from } },
                world,
                rules,
                { ...context, now: Number(horizon) },
            ),
        );
        cuts.delete(horizon);
        const boostEnd = long(building, "effectTime");

        if (boostEnd > from)
        {
            cuts.add(boostEnd);
        }

        const result: ProductionRate[] = [];

        for (const at of [...cuts].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)))
        {
            const resolve = resolveAt(at),
                instant = { ...context, now: Number(at) },
                effect = resolve((50 + resourceId) as 50 | 51 | 52 | 53)
                    + resourceGeneralBuildingEffect(
                        state,
                        rules,
                        instant,
                        50 + resourceId,
                        resolve,
                        () => at,
                        num(building, "itemId"),
                        String(building.uuid),
                    );
            const bonus = boostEnd > at ? Number(rules.items.get("building_base")?.k7) : 0;

            if (!Number.isFinite(effect) || !Number.isFinite(bonus))
            {
                throw new Error("Invalid production effect");
            }

            const rate = base * Math.max(0, 1 + effect / 100) * Math.max(0, 1 + bonus / 100);
            const cap = capacity * (1 + Math.max(0, effect) / 100) * (1 + Math.max(0, bonus) / 100);

            if (
                !Number.isSafeInteger(Math.round(rate * Number(productionScale)))
                || !Number.isSafeInteger(Math.floor(cap))
            )
            {
                throw new Error("Production rate overflow");
            }

            const next = {
                at,
                perHour: BigInt(Math.round(rate * Number(productionScale))),
                capacity: BigInt(Math.floor(cap)),
            };
            const previous = result.at(-1);

            if (
                !previous || previous.perHour !== next.perHour
                || previous.capacity !== next.capacity
            )
            {
                result.push(next);
            }
        }

        if (result.length > 256)
        {
            throw new Error("Production rate schedule exceeds bound");
        }

        return result;
    };

    return { write, rates };
}
