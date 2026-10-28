import { CityCommandDomain } from "./city-command-domain.ts";
import { randomInt } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { encode, sfs, int, str } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { campaignFailure } from "@opencok/rules/local-campaign";
import { eventTimestamp } from "@opencok/rules/local-events";
import { previewRewards } from "@opencok/rules/rewards";
import {
    monsterExchangeConfig,
    monsterExchangeHeader,
    readMonsterExchangeHeader,
    readMonsterExchangeOffers,
    monsterExchangeOffersText,
    selectMonsterExchangeOffers,
    monsterExchangeClaims,
    monsterExchangeBoundary,
    monsterExchangeLegacyMatches,
} from "@opencok/rules/monster-exchange";
import { monsterExchangeView } from "@opencok/mappings/monster-exchange";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { inventoryItem } from "@opencok/mappings/bootstrap";
import { pinProgressionReward, grantNativeProgressionReward } from "./progression-rewards";
import { CampaignPlanner, refreshCampaignGrants } from "./local-campaign";
import type { MonsterExchangeConfig } from "@opencok/contracts/monster-exchange";
import type { CityDomain } from "./city-domain.ts";

export class MonsterExchangeDomain extends CityCommandDomain
{
    public readonly commands: CityDomain["commands"];
    public readonly types: CityDomain["types"];
    public readonly prepare: CityDomain["prepare"];
    public readonly apply: CityDomain["apply"];

    public constructor(random: (maximum: number) => number = randomInt)
    {
        super();

        this.commands = ["act.exchange", "act.ex.reward", "act.ex.flush"];

        this.types = [];

        this.prepare = async (context, command, params) => {
            const rows = new Map(
                [...(context.state.monsterExchange ?? []), ...(context.write.monsterExchange ?? [])]
                    .map(
                        (row) => [num(row, "actId"), row],
                    ),
            );
            const write = (row: Row) => {
                rows.set(num(row, "actId"), row);
                context.write.monsterExchange = [
                    ...(context.write.monsterExchange ?? []).filter((old) =>
                        old.actId !== row.actId
                    ),
                    row,
                ];
            };
            const configs: MonsterExchangeConfig[] = [];

            for (const row of context.rules.power.activityPanels?.values() ?? [])
            {
                if (row.exchange !== "1")
                {
                    continue;
                }

                try
                {
                    configs.push(monsterExchangeConfig(row));
                }
                catch (error)
                {
                    if (!(error instanceof GameError))
                    {
                        throw error;
                    }
                }
            }

            const active = (id: string) => {
                cityInteger(id, 1);
                const row = context.rules.power.activityPanels?.get(id),
                    start = eventTimestamp(row?.start),
                    end = eventTimestamp(row?.end);

                if (
                    !row
                    || row.function_on === "0"
                    || (row.start !== undefined && (start === undefined || context.now < start))
                    || (row.end !== undefined && (end === undefined || context.now >= end))
                )
                {
                    return;
                }

                return configs.find((config) => config.id === id);
            };
            const legacy = (config: MonsterExchangeConfig) => {
                const old = rows.get(6);

                if (!old || text(old, "reserve_2"))
                {
                    return;
                }

                try
                {
                    const offers = readMonsterExchangeOffers(text(old, "rewards"));
                    monsterExchangeClaims(text(old, "receiveLevels"), offers.length);
                    cityInteger(old.level, 0, offers.length);
                    const candidates = configs.filter((candidate) =>
                        monsterExchangeLegacyMatches(offers, candidate)
                    );

                    if (candidates.length !== 1 || candidates[0]!.id !== config.id)
                    {
                        return;
                    }

                    write({ ...old, reserve_2: `monster-adopted:v1:${config.id}` });

                    return {
                        ...old,
                        actId: Number(config.id),
                        reserve_1: 6,
                        reserve_2: monsterExchangeHeader(config),
                    };
                }
                catch (error)
                {
                    if (!(error instanceof GameError))
                    {
                        throw error;
                    }
                }
            };
            const fresh = (config: MonsterExchangeConfig) => {
                const offers = selectMonsterExchangeOffers(config, random);

                if (offers.some((offer) => !context.rules.reconnect.rewards?.has(offer.reward)))
                {
                    campaignFailure();
                }

                return monsterExchangeOffersText(offers);
            };
            const load = (
                config: MonsterExchangeConfig,
                initialize: boolean,
                automatic: boolean,
            ) => {
                let saved = rows.get(Number(config.id));

                if (
                    saved
                    && (num(saved, "reserve_1") !== 6
                        || !text(saved, "reserve_2").startsWith("monster-exchange:v1:"))
                )
                {
                    campaignFailure();
                }

                if (!saved)
                {
                    saved = legacy(config);
                }

                if (!saved && !initialize)
                {
                    campaignFailure();
                }

                const row: Row = saved
                    ? { ...saved }
                    : {
                        uid: context.owner,
                        actId: Number(config.id),
                        level: 0,
                        rewards: fresh(config),
                        updateTime: context.now,
                        reserve_1: 6,
                        reserve_2: monsterExchangeHeader(config),
                        flushTimes: 0,
                        flushDate: context.now,
                        receiveLevels: "",
                    };

                if (!rows.has(Number(config.id)))
                {
                    write(row);
                }

                let header = readMonsterExchangeHeader(text(row, "reserve_2")),
                    offers = readMonsterExchangeOffers(text(row, "rewards"));
                const budgetAt = long(row, "flushDate") || long(row, "updateTime");

                if (budgetAt / 86400000n !== context.now / 86400000n)
                {
                    row.flushTimes = 0;
                }

                if (long(row, "flushDate") / 86400000n !== context.now / 86400000n)
                {
                    row.flushDate = context.now;
                    write(row);
                }

                if (automatic && context.now >= long(row, "updateTime") + header.interval)
                {
                    row.updateTime = monsterExchangeBoundary(
                        long(row, "updateTime"),
                        header.interval,
                        context.now,
                    );

                    if (config.interval !== header.interval)
                    {
                        row.updateTime = context.now;
                    }

                    row.rewards = fresh(config);
                    row.level = 0;
                    row.receiveLevels = "";
                    row.reserve_2 = monsterExchangeHeader(config);
                    offers = readMonsterExchangeOffers(text(row, "rewards"));
                    header = readMonsterExchangeHeader(text(row, "reserve_2"));
                    write(row);
                }

                if (header.token !== config.token && command !== "act.ex.flush")
                {
                    campaignFailure();
                }

                monsterExchangeClaims(text(row, "receiveLevels"), offers.length);

                return { row, offers, header };
            };
            const view = (row: Row) => {
                const header = readMonsterExchangeHeader(text(row, "reserve_2")),
                    offers = readMonsterExchangeOffers(text(row, "rewards"));

                if (offers.some((offer) => !context.rules.reconnect.rewards?.has(offer.reward)))
                {
                    campaignFailure();
                }

                return monsterExchangeView(
                    num(row, "level"),
                    cityAmount(long(row, "updateTime") + header.interval),
                    num(row, "flushTimes"),
                    offers.map((offer, index) => ({
                        rewardId: sfs.string(offer.reward),
                        level: sfs.int(index + 1),
                        needNum: sfs.int(offer.count),
                        color: sfs.int(offer.color),
                        reward: rewardPreviewArray(
                            previewRewards(
                                offer.reward,
                                context.rules,
                                {
                                    kingdomId: context.rules.kingdomId,
                                    version: "12.06.0",
                                    now: Number(context.now),
                                },
                                random,
                            ),
                        ),
                    })),
                    text(row, "receiveLevels"),
                );
            };

            if (command === "act.exchange")
            {
                const ids = str(params, "ids").split("|").filter(Boolean);

                if (ids.length > 64)
                {
                    campaignFailure();
                }

                return {
                    response: encode({
                        exchange: sfs.array(
                            [...new Set(ids)].flatMap((id) => {
                                const config = active(id);

                                if (!config)
                                {
                                    return [];
                                }

                                const { row } = load(config, true, true);

                                return [
                                    sfs.object({
                                        activity: sfs.object(view(row)),
                                        actId: sfs.string(id),
                                    }),
                                ];
                            }),
                        ),
                    }),
                    event: null,
                };
            }

            const id = str(params, command === "act.ex.flush" ? "actId" : "id"),
                config = active(id);

            if (!config)
            {
                campaignFailure();
            }

            const { row, offers, header } = load(config, false, false);

            if (command === "act.ex.flush")
            {
                let item,
                    nextHeader = header;

                if (context.now < long(row, "updateTime") + header.interval - 10000n)
                {
                    if (header.token !== config.token)
                    {
                        campaignFailure();
                    }

                    if (num(row, "flushTimes") >= config.free)
                    {
                        const cost = config.costs[
                            Math.min(num(row, "flushTimes") - config.free, config.costs.length - 1)
                        ]!;
                        context.economy.item(header.token, -cost);
                        const state = context.economy.itemState?.(header.token);

                        if (!state)
                        {
                            campaignFailure();
                        }

                        item = inventoryItem({ ...state }, context.rules);
                    }

                    row.flushTimes = cityInteger(num(row, "flushTimes") + 1);
                }
                else
                {
                    row.updateTime = config.interval === header.interval
                        ? monsterExchangeBoundary(
                            long(row, "updateTime"),
                            header.interval,
                            context.now,
                            10000n,
                        )
                        : context.now;
                    nextHeader = config;
                }

                row.rewards = fresh(config);
                row.reserve_2 = monsterExchangeHeader(nextHeader);
                row.level = 0;
                row.receiveLevels = "";
                write(row);

                return {
                    response: encode({
                        flush: sfs.object(view(row)),
                        ...(item ? { item: sfs.object(item) } : {}),
                    }),
                    event: null,
                };
            }

            if (context.now >= long(row, "updateTime") + header.interval)
            {
                campaignFailure();
            }

            const level = cityInteger(int(params, "type"), 1, offers.length),
                claims = monsterExchangeClaims(text(row, "receiveLevels"), offers.length),
                selected = offers[level - 1]!;

            if (claims.includes(level))
            {
                campaignFailure();
            }

            context.economy.item(header.token, -selected.count);
            const reward = grantNativeProgressionReward(
                context,
                pinProgressionReward(context, selected.reward),
            );
            refreshCampaignGrants(context);
            const complete = claims.length + 1 === offers.length;

            if (complete)
            {
                row.rewards = fresh(config);
                row.level = 0;
                row.receiveLevels = "";
            }
            else
            {
                row.level = level;
                row.receiveLevels = [...claims, level].join(",");
            }

            write(row);
            new CampaignPlanner(context, { key_activityId: "6", key_rewardId: selected.reward })
                .event(
                    62,
                    `6;${selected.reward}`,
                );

            return {
                response: encode({
                    ...(complete ? { activity: sfs.object(view(row)) } : { level: sfs.int(level) }),
                    num: sfs.int(context.economy.quantity?.(header.token) ?? 0),
                    reward: sfs.array(reward),
                }),
                event: null,
            };
        };

        this.apply = async () => {
            campaignFailure();
        };
    }
}

export function createMonsterExchangeDomain(
    random: (maximum: number) => number = randomInt,
): CityDomain
{
    return new MonsterExchangeDomain(random);
}
