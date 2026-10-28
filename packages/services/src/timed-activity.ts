import { citySpeedGold } from "@opencok/rules/city-progression";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { cityQueueCommands } from "@opencok/rules/city-command";
import { playerGameEffect } from "@opencok/rules/power-resolver";
import { generalSkillPoints } from "@opencok/hero/services/general-power";
import { inventoryReplay } from "@opencok/mappings/inventory";
import { randomUUID } from "node:crypto";
import type {
    ActivityEconomy,
    ActivityExecutor,
    ActivityState,
    TimedActivity,
} from "@opencok/contracts/timed-activity";
import type { Row } from "@opencok/contracts/rows";
import { long, num, text } from "@opencok/contracts/rows";
import {
    idleDeadline,
    activityInstant,
    activityState,
    transitionActivity,
} from "@opencok/rules/timed-activity";
import type { Rules } from "@opencok/rules/game";
import { encode, decode, sfs, str, int, ProtocolError, type Fields } from "@opencok/messages/sfs";
import { queue as queueView } from "@opencok/mappings/city";
import { InventoryPlanner, type InventoryEffects } from "./inventory";

export class TimedActivityService
{
    constructor(
        readonly execute: ActivityExecutor,
        readonly rules: Rules,
        readonly effects: InventoryEffects,
        readonly participants?: (
            owner: string,
            command: string,
            params: Fields,
        ) => readonly string[] | undefined,
    )
    {}

    async start(
        owner: string,
        operationId: string,
        input: { type: number; itemId: string; durationMs: bigint; queueId?: string; },
    )
    {
        if (
            !Number.isInteger(input.type)
            || input.type < 0
            || input.type > 41
            || !input.itemId
            || input.itemId.length > 255
            || input.durationMs <= 0n
        )
        {
            throw new Error("Invalid activity start");
        }

        return this.run(
            owner,
            operationId,
            "activity.start",
            {
                type: sfs.int(input.type),
                itemId: sfs.string(input.itemId),
                duration: sfs.long(input.durationMs),
                uuid: sfs.string(input.queueId ?? ""),
            },
            async (state, ledger) => {
                const dueAt = activityInstant(state.now + input.durationMs);
                const selected = state.queues
                    .filter(
                        (row) =>
                            num(row, "type") === input.type
                            && (!input.queueId || row.uuid === input.queueId)
                            && long(row, "endTime") >= dueAt
                            && activityState(long(row, "updateTime"), state.now) === "idle",
                    )
                    .sort((a, b) => num(a, "qid") - num(b, "qid"))[0];

                if (!selected)
                {
                    throw new GameError(errors.full, "city_progression");
                }

                const activity: TimedActivity = {
                    id: randomUUID(),
                    ownerId: owner,
                    queueId: text(selected, "uuid"),
                    type: input.type,
                    itemId: input.itemId,
                    startedAt: state.now,
                    dueAt,
                    version: 1,
                    status: 0,
                };
                const item = decode(
                    Buffer.from(await state.apply("start", activity, activityEconomy(ledger))),
                );
                const row = {
                    ...selected,
                    itemId: input.itemId,
                    startTime: state.now,
                    updateTime: dueAt,
                    totalTime: input.durationMs,
                    isHelped: 0,
                };

                return {
                    queues: [row],
                    activities: [activity],
                    body: {
                        ...queueView(row, item, false),
                        activityId: sfs.string(activity.id),
                        version: sfs.int(1),
                    },
                    ledger,
                };
            },
        );
    }

    async domainCommand(owner: string, command: string, params: Fields)
    {
        try
        {
            const operationId = str(params, "operationId", "") || randomUUID();

            if (!/^[A-Za-z0-9:._-]{1,128}$/.test(operationId))
            {
                throw new Error("Invalid operationId");
            }

            return await this.run(owner, operationId, command, params, async (state, ledger) => {
                if (!state.prepare)
                {
                    throw new Error("City progression unavailable");
                }

                const prepared = await state.prepare(
                    command,
                    encode(params),
                    activityEconomy(ledger),
                );
                const item = decode(Buffer.from(prepared.response));

                for (const push of prepared.pushes ?? [])
                {
                    ledger.pushes.push({
                        command: push.command,
                        body: decode(Buffer.from(push.body)),
                    });
                }

                if (prepared.type === undefined)
                {
                    return {
                        queues: [],
                        activities: [],
                        body: item,
                        ledger,
                        event: prepared.event,
                    };
                }

                const duration = prepared.durationMs;

                if (
                    duration === undefined
                    || duration < 0n
                    || (duration === 0n && !prepared.ready)
                    || !prepared.itemId
                )
                {
                    throw new Error("Invalid prepared activity");
                }

                const dueAt = activityInstant(state.now + duration);
                const selected = state.queues
                    .filter(
                        (row) =>
                            num(row, "type") === prepared.type
                            && long(row, "endTime") >= dueAt
                            && long(row, "updateTime") === idleDeadline,
                    )
                    .sort((a, b) => num(a, "qid") - num(b, "qid"))[0];

                if (!selected)
                {
                    throw new GameError(errors.full, "city_progression");
                }

                const activity: TimedActivity = {
                    id: randomUUID(),
                    ownerId: owner,
                    queueId: text(selected, "uuid"),
                    type: prepared.type,
                    itemId: prepared.itemId,
                    startedAt: state.now,
                    dueAt,
                    version: 1,
                    status: 0,
                    data: prepared.data,
                };
                const row: Row = {
                    ...selected,
                    itemId: prepared.queueItemId ?? activity.itemId,
                    startTime: state.now,
                    updateTime: dueAt,
                    totalTime: duration,
                    isHelped: 0,
                };
                const queue = queueView(
                    row,
                    prepared.item ? decode(Buffer.from(prepared.item)) : item,
                    false,
                );
                queue.activityId = sfs.string(activity.id);
                queue.version = sfs.int(1);
                const body = prepared.responseKind === "nested"
                    ? { ...item, queue: sfs.object(queue), finish: sfs.long(dueAt) }
                    : queue;

                return {
                    queues: [row],
                    activities: [activity],
                    body,
                    ledger,
                    event: prepared.event,
                };
            });
        }
        catch (error)
        {
            if (error instanceof ProtocolError)
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            throw error;
        }
    }

    async restore(owner: string, operationId: string, queueId: string)
    {
        return this.run(
            owner,
            operationId,
            "activity.restore",
            { uuid: sfs.string(queueId) },
            async (state, ledger) => {
                const saved = state.queues.find((row) => row.uuid === queueId);

                if (
                    !saved
                    || state.activities.some((row) => row.queueId === queueId)
                    || activityState(long(saved, "updateTime"), state.now) === "idle"
                )
                {
                    throw new Error("Queue cannot be restored");
                }

                const startedAt = activityInstant(long(saved, "startTime")),
                    dueAt = activityInstant(long(saved, "updateTime"));

                if (dueAt < startedAt || startedAt > state.now || !text(saved, "itemId"))
                {
                    throw new Error("Invalid saved activity");
                }

                const activity: TimedActivity = {
                    id: randomUUID(),
                    ownerId: owner,
                    queueId,
                    type: num(saved, "type"),
                    itemId: text(saved, "itemId"),
                    startedAt,
                    dueAt,
                    version: 1,
                    status: 0,
                };
                const item = decode(
                    Buffer.from(await state.apply("restore", activity, activityEconomy(ledger))),
                );

                return {
                    queues: [],
                    activities: [activity],
                    body: {
                        ...queueView(saved, item, false),
                        activityId: sfs.string(activity.id),
                        version: sfs.int(1),
                    },
                    ledger,
                };
            },
        );
    }

    async command(owner: string, command: string, params: Fields)
    {
        const alias = cityQueueCommands[command];
        const queueCommand = alias?.action ?? command;

        if (
            !["queue.finish", "queue.cancel", "queue.ccd", "queue.open", "queue.rent"].includes(
                queueCommand,
            )
        )
        {
            throw new Error("Unsupported activity command");
        }

        const operationId = str(params, "operationId", "") || randomUUID();

        if (!operationId || !/^[A-Za-z0-9:._-]{1,128}$/.test(operationId))
        {
            throw new Error("Stable operationId required for activity mutation");
        }

        if (params.guideStep && str(params, "guideStep").length > 255)
        {
            throw new Error("Invalid activity guide step");
        }

        return this.run(owner, operationId, command, params, async (state, ledger) => {
            if (queueCommand === "queue.open")
            {
                const item = ledger.own(str(params, "uuid"));
                const rule = this.rules.goods.get(item.itemId);
                const qid = Number(rule?.para1),
                    seconds = Number(rule?.para2);

                if (
                    rule?.type !== "1"
                    || !Number.isInteger(qid)
                    || qid < 2
                    || !Number.isSafeInteger(seconds)
                    || seconds <= 0
                )
                {
                    throw new Error("Invalid queue opening item");
                }

                ledger.take(item, 1);
                const saved = state.queues.find((row) =>
                    num(row, "type") === 0 && num(row, "qid") === qid
                );
                const row: Row = saved
                    ? {
                        ...saved,
                        endTime: activityInstant(
                            (long(saved, "endTime") > state.now
                                ? long(saved, "endTime")
                                : state.now)
                                + BigInt(seconds) * 1000n,
                        ),
                    }
                    : {
                        uuid: randomUUID(),
                        ownerId: owner,
                        qid: Math.max(
                            1,
                            ...state.queues
                                .filter((row) => num(row, "type") === 0)
                                .map((row) => num(row, "qid")),
                        ) + 1,
                        type: 0,
                        itemId: "",
                        startTime: idleDeadline,
                        endTime: activityInstant(state.now + BigInt(seconds) * 1000n),
                        updateTime: idleDeadline,
                        totalTime: 0n,
                        isHelped: 0,
                        para: 0,
                    };

                return { queues: [row], activities: [], body: queueView(row, {}, false), ledger };
            }

            const uuid = str(
                params,
                alias?.queueKey
                    ?? (queueCommand === "queue.ccd" || queueCommand === "queue.rent"
                        ? "qUUID"
                        : "uuid"),
            );
            const saved = state.queues.find((row) => row.uuid === uuid);

            if (!saved)
            {
                throw new GameError(errors.queue, "city_progression");
            }

            if (
                alias
                && (!alias.types.includes(num(saved, "type"))
                    || (alias.target && str(params, alias.target) !== text(saved, "itemId")))
            )
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            if (alias?.action === "queue.finish" && long(saved, "updateTime") > state.now + 1000n)
            {
                throw new GameError(errors.queuePending, "city_progression");
            }

            if (queueCommand === "queue.rent")
            {
                if (num(saved, "qid") === 1 || num(saved, "type") !== 0)
                {
                    throw new Error("Queue cannot be rented");
                }

                const seconds = int(params, "rentTime");

                if (seconds <= 0)
                {
                    throw new Error("Invalid queue rental");
                }

                const rule = this.rules.items.get("building_base");
                const unit = Number(rule?.k8),
                    price = Number(rule?.k9);

                if (!(unit > 0) || !Number.isFinite(price) || price < 0)
                {
                    throw new Error("Missing queue rental rule");
                }

                debit(
                    ledger,
                    BigInt(
                        Math.ceil(Math.fround(Math.fround(seconds / Math.fround(unit)) * price)),
                    ),
                    "queue.rent",
                );
                const row = {
                    ...saved,
                    endTime: activityInstant(
                        (long(saved, "endTime") > state.now ? long(saved, "endTime") : state.now)
                            + BigInt(seconds) * 1000n,
                    ),
                };

                return {
                    queues: [row],
                    activities: [],
                    body: {
                        gold: sfs.long(ledger.total()),
                        queue: sfs.object(queueView(row, {}, false)),
                    },
                    ledger,
                };
            }

            const active = state.activities.find((row) => row.queueId === uuid);

            if (!active)
            {
                throw new Error("Queue has no registered activity");
            }

            const expected = str(params, "activityId", "");

            if (expected && expected !== active.id)
            {
                throw new Error("Activity generation required");
            }

            const version = int(params, "version", active.version);

            if (version !== active.version)
            {
                throw new Error("Activity version conflict");
            }

            let consumed: { itemId: string; count: number; } | undefined;
            let next: TimedActivity,
                item: Fields,
                finished = false;

            if (queueCommand === "queue.ccd")
            {
                let remaining = Number((active.dueAt - state.now) / 1000n);

                if (!Number.isSafeInteger(remaining))
                {
                    throw new Error("Activity duration exceeds acceleration bound");
                }

                if (remaining < 0)
                {
                    remaining = 0;
                }

                let freeSeconds = Number(this.rules.items.get("resources_basics")?.k8 ?? 0);

                if (active.type === 0)
                {
                    const snapshot = await state.effects();

                    if (snapshot.vip && long(snapshot.vip, "vipEndTime") > state.now)
                    {
                        let speedup = 0;

                        for (const rule of this.rules.power.vip?.values() ?? [])
                        {
                            if (Number(rule.point) <= num(snapshot.vip, "score"))
                            {
                                speedup = Number(rule.speedup ?? 0);
                            }
                        }

                        freeSeconds += speedup * 60;
                    }

                    freeSeconds += playerGameEffect(
                        snapshot,
                        this.rules,
                        {
                            kingdomId: this.rules.kingdomId,
                            version: "12.06.0",
                            now: Number(state.now),
                        },
                        generalSkillPoints(snapshot.generals),
                        await this.effects.world(),
                        await this.effects.emperor(),
                        899,
                    );
                }

                const alreadyDue = activityState(active.dueAt, state.now) === "due";
                const free = alreadyDue || (active.type === 0 && remaining <= freeSeconds);

                if (free)
                {
                    remaining = 0;
                }
                else if (int(params, "isGold") !== 0)
                {
                    if (active.type === 12)
                    {
                        if (!state.accelerate)
                        {
                            throw new GameError(errors.unsupported, "city_progression");
                        }

                        await state.accelerate(
                            active,
                            BigInt(remaining) * 1000n,
                            activityEconomy(ledger),
                        );
                        remaining = 0;
                    }

                    const troops = [1, 8, 9, 10, 17].includes(active.type);

                    if (active.type !== 12)
                    {
                        debit(
                            ledger,
                            citySpeedGold(this.rules, BigInt(remaining) * 1000n, troops),
                            "queue.ccd",
                        );
                    }

                    remaining = 0;
                }
                else
                {
                    const item = ledger.own(str(params, "itemUUID"));
                    const rule = this.rules.goods.get(item.itemId);
                    let count = int(params, "itemCount", 1);
                    const speed = Number(rule?.para3),
                        mode = Number(rule?.para2);

                    if (
                        rule?.type !== "2"
                        || count <= 0
                        || !Number.isInteger(speed)
                        || speed <= 0
                        || ![1, 2].includes(mode)
                    )
                    {
                        throw new Error("Invalid acceleration item");
                    }

                    if (mode === 1)
                    {
                        count = Math.min(count, Math.max(1, Math.ceil(remaining / speed)));
                        remaining = Math.max(0, remaining - speed * count);
                    }
                    else
                    {
                        if (count !== 1 || speed > 100)
                        {
                            throw new Error("Invalid percentage acceleration");
                        }

                        remaining = Math.trunc(remaining * (1 - speed / 100));
                    }

                    ledger.take(item, count);
                    consumed = { itemId: item.itemId, count: item.count };
                }

                next = transitionActivity(
                    active,
                    alreadyDue ? "finish" : "reschedule",
                    state.now,
                    version,
                    state.now + BigInt(remaining) * 1000n,
                );
                finished = activityState(next.dueAt, state.now) === "due";

                if (finished)
                {
                    next = { ...next, status: 1 };
                }

                item = decode(
                    Buffer.from(
                        await state.apply(
                            finished ? "finish" : "reschedule",
                            next,
                            activityEconomy(ledger),
                        ),
                    ),
                );
            }
            else
            {
                next = transitionActivity(
                    active,
                    queueCommand === "queue.finish" ? "finish" : "cancel",
                    state.now,
                    version,
                );
                finished = next.status === 1;
                item = decode(
                    Buffer.from(
                        await state.apply(
                            queueCommand === "queue.finish" ? "finish" : "cancel",
                            next,
                            activityEconomy(ledger),
                        ),
                    ),
                );
            }

            let row: Row = next.status === 0
                ? { ...saved, updateTime: next.dueAt }
                : {
                    ...saved,
                    itemId: "",
                    startTime: idleDeadline,
                    updateTime: idleDeadline,
                    totalTime: 0n,
                    isHelped: 0,
                    para: 0,
                };
            const writes: TimedActivity[] = [next];

            if (finished && state.next)
            {
                const continuation = await state.next(next, activityEconomy(ledger));

                if (continuation)
                {
                    if (
                        continuation.type !== next.type
                        || !continuation.itemId
                        || continuation.durationMs === undefined
                        || continuation.durationMs < 0n
                        || continuation.durationMs > 315360000000n
                    )
                    {
                        throw new Error("Invalid activity continuation");
                    }

                    const startedAt = activityInstant(continuation.startedAt ?? next.dueAt),
                        dueAt = activityInstant(startedAt + continuation.durationMs);

                    if (startedAt < next.dueAt)
                    {
                        throw new Error("Retroactive activity continuation");
                    }

                    const chained: TimedActivity = {
                        id: randomUUID(),
                        ownerId: owner,
                        queueId: next.queueId,
                        type: next.type,
                        itemId: continuation.itemId,
                        startedAt,
                        dueAt,
                        version: 1,
                        status: 0,
                        data: continuation.data,
                    };
                    writes.push(chained);
                    row = {
                        ...saved,
                        itemId: continuation.queueItemId ?? chained.itemId,
                        startTime: startedAt,
                        updateTime: dueAt,
                        totalTime: continuation.durationMs,
                        isHelped: 0,
                        para: 0,
                    };
                }
            }

            const body = queueView(row, item, false);
            body.activityId = sfs.string(writes.at(-1)!.id);
            body.version = sfs.int(writes.at(-1)!.version);

            if (queueCommand === "queue.ccd")
            {
                body.remainGold = sfs.long(ledger.total());
                body.finished = sfs.bool(finished);

                if (consumed)
                {
                    body.itemId = sfs.string(consumed.itemId);
                    body.count = sfs.int(consumed.count);
                }
            }

            return {
                queues: [row],
                activities: writes,
                body: alias
                    ? { ...item, queue: sfs.object(body) }
                    : queueCommand === "queue.cancel"
                    ? { ...item, queue: sfs.object(body) }
                    : body,
                ledger,
            };
        });
    }

    private async run(
        owner: string,
        operationId: string,
        command: string,
        params: Fields,
        apply: (
            state: ActivityState,
            ledger: InventoryPlanner,
        ) => Promise<{
            queues: readonly Row[];
            activities: readonly TimedActivity[];
            body: Fields;
            ledger: InventoryPlanner;
            event?: Uint8Array | null;
        }>,
    )
    {
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
                participants: this.participants?.(owner, command, params),
            },
            async (state) => {
                const ledger = new InventoryPlanner(
                    state,
                    this.rules,
                    this.effects,
                    Number(state.now),
                );
                const result = await apply(state, ledger);
                const plan = ledger.result(result.body);

                return {
                    ...plan,
                    guideStep:
                        ["queue.ccd", "army.add", "army.complete", "army.cd"].includes(command)
                            && params.guideStep
                            ? str(params, "guideStep").trim()
                                ? str(params, "guideStep")
                                : ""
                            : undefined,
                    queues: result.queues,
                    activities: result.activities,
                    events: [
                        ...(plan.events ?? []),
                        ...(result.event === null
                            ? []
                            : [{
                                id: "activity",
                                type: command,
                                payload: result.event ?? encode(result.body),
                            }]),
                    ],
                };
            },
        );

        return inventoryReplay(response, operationId);
    }
}

export function debit(ledger: InventoryPlanner, amount: bigint, reason: string)
{
    if (amount < 0n || amount > ledger.total())
    {
        throw new GameError(errors.gold, "city_progression");
    }

    for (const key of ledger.pools())
    {
        const before = ledger.balance(key),
            cost = before < amount ? before : amount;

        if (cost)
        {
            ledger.profile[key] = before - cost;
            ledger.post(`profile.${key}`, before, before - cost, reason);
            amount -= cost;
        }
    }
}

export function activityEconomy(ledger: InventoryPlanner): ActivityEconomy
{
    const valid = (amount: bigint) => {
        if (amount < 0n || amount > 9223372036854775807n)
        {
            throw new Error("Invalid activity balance");
        }

        return amount;
    };

    return {
        event(event)
        {
            ledger.domainEvents.push(event);
        },
        push(command, body)
        {
            ledger.pushes.push({ command, body: decode(Buffer.from(body)) });
        },
        takeItemGrants()
        {
            const grants = new Map<string, number>();

            for (const posting of ledger.postings.slice(ledger.campaignPostingCursor))
            {
                if (!posting.asset.startsWith("item.") || posting.after <= posting.before)
                {
                    continue;
                }

                const item = ledger.items.find((row) => `item.${row.uuid}` === posting.asset);

                if (!item)
                {
                    throw new Error("Missing campaign item grant");
                }

                grants.set(
                    item.itemId,
                    (grants.get(item.itemId) ?? 0) + Number(posting.after - posting.before),
                );
            }

            ledger.campaignPostingCursor = ledger.postings.length;

            return [...grants].map(([itemId, count]) => ({ itemId, count }));
        },
        balance(asset)
        {
            return asset === "civilizationSorce" || asset === "crystal"
                ? ledger.balance(asset)
                : asset === "gold"
                ? ledger.total()
                : (ledger.resources[asset] ?? long(ledger.state.resource, asset));
        },
        consumeItem(uuid, count)
        {
            ledger.take(ledger.own(uuid), count);
        },
        ownedItem(uuid)
        {
            const item = ledger.own(uuid);

            return { itemId: item.itemId, count: item.count };
        },
        itemState(itemId)
        {
            const row = ledger.items.find(
                (item) => item.itemId === itemId && item.value === 0 && ledger.valid(item),
            );

            return row ? { ...row } : undefined;
        },
        quantity(itemId)
        {
            return ledger.items
                .filter((item) => item.itemId === itemId && item.value === 0 && ledger.valid(item))
                .reduce((sum, item) => sum + item.count, 0);
        },
        crystal(delta)
        {
            const before = ledger.balance("crystal"),
                after = valid(before + delta);
            ledger.profile.crystal = after;
            ledger.post("profile.crystal", before, after, "activity.crystal");
        },
        civilizationScore(delta)
        {
            const before = ledger.balance("civilizationSorce"),
                after = valid(before + delta);
            ledger.profile.civilizationSorce = after;
            ledger.post("profile.civilizationSorce", before, after, "activity.civilization");
        },
        winPoints(delta)
        {
            const before = ledger.assets.winPoint ?? long(ledger.state.assets ?? {}, "winPoint"),
                after = valid(before + delta);
            ledger.assets.winPoint = after;
            ledger.post("assets.winPoint", before, after, "activity.reward");
        },
        gold(delta)
        {
            if (delta < 0n)
            {
                debit(ledger, -delta, "activity.cost");
            }
            else if (delta > 0n)
            {
                const key = ledger.pools()[0]!,
                    before = ledger.balance(key),
                    after = valid(before + delta);
                ledger.profile[key] = after;
                ledger.post(`profile.${key}`, before, after, "activity.credit");
                ledger.total();
            }
        },
        resource(asset, delta)
        {
            if (
                ![
                    "wood",
                    "stone",
                    "iron",
                    "food",
                    "silver",
                    "woodbind",
                    "stonebind",
                    "ironbind",
                    "foodbind",
                    "chip",
                    "diamond",
                    "dragon_food",
                    "dragon_gold",
                    "sandstone",
                    "diamondstone",
                    "marble",
                    "granite",
                    "limestone",
                ].includes(asset)
            )
            {
                throw new Error("Invalid activity resource");
            }

            const before = ledger.resources[asset] ?? long(ledger.state.resource, asset),
                after = valid(before + delta);
            ledger.resources[asset] = after;
            ledger.post(`resource.${asset}`, before, after, "activity.resource");
        },
        item(itemId, delta)
        {
            if (!Number.isInteger(delta) || delta === 0)
            {
                throw new Error("Invalid activity item change");
            }

            if (delta < 0)
            {
                ledger.spendItems(itemId, -delta);
            }
            else
            {
                ledger.add(itemId, delta);
            }
        },
    };
}
