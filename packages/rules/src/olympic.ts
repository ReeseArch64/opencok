import { cityAmount, cityInteger } from "./city-progression";
import { eventTimestamp } from "./local-events";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import type { Rules } from "./game";

export function olympicPeriod(rules: Rules)
{
    const panel = rules.power.activityPanels?.get("57092"),
        start = eventTimestamp(panel?.start),
        end = eventTimestamp(panel?.end);

    if (!panel || start === undefined || end === undefined || start >= end)
    {
        return;
    }

    return { start, end, enabled: panel.function_on === "1" };
}

export function olympicDefinitions(rules: Rules): Row[]
{
    const rows = [...(rules.advanced.olympicBets?.values() ?? [])];

    if (rows.length > 256)
    {
        throw new Error("Olympic question bound exceeded");
    }

    return rows.map((rule) => {
        const startBetTime = eventTimestamp(rule.start),
            startTime = eventTimestamp(rule.end),
            id = rule.id;

        if (
            !id
            || id.length > 40
            || startBetTime === undefined
            || startTime === undefined
            || startBetTime >= startTime
            || (rule.result?.length ?? 0) > 10
        )
        {
            throw new Error("Invalid Olympic question");
        }

        const type = cityInteger(rule.type, 0, 5);

        if (type === 4)
        {
            throw new Error("Unsupported Olympic resource");
        }

        const tax = Number(rule.earn_ratio ?? 10);

        return {
            id,
            startBetTime,
            startTime,
            type,
            basic: cityAmount(rule.basic),
            limit: cityInteger(rule.limit ?? 10000),
            cap: cityInteger(rule.limit1, 1),
            rate: cityInteger(rule.rate),
            cheat: cityAmount(rule.cheat),
            tax: Number.isSafeInteger(tax) && tax >= 0 && tax <= 50 ? tax : 10,
            result: rule.result ?? "",
        };
    });
}

export function olympicPayout(amount: number, question: Row)
{
    const stake = BigInt(cityInteger(amount, 1)),
        winners = cityAmount(question.winningBetNum),
        pool = cityAmount(question.rewardPool),
        tax = BigInt(cityInteger(question.tax, 0, 50));

    if (!winners || stake > winners)
    {
        throw new Error("Invalid Olympic winning pool");
    }

    let profit = (stake * pool * (100n - tax)) / (winners * 100n) + 1n;

    if (pool === 0n && profit > BigInt(cityInteger(question.rewardLimit)))
    {
        profit = BigInt(cityInteger(question.rewardLimit));
    }

    const total = stake + profit;

    return total > 2147483647n ? 2147483647 : Number(total);
}

export function olympicDisplayedPool(question: Row, definition: Row, now: bigint)
{
    const end = long(question, "startTime"),
        elapsed = (now > end ? end : now) - long(question, "startBetTime"),
        delta = Math.trunc(Number(BigInt.asIntN(32, elapsed)) / 600000),
        factor = Math.pow(1 + num(definition, "rate") * 0.001, delta),
        whole = Number.isNaN(factor)
            ? 0n
            : factor >= Number(9223372036854775807n)
            ? 9223372036854775807n
            : BigInt(Math.trunc(factor));

    return BigInt.asIntN(64, whole * cityAmount(definition.cheat) + long(question, "betNum"));
}

export async function reconcileOlympicQuestions(
    current: readonly Row[],
    definitions: readonly Row[],
    enabled: boolean,
    now: bigint,
    winningStake: (id: string, result: string) => Promise<bigint>,
)
{
    const rows = new Map(current.map((row) => [text(row, "id"), { ...row }]));

    for (const definition of definitions)
    {
        const id = text(definition, "id");
        let row = rows.get(id);

        if (
            !row
            && enabled
            && now >= long(definition, "startBetTime")
            && now <= long(definition, "startTime")
        )
        {
            row = {
                id,
                result: "",
                startBetTime: long(definition, "startBetTime"),
                startTime: long(definition, "startTime"),
                ended: 0,
                betNum: 0n,
                winningBetNum: null,
                rewardPool: null,
                tax: null,
                rewardLimit: null,
            };
            rows.set(id, row);
        }

        if (
            !row
            || num(row, "ended") === 1
            || now < long(row, "startTime")
            || !text(definition, "result")
        )
        {
            continue;
        }

        const winners = cityAmount(await winningStake(id, text(definition, "result"))),
            total = cityAmount(row.betNum);

        if (winners > total)
        {
            throw new Error("Invalid Olympic pool totals");
        }

        row.result = text(definition, "result");
        row.ended = 1;
        row.winningBetNum = winners;
        row.rewardPool = total > winners ? total - winners : cityAmount(definition.basic) / 10n;
        row.tax = cityInteger(definition.tax, 0, 50);
        row.rewardLimit = cityInteger(definition.limit);
    }

    return [...rows.values()];
}
