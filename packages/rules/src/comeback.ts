import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import type { ComebackSession, ComebackState } from "@opencok/contracts/comeback";
import type { Rule, Rules } from "./game";
import { cityInteger } from "./city-progression";
import { eventTimestamp } from "./local-events";
import { serverFeature } from "./power-context";
import { featureRealmEnabled, versionAtLeast } from "./availability";

export const comebackSessionKey = "comeback.session.v1";

export const comebackViewedKey = "comeback.viewed.v1";

const day = 86400000n;

export function comebackFailure(): never
{
    throw new GameError(errors.invalid, "city_progression");
}

export function comebackDeviceId(profile: Row)
{
    const device = text(profile, "deviceId"),
        uuid = text(profile, "deviceUuid");

    return device.trim() ? device : uuid.trim() ? uuid : `owner:${text(profile, "uid")}`;
}

export function decodeComebackSession(raw: string | undefined): ComebackSession | undefined
{
    if (raw === undefined)
    {
        return;
    }

    if (Buffer.byteLength(raw) > 2048)
    {
        comebackFailure();
    }

    const row = JSON.parse(raw) as Record<string, unknown>;

    if (
        !row
        || row.version !== 1
        || typeof row.sessionId !== "string"
        || !row.sessionId
        || row.sessionId.length > 64
        || !row.sessionId.isWellFormed()
        || row.sessionId.includes("\0")
    )
    {
        comebackFailure();
    }

    const time = (key: string) => {
        const value = row[key];

        if (
            typeof value !== "string"
            || !/^\d{1,19}$/.test(value)
            || BigInt(value) > 9223372036854775807n
        )
        {
            comebackFailure();
        }

        return BigInt(value);
    };
    const state = {
        sessionId: row.sessionId,
        openedAt: time("openedAt"),
        previousOnlineAt: time("previousOnlineAt"),
        devicePreviousOnlineAt: time("devicePreviousOnlineAt"),
        observedAt: time("observedAt"),
        closedAt: time("closedAt"),
    };

    if (
        state.openedAt <= 0n
        || state.observedAt < state.openedAt
        || (state.closedAt > 0n
            && (state.closedAt < state.openedAt || state.closedAt > state.observedAt))
    )
    {
        comebackFailure();
    }

    return state;
}

export function encodeComebackSession(state: ComebackSession)
{
    const value = JSON.stringify({
        version: 1,
        ...Object.fromEntries(
            Object.entries(state).map(([key, value]) => [
                key,
                typeof value === "bigint" ? String(value) : value,
            ]),
        ),
    });
    decodeComebackSession(value);

    return value;
}

export function comebackEnabled(rules: Rules, now: bigint)
{
    const version = rules.features.get("comeback")?.version;

    return (
        !!version
        && versionAtLeast("12.06.0", version)
        && serverFeature(rules, "comeback", {
            kingdomId: rules.kingdomId,
            version: "12.06.0",
            now: Number(now),
        })
    );
}

export function comebackConfigOpen(config: Rule, now: bigint)
{
    const start = config.StartTime,
        end = config.LastTime;
    const opened = start === "1"
        || (start !== "0" && eventTimestamp(start) !== undefined && now > eventTimestamp(start)!);
    const closed = end !== "1"
        && (end === "0" || eventTimestamp(end) === undefined || now > eventTimestamp(end)!);

    return opened && !closed;
}

export function comebackChannels(config: Rule)
{
    const rows = (config.activity_Type ?? "").split("|");

    if (rows.length > 3)
    {
        comebackFailure();
    }

    const channels = rows.map((row) => {
        const parts = row.split(";");

        if (parts.length !== 2)
        {
            comebackFailure();
        }

        return { type: cityInteger(parts[0], 1, 3), days: cityInteger(parts[1], 1, 365) };
    });

    if (new Set(channels.map((channel) => channel.type)).size !== channels.length)
    {
        comebackFailure();
    }

    return channels;
}

export function comebackDaily(config: Rule)
{
    const days = (config.daily ?? "").split("|").map((raw) => cityInteger(raw, 1, 365)),
        rewards = (config.reward_daily ?? "").split("|");

    if (
        days.length > 15
        || days.length !== rewards.length
        || new Set(days).size !== days.length
        || days.join(";").length > 30
        || rewards.some((id) => !/^\d{1,12}$/.test(id))
    )
    {
        comebackFailure();
    }

    return days.map((day, index) => ({ day, reward: rewards[index]! }));
}

export function comebackPayNodes(config: Rule)
{
    const nodes = (config.pay_node ?? "").split("|").map((raw) => cityInteger(raw, 1)),
        rewards = (config.pay_reward ?? "").split("|");

    if (
        nodes.length > 15
        || nodes.length !== rewards.length
        || new Set(nodes).size !== nodes.length
        || nodes.join(";").length > 100
        || rewards.some((id) => !/^\d{1,12}$/.test(id))
    )
    {
        comebackFailure();
    }

    return nodes.map((pay, index) => ({ pay, reward: rewards[index]! }));
}

export function comebackClaims(raw: unknown, maximum = 100)
{
    const value = String(raw ?? "");

    if (value.length > maximum || (value && !/^\d+(?:;\d+)*$/.test(value)))
    {
        comebackFailure();
    }

    const values = value ? value.split(";").map((entry) => cityInteger(entry, 1)) : [];

    if (new Set(values).size !== values.length)
    {
        comebackFailure();
    }

    return values;
}

function matches(raw: string | undefined, value: string)
{
    return raw === "0" || !!raw?.split("|").includes(value);
}

function band(raw: string | undefined, value: number)
{
    if (raw === "0")
    {
        return true;
    }

    const parts = (raw ?? "").split(";").map((part) => cityInteger(part));

    if (parts.length !== 2 || parts[0]! > parts[1]!)
    {
        comebackFailure();
    }

    return value >= parts[0]! && value <= parts[1]!;
}

function canReward(
    config: Rule,
    profile: Row,
    castle: number,
    totalCharge: number,
    type: number,
    lostDays: number,
    rules: Rules,
)
{
    const levels = [
        [0, 5],
        [6, 50],
        [51, 200],
        [201, 500],
        [501, 1000],
        [1001, 5000],
        [5001, 10000],
        [10001, 2100000000],
    ];

    if (config.pay_lv !== "0")
    {
        const selected = (config.pay_lv ?? "").split("|").map((raw) => cityInteger(raw, 1, 8));

        if (!selected.length || selected.length > 8)
        {
            comebackFailure();
        }

        if (
            totalCharge < levels[selected[0]! - 1]![0]!
            || totalCharge > levels[selected.at(-1)! - 1]![1]!
        )
        {
            return false;
        }
    }

    return (
        band(config.castle_lv, castle)
        && band(config.lord_lv, num(profile, "level"))
        && band(config.lost_date, lostDays)
        && (config.server === "0" || featureRealmEnabled(config.server, rules.kingdomId))
        && matches(config.country, text(profile, "country"))
        && matches(config.language, text(profile, "lang"))
        && (config.version === "0"
            || (!!config.version && versionAtLeast("12.06.0", config.version)))
        && matches(config.platform, text(profile, "platform"))
        && matches(config.back_Type, String(type))
    );
}

export function comebackRecord(state: ComebackState): Row | undefined
{
    if (state.records.length > 64)
    {
        comebackFailure();
    }

    return [...state.records].sort((a, b) =>
        long(a, "backTime") === long(b, "backTime")
            ? text(a, "configId").localeCompare(text(b, "configId"))
            : long(a, "backTime") > long(b, "backTime")
            ? -1
            : 1
    )[0];
}

export function comebackEnrollment(
    rules: Rules,
    state: ComebackState,
    profile: Row,
    castle: number,
    now: bigint,
)
{
    if (!comebackEnabled(rules, now) || num(profile, "crossFightSrcServerId") > 0)
    {
        return;
    }

    const existing = comebackRecord(state),
        session = state.session;

    if (existing)
    {
        const current = rules.advanced.comebacks?.get(text(existing, "configId"));

        if (!current || comebackConfigOpen(current, now))
        {
            return;
        }
    }

    if (!session || session.closedAt > 0n || session.openedAt > now)
    {
        return;
    }

    const configs = [...(rules.advanced.comebacks?.values() ?? [])].filter(
        (rule) => rule.StartTime !== "0",
    );

    if (configs.length > 256)
    {
        comebackFailure();
    }

    configs.sort((a, b) => cityInteger(b.weight) - cityInteger(a.weight));

    for (const config of configs)
    {
        if (!comebackConfigOpen(config, now))
        {
            continue;
        }

        const forced = num(profile, "backFlag_mc") > 0
            ? 3
            : num(profile, "backFlag_op") > 0
            ? 4
            : 0;
        const inherited = !existing
            && num(state.deviceRecord ?? {}, "backType") === 1
            && long(state.deviceRecord!, "backTime") > 0n
            && long(state.deviceRecord!, "backTime") <= now;
        const returning = !!existing;
        const previous = !forced && (returning || inherited)
            ? session.previousOnlineAt
            : session.devicePreviousOnlineAt;
        const at = session.openedAt;
        const lost = previous > 0n && previous <= at ? Number((at - previous) / day) : 0;

        if (existing && lost < cityInteger(config.lost_condition))
        {
            continue;
        }

        let type = forced;

        if (!type)
        {
            if (previous <= 0n || previous > at)
            {
                continue;
            }

            const interval = config.target_SetupTime ?? "";

            if (interval.includes("|"))
            {
                const bounds = interval.split("|");
                const start = eventTimestamp(bounds[0]),
                    end = eventTimestamp(bounds[1]);

                if (bounds.length !== 2 || start === undefined || end === undefined)
                {
                    comebackFailure();
                }

                if (previous < start || previous > end)
                {
                    continue;
                }
            }
            else if (lost < cityInteger(interval === "0" ? 30 : interval, 1, 36500))
            {
                continue;
            }

            type = returning ? 2 : 1;
        }

        const ownLost = session.previousOnlineAt > 0n && session.previousOnlineAt <= at
            ? Number((at - session.previousOnlineAt) / day)
            : 0;

        if (!canReward(config, profile, castle, state.totalCharge, type, ownLost, rules))
        {
            continue;
        }

        comebackChannels(config);

        return { config, type };
    }
}

export function comebackActiveChannels(config: Rule, record: Row, now: bigint)
{
    const back = long(record, "backTime");

    if (back <= 0n || back > now)
    {
        return [];
    }

    const days = Number(now / day - back / day) + 1;

    return comebackChannels(config)
        .filter((channel) => days <= channel.days)
        .map((channel) => ({ ...channel, end: back + BigInt(channel.days) * day }));
}
