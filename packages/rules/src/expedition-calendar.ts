import { createHash } from "node:crypto";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import type {
    ExpeditionCalendarState,
    ExpeditionCalendarPlan,
} from "@opencok/contracts/expedition-calendar";
import type { ExpeditionPhase } from "@opencok/contracts/new-expedition";
import { expeditionOpen, expeditionPhase, expeditionFailure } from "./new-expedition";
import { cityInteger } from "./city-progression";
import type { Rules } from "./game";

export function expeditionCalendarStages(rules: Rules)
{
    const order = (rules.items.get("17_wk")?.k3 ?? "").split(";").map((x) => cityInteger(x, 0, 8));

    if (order.length !== 9 || new Set(order).size !== 9 || order[0] !== 0 || order[1] !== 1)
    {
        expeditionFailure();
    }

    return order.map((stage) => {
        const entries = [...(rules.advanced.expeditionStages?.values() ?? [])].filter(
            (row) => Number(row.stage) === stage,
        );

        if (entries.length !== 1)
        {
            expeditionFailure();
        }

        const hours = cityInteger(entries[0]!.time, 1, 8760);

        return { stage, durationMs: BigInt(hours) * 3600000n };
    });
}

function encode(phases: readonly ExpeditionPhase[])
{
    return JSON.stringify(
        phases.map((row) => ({
            ...row,
            startTime: String(row.startTime),
            endTime: String(row.endTime),
        })),
    );
}

export function expeditionCalendarPhases(period: Row): ExpeditionPhase[]
{
    let raw: unknown;

    try
    {
        raw = JSON.parse(text(period, "schedule"));
    }
    catch
    {
        expeditionFailure();
    }

    if (!Array.isArray(raw) || raw.length < 1 || raw.length > 9)
    {
        expeditionFailure();
    }

    expeditionPhase(period, long(period, "startTime"));

    return raw.map((row) => ({
        stage: cityInteger(row.stage, 0, 8),
        startTime: BigInt(row.startTime),
        endTime: BigInt(row.endTime),
    }));
}

function phases(start: bigint, stages: readonly { stage: number; durationMs: bigint; }[])
{
    return stages.map(({ stage, durationMs }) => {
        const phase = { stage, startTime: start, endTime: start + durationMs };
        start = phase.endTime;

        return phase;
    });
}

export function expeditionCalendarPlan(
    state: ExpeditionCalendarState,
    rules: Rules,
    realms: readonly number[],
    now: bigint,
): ExpeditionCalendarPlan
{
    if (!expeditionOpen(rules, now))
    {
        return {};
    }

    if (now < 0n || now > 8640000000000000n)
    {
        expeditionFailure();
    }

    const census = [...new Set(realms.map((id) => cityInteger(id, 1)))].sort((a, b) => a - b);

    if (census.length !== realms.length || census.length > 128 || !census.includes(rules.kingdomId))
    {
        expeditionFailure();
    }

    const prior = state.latest;

    if (prior)
    {
        expeditionCalendarPhases(prior);

        if (now < long(prior, "createdAt"))
        {
            return {};
        }

        if (long(prior, "endTime") > now)
        {
            if (num(prior, "state") !== 0)
            {
                expeditionFailure();
            }

            return { current: prior };
        }
    }

    const stages = expeditionCalendarStages(rules),
        duration = stages.reduce((total, row) => total + row.durationMs, 0n);
    let schedule: ExpeditionPhase[],
        sourceId: string | null = null,
        cycle = prior ? cityInteger(prior.cycle, 1) : 1;

    if (prior)
    {
        const skipped = (now - long(prior, "endTime")) / duration;
        cycle = cityInteger(BigInt(cycle) + skipped + 1n, 1);
        schedule = phases(long(prior, "endTime") + skipped * duration, stages);
    }
    else
    {
        const legacy = state.legacy.filter(
            (row) => long(row, "endTime") > 0n && long(row, "endTime") < 9223372036854775807n,
        );

        if (legacy.length > 1)
        {
            expeditionFailure();
        }

        if (legacy.length)
        {
            const row = legacy[0]!,
                index = stages.findIndex((stage) => stage.stage === num(row, "state"));

            if (
                index < 0
                || long(row, "startTime") < 0n
                || long(row, "endTime") <= long(row, "startTime")
            )
            {
                expeditionFailure();
            }

            sourceId = text(row, "uuid");
            cycle = Math.max(1, cityInteger(row.count));
            schedule = [
                {
                    stage: stages[index]!.stage,
                    startTime: long(row, "startTime"),
                    endTime: long(row, "endTime"),
                },
                ...phases(long(row, "endTime"), stages.slice(index + 1)),
            ];
            const end = schedule.at(-1)!.endTime;

            if (end <= now)
            {
                const skipped = (now - end) / duration;
                cycle = cityInteger(BigInt(cycle) + skipped + 1n, 1);
                schedule = phases(end + skipped * duration, stages);
            }
        }
        else
        {
            const date = new Date(Number(now)),
                weekday = cityInteger(rules.items.get("17_wk")?.k4, 1, 7) % 7,
                distance = (weekday - date.getUTCDay() + 7) % 7 || 7;
            const waitingEnd = BigInt(
                Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + distance),
            );
            schedule = [
                { stage: 0, startTime: now, endTime: waitingEnd },
                ...phases(waitingEnd, stages.slice(1)),
            ];
        }
    }

    const startTime = schedule[0]!.startTime,
        endTime = schedule.at(-1)!.endTime;

    if (endTime > 8640000000000000n || startTime > now)
    {
        expeditionFailure();
    }

    const id = createHash("sha256")
        .update(JSON.stringify([sourceId, String(startTime), String(endTime)]))
        .digest("hex")
        .slice(0, 32);
    const create = {
        id,
        startTime,
        endTime,
        schedule: encode(schedule),
        expectedRealms: census.join("|"),
        createdAt: now,
        cycle,
        state: 0,
        sourceId,
    };

    return { current: create, create, ...(prior ? { close: text(prior, "id") } : {}) };
}
