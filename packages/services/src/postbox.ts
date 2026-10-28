import { postboxRelation as relation, postboxMessage as mail } from "@opencok/mappings/postbox";
import { inventoryItem } from "@opencok/mappings/bootstrap";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import type { RewardPreview } from "@opencok/contracts/rewards";
import { randomUUID, randomInt } from "node:crypto";
import type { PostboxExecutor } from "@opencok/contracts/postbox";
import { long, text, num, type Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, str, encode, type Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import { cityInteger } from "@opencok/rules/city-progression";
import { previewRewards } from "@opencok/rules/rewards";
import { inventoryReplay } from "@opencok/mappings/inventory";
import { InventoryPlanner, type InventoryEffects } from "./inventory.ts";
import { activityEconomy } from "@opencok/economy/services/activity-economy";

export const postboxCommands = [
    "post.box.put",
    "post.box.get",
    "post.box.chat",
    "post.box.relation",
    "post.box.unread",
    "post.box.read",
    "post.public",
];

export class PostboxService
{
    constructor(
        readonly execute: PostboxExecutor,
        readonly rules: Rules,
        readonly effects: InventoryEffects,
        readonly now = Date.now,
    )
    {}

    async command(owner: string, command: string, params: Fields)
    {
        if (!postboxCommands.includes(command))
        {
            throw new GameError(errors.unsupported);
        }

        const rule = this.rules.configuration.payControl?.get("69017");
        const now = this.now();
        const start = Date.parse(`${rule?.k1}T00:00:00Z`),
            end = Date.parse(`${rule?.k2}T00:00:00Z`);

        if (!rule || !Number.isFinite(start) || !Number.isFinite(end) || now < start || now > end)
        {
            throw new GameError(errors.invalid, "postbox_closed");
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
            {
                owner,
                requestId: operationId,
                command,
                request: encode(request),
                expiresAt: BigInt(now + 30 * 86_400_000),
            },
            async (inventory, store) => {
                const planner = new InventoryPlanner(inventory, this.rules, this.effects, now);
                const economy = activityEconomy(planner);
                const config = (key: string) => cityInteger(rule[key]);
                const identifiers = (value: string, separator: string) => {
                    const ids = [...new Set(value.split(separator).filter(Boolean))];

                    if (ids.length > 100 || ids.some((id) => !/^[a-zA-Z0-9_-]{1,40}$/.test(id)))
                    {
                        throw new GameError(errors.invalid);
                    }

                    return ids;
                };
                let body: Fields = {};
                const events = [];
                const rawSeal = str(params, "sealId", "");
                const seal = rawSeal === "0" ? "" : rawSeal;

                if (seal && !/^[1-9][0-9]?$/.test(seal))
                {
                    throw new GameError(errors.invalid);
                }

                if (command === "post.box.put" || command === "post.box.chat")
                {
                    const contents = str(params, "contents");

                    if (
                        !contents
                        || [...contents].length > 500
                        || !contents.isWellFormed()
                        || contents.includes("\0")
                    )
                    {
                        throw new GameError(errors.invalid);
                    }

                    const prices = (rule.k4 ?? "").split(";");

                    if (seal && !prices[Number(seal) - 1])
                    {
                        throw new GameError(errors.invalid);
                    }

                    const price = seal ? cityInteger(prices[Number(seal) - 1]) : 0;
                    const id = randomUUID();
                    let conversation: Row | null = null;

                    if (command === "post.box.chat")
                    {
                        conversation = await store.relation(str(params, "chatId"));

                        if (!conversation)
                        {
                            throw new GameError(errors.invalid);
                        }
                    }

                    planner.spendItems(rule.k9!, 1);
                    economy.gold(-BigInt(price));
                    const publicValue = str(params, "public", "0") === "1";
                    const bytes = Buffer.from(contents);

                    if (command === "post.box.put")
                    {
                        await store.putBox({
                            uid: id,
                            name: text(inventory.profile, "name"),
                            contents: bytes,
                            publicValue: publicValue ? 1 : 0,
                            seal,
                            time: BigInt(now),
                        });
                        body.chatId = sfs.string(id);
                    }
                    else if (conversation)
                    {
                        const participants = text(conversation, "players").split("|");
                        const recipient = participants.find((uid) => uid !== owner);

                        if (
                            !participants.includes(owner) || participants.length !== 2 || !recipient
                        )
                        {
                            throw new GameError(errors.invalid);
                        }

                        if (publicValue)
                        {
                            conversation.publicValue = [
                                ...new Set([
                                    ...text(conversation, "publicValue").split("|").filter(Boolean),
                                    owner,
                                ]),
                            ].join("|");
                            await store.saveRelation(conversation);
                        }

                        const message = {
                            uid: id,
                            boxId: text(conversation, "uid"),
                            toUser: recipient,
                            fromUser: owner,
                            fromName: text(inventory.profile, "name"),
                            contents: bytes,
                            seal,
                            createTime: BigInt(now),
                        };
                        await store.putMail(message);
                        body.relation = sfs.object(relation(conversation));
                        events.push({
                            id: randomUUID(),
                            type: "social.post",
                            payload: encode({
                                recipient: sfs.string(recipient),
                                message: sfs.object(mail(message)),
                                chat: sfs.object(relation(conversation)),
                                expiresAt: sfs.long(now + 30 * 86_400_000),
                            }),
                        });
                    }

                    const day = Math.floor(now / 86_400_000);
                    let count = Number(long(store.mixed, "postRewardTime") / 86_400_000n) === day
                        ? num(store.mixed, "postReward")
                        : 0;
                    let rewards: readonly RewardPreview[] = [];

                    if (count < config("k8") && randomInt(100) < config("k7"))
                    {
                        const award = previewRewards(
                            rule.k6,
                            this.rules,
                            { kingdomId: this.rules.kingdomId, version: "12.06.0", now },
                            randomInt,
                        );

                        for (const reward of award)
                        {
                            if (reward.kind === "item" && reward.type === 7)
                            {
                                economy.item(reward.id, reward.count);
                            }
                            else if (reward.kind === "count" && reward.type === 5)
                            {
                                economy.gold(BigInt(reward.value));
                            }
                            else if (
                                reward.kind === "count" && reward.type >= 0 && reward.type <= 4
                            )
                            {
                                const asset = ["wood", "stone", "iron", "food", "silver"] as const;
                                economy.resource(asset[reward.type]!, BigInt(reward.value));
                            }
                            else
                            {
                                throw new GameError(errors.unsupported, "postbox_reward");
                            }
                        }

                        rewards = award;
                        count++;
                    }

                    await store.updateMixed({ postReward: count, postRewardTime: BigInt(now) });
                    body.gold = sfs.long(planner.total());
                    body.reward = rewardPreviewArray(rewards);
                    const ticket = [...planner.changed.values()].find((item) =>
                        item.itemId === rule.k9
                    );

                    if (ticket)
                    {
                        body.goods = sfs.object(inventoryItem({ ...ticket }, this.rules));
                    }
                }
                else if (command === "post.box.get")
                {
                    const count = long(store.mixed, "postMailTime") / 86_400_000n
                            === BigInt(Math.floor(now / 86_400_000))
                        ? num(store.mixed, "postMail")
                        : 0;

                    if (count >= config("k10"))
                    {
                        throw new GameError(errors.invalid, "postbox_daily_limit");
                    }

                    const box = await store.takeBox();

                    if (!box)
                    {
                        throw new GameError(errors.invalid, "postbox_empty");
                    }

                    const row = {
                        uid: text(box, "uid"),
                        players: `${text(box, "from")}|${owner}`,
                        publicValue: num(box, "publicValue") === 1 ? text(box, "from") : "",
                        time: BigInt(now),
                    };
                    const message = {
                        uid: randomUUID(),
                        boxId: row.uid,
                        toUser: owner,
                        fromUser: text(box, "from"),
                        fromName: text(box, "name"),
                        contents: box.contents ?? Buffer.alloc(0),
                        seal: text(box, "seal"),
                        createTime: BigInt(now),
                    };
                    await store.saveRelation(row);
                    await store.putMail(message);
                    await store.updateMixed({ postMail: count + 1, postMailTime: BigInt(now) });
                    body = { message: sfs.object(mail(message)), chat: sfs.object(relation(row)) };
                }
                else if (command === "post.box.relation")
                {
                    body.chatList = sfs.array(
                        (await store.relations(identifiers(str(params, "relations"), "|"))).map((
                            row,
                        ) => sfs.object(relation(row))),
                    );
                }
                else if (command === "post.public")
                {
                    const row = await store.relation(str(params, "chatId"));

                    if (!row)
                    {
                        throw new GameError(errors.invalid);
                    }

                    row.publicValue = [
                        ...new Set([...text(row, "publicValue").split("|").filter(Boolean), owner]),
                    ].join("|");
                    await store.saveRelation(row);
                    body.relation = sfs.object(relation(row));
                }
                else if (command === "post.box.unread")
                {
                    const groups = new Map<string, Fields[]>();

                    for (const row of await store.unread())
                    {
                        const id = text(row, "boxId");
                        const list = groups.get(id) ?? [];
                        list.push(mail(row));
                        groups.set(id, list);
                    }

                    const entries = [];

                    for (const [id, messages] of groups)
                    {
                        const row = await store.relation(id);

                        if (row)
                        {
                            entries.push(
                                sfs.object({
                                    messageList: sfs.array(
                                        messages.map((message) => sfs.object(message)),
                                    ),
                                    chatInfo: sfs.object(relation(row)),
                                }),
                            );
                        }
                    }

                    body.unread = sfs.array(entries);
                }
                else if (command === "post.box.read")
                {
                    const ids = identifiers(str(params, "uid"), "|");

                    if (str(params, "batch", "0") !== "1" && ids.length > 1)
                    {
                        throw new GameError(errors.invalid);
                    }

                    const rows = await store.mails(ids);
                    const latest = rows
                        .filter((row) => !!text(row, "seal"))
                        .sort((a, b) => Number(long(b, "createTime") - long(a, "createTime")))[0];

                    if (latest)
                    {
                        const id = text(latest, "seal"),
                            duration = (rule.k5 ?? "").split(";")[Number(id) - 1];

                        if (duration === undefined)
                        {
                            throw new GameError(errors.invalid);
                        }

                        const until = BigInt(now) + BigInt(cityInteger(duration)) * 1000n;
                        await store.grantSeal(id, until);
                        body = { seaId: sfs.string(id), sealTime: sfs.int(Number(until / 1000n)) };
                    }

                    await store.removeMails(rows.map((row) => text(row, "uid")));
                }

                const result = planner.result(body);

                return { ...result, events: [...(result.events ?? []), ...events] };
            },
        );

        return inventoryReplay(response, operationId);
    }
}
