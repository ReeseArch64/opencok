import { reconnectMine } from "@opencok/mappings/reconnect";
import { inventoryItem } from "@opencok/economy/mappings/inventory-item";
import { randomUUID, randomInt } from "node:crypto";
import type { FriendshipMineExecutor } from "@opencok/contracts/friendship-mine";
import type { RealmSocialExecutor } from "@opencok/contracts/realm-social";
import { sfs, str, encode, fields, type Fields } from "@opencok/messages/sfs";
import { inventoryReplay } from "@opencok/economy/mappings/inventory";
import { InventoryPlanner, type InventoryEffects } from "./inventory.ts";
import { activityEconomy } from "@opencok/economy/services/activity-economy";
import { friendshipMineView } from "@opencok/rules/reconnect-mine";
import { inventoryWeighted } from "@opencok/economy/rules/inventory";
import { cityInteger } from "@opencok/rules/city-progression";
import { num, long, text } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export const friendshipMineCommands = [
    "mine.callHelp",
    "mine.dig",
    "mine.friend",
    "mine.help",
    "mine.help.info",
];

export class FriendshipMineService
{
    constructor(
        readonly execute: FriendshipMineExecutor,
        readonly rules: Rules,
        readonly effects: InventoryEffects,
        readonly remote?: RealmSocialExecutor,
        readonly now = Date.now,
    )
    {}

    async command(owner: string, command: string, params: Fields, internal = false)
    {
        if (["mine.friend", "mine.help"].includes(command))
        {
            if (!this.remote)
            {
                throw new GameError(errors.unsupported);
            }

            const body = await this.remote(owner, command, params);

            if (command === "mine.friend")
            {
                const friends =
                    (body.friendList?.value ?? []) as import("@opencok/messages/sfs").Value[];
                const projected = friends.map((value) => {
                    const entry = fields(value);
                    const view = friendshipMineView(
                        {
                            itemId: Number(entry.itemId?.value),
                            level: Number(entry.level?.value),
                            exp: Number(entry.exp?.value),
                            miner: Number(entry.miner?.value),
                            mineTime: String(entry.mineTime?.value ?? "0"),
                            call: Number(entry.call?.value),
                        },
                        this.rules,
                    );
                    const { helped, ...visible } = entry;

                    return sfs.object({
                        ...visible,
                        help: sfs.int(
                            view.call === 1
                                && view.mineTime <= BigInt(this.now())
                                && view.miner < view.maxMiners
                                && helped?.value !== true
                                ? 1
                                : 0,
                        ),
                    });
                });
                body.friendList = sfs.array(projected);
                body.friends = sfs.array(projected);
            }

            return { body, pushes: [] };
        }

        if (
            !friendshipMineCommands.includes(command)
            && !(command === "mine.receive.help" && internal)
        )
        {
            throw new GameError(errors.unsupported);
        }

        const operationId = params.operationId ? str(params, "operationId") : randomUUID();
        const request: Fields = {};

        for (const key of Object.keys(params).sort())
        {
            if (!["operationId", "_cok_", "cmdBaseTime"].includes(key))
            {
                request[key] = params[key]!;
            }
        }

        const response = await this.execute(
            { owner, requestId: operationId, command, request: encode(request) },
            async (state, store) => {
                const now = this.now(),
                    mine = { ...store.mine };
                const view = friendshipMineView(mine, this.rules);
                const rule = this.rules.reconnect.treasures!.get(
                    String(view.itemId + view.level - 1),
                )!;
                const planner = new InventoryPlanner(state, this.rules, this.effects, now),
                    economy = activityEconomy(planner);
                const helpers = [...store.helpers];
                let body: Fields = {};

                if (command === "mine.help.info")
                {
                    body.result = sfs.array(
                        helpers.toReversed().map((helper) =>
                            sfs.object({
                                gUid: sfs.string(helper.gUid),
                                name: sfs.string(helper.name),
                                time: sfs.long(helper.time),
                            })
                        ),
                    );
                }
                else if (command === "mine.callHelp")
                {
                    if (view.mineTime > BigInt(now) || view.call)
                    {
                        throw new GameError(errors.invalid, "social_rule");
                    }

                    mine.call = 1;
                }
                else if (command === "mine.receive.help")
                {
                    const helper = str(params, "actor"),
                        generation = BigInt(str(params, "generation"));
                    const eligible = helper !== owner
                        && generation === view.mineTime
                        && view.call === 1
                        && view.mineTime <= BigInt(now)
                        && view.miner < view.maxMiners
                        && !helpers.some((row) =>
                            row.gUid === helper && BigInt(row.time) >= view.mineTime
                        );
                    body.result = sfs.int(eligible ? 1 : 0);

                    if (eligible)
                    {
                        mine.miner = view.miner + 1;
                        helpers.push({ gUid: helper, name: str(params, "name"), time: now });

                        if (helpers.length > 50)
                        {
                            helpers.shift();
                        }
                    }
                }
                else if (command === "mine.dig")
                {
                    if (view.mineTime > BigInt(now) || view.miner < view.maxMiners)
                    {
                        throw new GameError(errors.invalid, "social_rule");
                    }

                    const draw = (raw: string | undefined) =>
                        inventoryWeighted(
                            new Map(
                                (raw ?? "")
                                    .split("|")
                                    .map((weight, index) => [String(index), cityInteger(weight)])
                                    .filter(([, weight]) => Number(weight) > 0) as [
                                        string,
                                        number,
                                    ][],
                            ),
                        );
                    let goods: Fields | undefined;

                    if (rule.rate_item && rule.item)
                    {
                        const choices = rule.item.split("|")[Number(draw(rule.rate_item))]?.split(
                            ";",
                        );

                        if (!choices?.length)
                        {
                            throw new GameError(errors.invalid);
                        }

                        const pair = choices[randomInt(choices.length)]!.split("_");
                        const count = cityInteger(pair[1]);
                        const item = planner.add(pair[0]!, count);
                        goods = { ...inventoryItem({ ...item }, this.rules), add: sfs.int(count) };
                    }

                    if (rule.gold && rule.rate_gold)
                    {
                        const multiple = [1, 2, 5, 10][Number(draw(rule.rate_gold))];

                        if (!multiple)
                        {
                            throw new GameError(errors.invalid);
                        }

                        const gold = BigInt(rule.gold) * BigInt(multiple);
                        economy.gold(gold);
                        body.gold = sfs.object({
                            add: sfs.int(cityInteger(rule.gold)),
                            multiple: sfs.int(multiple),
                            gold: sfs.long(planner.total()),
                        });
                    }

                    if (goods)
                    {
                        body.goods = sfs.object(goods);
                    }

                    mine.miner = 0;
                    mine.call = 0;
                    mine.mineTime = BigInt(now) + BigInt(cityInteger(rule.weektime)) * 3_600_000n;
                    const maximum = cityInteger(this.rules.items.get("goldmine_fb")?.k4);

                    if (view.level < maximum)
                    {
                        mine.exp = view.exp + 1;

                        if (num(mine, "exp") >= view.requiredExp)
                        {
                            mine.exp = 0;
                            mine.level = view.level + 1;
                        }
                    }
                }

                if (command !== "mine.help.info")
                {
                    await store.save(mine, helpers);
                }

                if (command === "mine.callHelp" || command === "mine.dig")
                {
                    const result = friendshipMineView(mine, this.rules);
                    const mineFields = fields(reconnectMine(result).mine);

                    if (command === "mine.dig")
                    {
                        body.userMine = sfs.object(mineFields);
                    }
                    else
                    {
                        body = mineFields;
                    }
                }

                if (long(mine, "mineTime") < 0n)
                {
                    throw new GameError(errors.invalid);
                }

                const result = planner.result(body);

                if (command === "mine.callHelp")
                {
                    const recipients = [
                        ...new Set(str(params, "uids", "").split("|").filter(Boolean)),
                    ];

                    if (
                        recipients.length > 100
                        || recipients.some((uid) => !/^[a-zA-Z0-9_-]{1,40}$/.test(uid))
                    )
                    {
                        throw new GameError(errors.invalid);
                    }

                    return {
                        ...result,
                        events: [
                            ...(result.events ?? []),
                            {
                                id: "mine-call",
                                type: "social.mine.call",
                                expiresAt: BigInt(now + 86_400_000),
                                payload: encode({
                                    recipients: sfs.array(recipients.map((uid) => sfs.string(uid))),
                                    binding: sfs.string(store.binding),
                                    name: sfs.string(text(state.profile, "name")),
                                }),
                            },
                        ],
                    };
                }

                return result;
            },
        );

        return inventoryReplay(response, operationId);
    }
}
