import type { ReconnectResearchProjection } from "@opencok/contracts/reconnect";
import { woundedTroops, fortification } from "@opencok/mappings/military";
import { randomInt, randomUUID } from "node:crypto";
import type { ReconnectProgressState, ReconnectProgressWrite } from "@opencok/contracts/reconnect";
import type { GameServices } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import type { RewardRandom } from "@opencok/contracts/rewards";
import type { Rules } from "@opencok/rules/game";
import type { RuleContext } from "@opencok/rules/availability";
import { reconnectGeneralRepairs } from "@opencok/hero/rules/profile-generals";
import { reconnectUpkeep } from "@opencok/rules/reconnect-upkeep";
import { settleReconnectFood } from "@opencok/rules/reconnect-resources";
import { reconnectWeaknessPlan } from "@opencok/rules/reconnect-weakness";
import { reconnectSettlementTimes } from "@opencok/rules/reconnect-timeline";
import { reconnectTaskPlan } from "@opencok/rules/reconnect-tasks";
import {
    reconnectContainsBuildings,
    reconnectResourceOutput,
    reconnectTaskInitialCount,
} from "@opencok/rules/reconnect-task-counts";
import { reconnectBuildingRefresh } from "@opencok/rules/reconnect-refresh";
import { reconnectMail } from "@opencok/rules/reconnect-mail";
import { friendshipMineView } from "@opencok/rules/reconnect-mine";
import { newGeneralPrestigeLevel } from "@opencok/hero/rules/new-general-prestige";
import { calculatePlayerPower } from "@opencok/rules/power";
import { playerGameEffect } from "@opencok/rules/power-resolver";
import { worldPowerEffects } from "@opencok/rules/power-world";
import { cn1RewardRatio, type Cn1SessionState } from "@opencok/rules/cn1-rewards";
import { javaDecimal } from "@opencok/rules/java-integer";
import {
    reconnectArmies,
    reconnectArmy,
    reconnectBalances,
    reconnectResources,
    reconnectTasks,
    reconnectQueues,
    reconnectMine,
} from "@opencok/mappings/reconnect";
import { avatarMailPush } from "@opencok/mappings/avatar-mail";
import { encode, extension, sfs, type Fields } from "@opencok/messages/sfs";
import { MAX_FRAME } from "@opencok/messages/frame";
import { decodeGeneralAbilities } from "@opencok/hero/services/profile-generals";
import { decodeWorldPowerEffects, powerContext } from "./power.ts";
import { generalSkillPoints } from "@opencok/hero/services/general-power";
import { resourceGeneralBuildingEffect } from "@opencok/hero/services/general-building-effects";
import { readResourceOwnerLoadEffects } from "./world-resource-owner-effects.ts";
import { reconnectOwnGenerals } from "@opencok/hero/services/reconnect-generals";
import { projectReconnectMarches } from "./reconnect-marches.ts";

const int = (value: unknown) => Number(javaDecimal(String(value ?? 0), 32));

const long = (value: unknown) => javaDecimal(String(value ?? 0), 64);

export interface ReconnectResult
{
    body: Fields;
    pushes: { command: string; body: Fields; }[];
}

export function validateReconnectResult(result: ReconnectResult, command: string): void
{
    for (const packet of [{ command, body: result.body }, ...result.pushes])
    {
        if (encode(extension(packet.command, packet.body)).length > MAX_FRAME)
        {
            throw new Error("Oversized reconnect response");
        }
    }
}

export async function planReconnectProgress(
    state: ReconnectProgressState,
    rules: Rules,
    context: RuleContext,
    services: Pick<GameServices, "worldPowerEffects" | "emperorVersion" | "expeditionStage">,
    environment: {
        research: ReconnectResearchProjection;
        specialServer: boolean;
        cn1: Cn1SessionState | null;
        random?: RewardRandom;
        stem?: () => string;
        resolveMailReward?: (reward: string, owner: string) => string | null;
    },
): Promise<{ write: ReconnectProgressWrite; result: ReconnectResult; }>
{
    const uid = String(state.profile.uid);
    const now = BigInt(context.now);

    if (
        !Number.isSafeInteger(context.now)
        || context.now < 0
        || state.profile.serverId !== context.kingdomId
        || !state.mine
        || !rules.reconnect.quests
        || !services.worldPowerEffects
    )
    {
        throw new Error("Incomplete reconnect context");
    }

    const random = environment.random ?? randomInt;
    const repairs = reconnectGeneralRepairs(
        state.generals,
        state.skills,
        new Map(
            state.generals.map((
                row,
            ) => [String(row.uuid), decodeGeneralAbilities(row.ability, false)]),
        ),
        uid,
        rules,
        context.now,
    );
    const generals = state.generals.map((row) =>
        repairs.generalResets.includes(String(row.uuid)) ? { ...row, ability: null } : row
    );
    const effects = { ...state.effects, generals };
    const abilities = generalSkillPoints(generals);
    const worldRecords = decodeWorldPowerEffects(
        await services.worldPowerEffects(context.kingdomId),
    );
    const emperor = effects.throneRewards.length
        ? await services.emperorVersion?.(context.kingdomId)
        : undefined;
    const resolveAt = (at: bigint) => {
        const instant = { ...context, now: Number(at) };
        const snapshot = {
            ...effects,
            states: effects.states.filter((row) => long(row.startTime) <= at),
        };
        const world = worldPowerEffects(worldRecords, rules, instant);

        return (effect: Parameters<typeof playerGameEffect>[6]) =>
            playerGameEffect(snapshot, rules, instant, abilities, world, emperor, effect);
    };
    const consumptionRatio = state.profile.pf === "cn1"
        ? cn1RewardRatio(environment.cn1, rules, context)
        : 1;
    let armies = state.armies;
    let weakness = state.weakness;
    let weaknessTime = long(state.glory?.weaknessTime);
    let writeWeaknessTime: bigint | undefined;
    let resource: Row = { ...state.resource };
    let starvingMillis = 0n;
    let weakened = 0,
        dead = 0;
    const losses = new Map<string, { armyId: string; weakened: number; dead: number; }>();
    const upkeepAt = (at: bigint) => {
        const resolve = resolveAt(at);

        return reconnectUpkeep(
            armies,
            state.buildings,
            rules,
            { ...context, now: Number(at) },
            {
                specialServer: environment.specialServer,
                consumptionRatio,
                effect: resolve,
                cellarGeneralEffect: () =>
                    resourceGeneralBuildingEffect(
                        { ...state, effects },
                        rules,
                        { ...context, now: Number(at) },
                        72,
                        resolve,
                        () => at,
                        404000,
                    ),
            },
        );
    };
    const times = reconnectSettlementTimes(state, worldRecords, rules, context);

    for (let index = 1; index < times.length; index++)
    {
        const upkeep = upkeepAt(times[index - 1]!);

        while (
            index < times.length - 1
            && JSON.stringify(upkeepAt(times[index]!)) === JSON.stringify(upkeep)
        )
        {
            index++;
        }

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
            const weak = reconnectWeaknessPlan(
                armies,
                weakness,
                settled.starvingMillis,
                weaknessTime,
                upkeep.capacity,
                rules,
            );
            armies = weak.armies;
            weakness = weak.weakness;
            weaknessTime = weak.weaknessTime;
            writeWeaknessTime = weaknessTime;
            weakened = (weakened + weak.weakened) | 0;
            dead = (dead + weak.dead) | 0;

            for (const loss of weak.losses)
            {
                const prior = losses.get(loss.armyId)
                    ?? { armyId: loss.armyId, weakened: 0, dead: 0 };
                losses.set(loss.armyId, {
                    armyId: loss.armyId,
                    weakened: (prior.weakened + loss.weakened) | 0,
                    dead: (prior.dead + loss.dead) | 0,
                });
            }
        }
    }

    const resolve = resolveAt(now);
    let playerInfo: Row | undefined;
    const countState = {
        profile: state.profile,
        buildings: state.buildings,
        armies,
        equipment: state.equipment,
        scienceLevels: new Map(effects.sciences.map((row) => [String(row.itemId), int(row.level)])),
        resourceOutput: reconnectResourceOutput(state.buildings, rules),
        get playerInfo()
        {
            if (!playerInfo)
            {
                const power = calculatePlayerPower(
                    {
                        ...effects,
                        profile: state.profile,
                        generals,
                        armies,
                        walls: state.walls,
                        buildings: state.buildings,
                        statistics: state.playerInfo,
                        knight: state.knight,
                        items: state.items,
                    },
                    rules,
                    powerContext(rules, state.knight, context, resolve(487)),
                );
                playerInfo = { ...power, power: power.total };
            }

            return playerInfo;
        },
        get prestigeLevel()
        {
            return newGeneralPrestigeLevel(
                int(state.profile.civilizationType),
                effects.prestige.map((row) => ({
                    civilizationType: int(row.civilizationType),
                    prestigeValue: long(row.prestigeValue),
                })),
                rules,
            );
        },
        civilizationCastle: state.civilizationCastle,
    };
    const platform = String(state.profile.pf ?? "");
    const tasks = reconnectTaskPlan(state.tasks, rules.reconnect.quests, {
        platform,
        registrationPlatform: state.registrationPlatform,
        chinaPlatform: platform === "tencent"
            || (platform.length > 3 && platform.startsWith("cn_")),
        level: int(state.profile.level),
        castleLevel: int(state.buildings.find((row) => int(row.itemId) === 400000)?.level),
        containsBuildings: (requirements) =>
            reconnectContainsBuildings(state.buildings, requirements),
        initialCount: (rule) => reconnectTaskInitialCount(rule, countState, rules),
        random,
    });
    const taskView = reconnectTasks(tasks, rules, context, random);
    const refresh = tasks.pushes.some(
            (push) =>
                push.command === "push.task.complete"
                && push.tasks.some((task) => task.id === "2102501"),
        )
        ? reconnectBuildingRefresh(state.buildings, rules, now, resolve)
        : undefined;
    const changedArmies = armies.filter((row) => {
        const before = state.armies.find((original) => original.armyId === row.armyId)!;

        return int(row.free) !== int(before.free) || int(row.defence) !== int(before.defence);
    });
    const changedWeakness = weakness.filter((row) => {
        const before = state.weakness.find((original) => original.armyId === row.armyId);

        return (
            !before
            || int(row.weakness) !== int(before.weakness)
            || int(row.marchWeakness) !== int(before.marchWeakness)
        );
    });
    const mail = reconnectMail(
        uid,
        now,
        repairs.generalResets,
        { weakened, dead },
        rules,
        environment.stem ?? (() => randomUUID().replaceAll("-", "")),
        environment.resolveMailReward
            ?? (() => {
                throw new Error("Unresolved reconnect mail reward");
            }),
    );
    const write: ReconnectProgressWrite = {
        resource: {
            food: long(resource.food),
            foodbind: long(resource.foodbind),
            lastUpdateTime: long(resource.lastUpdateTime),
            starvingMillis,
        },
        armies: changedArmies.map((row) => ({
            armyId: String(row.armyId),
            free: int(row.free),
            defence: int(row.defence),
        })),
        weakness: changedWeakness.map((row) => ({
            armyId: String(row.armyId),
            weakness: int(row.weakness),
            marchWeakness: int(row.marchWeakness),
            heal: int(row.heal),
            finishTime: long(row.finishTime),
        })),
        weaknessTime: writeWeaknessTime,
        troopChanges: changedArmies.map((row) => {
            const before = state.armies.find((original) => original.armyId === row.armyId)!;
            const loss = losses.get(String(row.armyId));

            if (!loss)
            {
                throw new Error("Unaccounted reconnect loss");
            }

            return {
                ...loss,
                freeBefore: int(before.free),
                freeAfter: int(row.free),
                defenceBefore: int(before.defence),
                defenceAfter: int(row.defence),
            };
        }),
        tasks,
        ...repairs,
        buildingRefreshes: refresh?.writes ?? [],
        mail,
    };
    const needsLoad = state.marches.rows.some(
        (row) =>
            row.ownerUid === uid
            && int(row.state) === 1
            && [3, 18, 37, 60, 63].includes(int(row.targetType)),
    );
    const load = needsLoad
        ? await readResourceOwnerLoadEffects(
            { ...state, effects },
            rules,
            context,
            services,
            () => now,
        )
        : undefined;
    const result: ReconnectResult = {
        body: {
            ...projectReconnectMarches(state.marches, uid, rules, context, load),
            ...reconnectArmies(armies),
            ...(state.hospital
                ? {
                    hospital: sfs.array(
                        state.hospital.map((row) => sfs.object(woundedTroops(row))),
                    ),
                }
                : {}),
            ...(state.walls.length
                ? {
                    fort: sfs.array(
                        state.walls.map((row) => sfs.object(fortification(row, rules))),
                    ),
                }
                : {}),
            ...reconnectOwnGenerals({ ...state, generals }, rules, context.now),
            ...reconnectResources(resource, upkeepAt(now).showBound),
            ...reconnectQueues(state.queues, state.buildings, state.equipment, rules, context.now),
            ...taskView.fields,
            ...reconnectMine(friendshipMineView(state.mine, rules)),
            ...reconnectBalances(state.profile),
            ...(rules.power.sciences?.size
                ? { science: environment.research(effects.sciences, state.queues) }
                : {}),
        },
        pushes: taskView.pushes.map((push) => ({ command: push.command, body: push.fields })),
    };

    if (changedArmies.length)
    {
        result.pushes.push({
            command: "army.info",
            body: {
                soldiers: sfs.array(changedArmies.map((row) => sfs.object(reconnectArmy(row)))),
            },
        });
    }

    if (changedWeakness.length)
    {
        result.pushes.push({
            command: "push.weakness.receive",
            body: {
                weakling: sfs.array(
                    changedWeakness.map((row) =>
                        sfs.object({
                            id: sfs.string(String(row.armyId)),
                            weakness: sfs.int(int(row.weakness)),
                            marchWeakness: sfs.int(int(row.marchWeakness)),
                            ...(long(row.finishTime) > now
                                ? {
                                    heal: sfs.int(int(row.heal)),
                                    finish: sfs.long(long(row.finishTime)),
                                }
                                : {}),
                        })
                    ),
                ),
            },
        });
    }

    if (refresh)
    {
        result.pushes.push({
            command: "resource.time.refresh",
            body: {
                refreshBuildings: sfs.array(
                    refresh.views.map((row) =>
                        sfs.object({
                            itemId: sfs.string(row.itemId),
                            pos: sfs.int(row.pos),
                            refreshTime: sfs.long(row.refreshTime),
                        })
                    ),
                ),
            },
        });
    }

    const fullMail = rules.items.get("chat_switch")?.k3?.split("|").includes("1") ?? false;

    for (const message of mail)
    {
        result.pushes.push({
            command: "push.mail",
            body: { ...avatarMailPush(message, fullMail), itemIdFlag: sfs.int(message.itemIdFlag) },
        });
    }

    validateReconnectResult(result, "user.lv");

    return { write, result };
}
