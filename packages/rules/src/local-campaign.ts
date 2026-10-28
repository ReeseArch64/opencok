import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { eventTimestamp } from "./local-events";

export function campaignFailure(): never
{
    throw new GameError(errors.unsupported, "city_progression");
}

export function campaignNumber(value: unknown): bigint
{
    if (!/^-?\d{1,19}$/.test(String(value)))
    {
        campaignFailure();
    }

    const result = BigInt(String(value));

    if (result < -9223372036854775808n || result > 9223372036854775807n)
    {
        campaignFailure();
    }

    return result;
}

export function campaignCompare(left: bigint, operator: string, right: bigint)
{
    switch (operator)
    {
        case "=":
        case "==":
            return left === right;
        case "!=":
        case "<>":
            return left !== right;
        case ">":
            return left > right;
        case "<":
            return left < right;
        case ">=":
            return left >= right;
        case "<=":
            return left <= right;
        default:
            return campaignFailure();
    }
}

export function campaignMath(left: bigint, operator: string, right: bigint)
{
    if ((operator === "/" || operator === "%") && right === 0n)
    {
        campaignFailure();
    }

    switch (operator)
    {
        case "+":
            return BigInt.asIntN(64, left + right);
        case "-":
            return BigInt.asIntN(64, left - right);
        case "*":
            return BigInt.asIntN(64, left * right);
        case "/":
            return BigInt.asIntN(64, left / right);
        case "%":
            return left % right;
        default:
            return campaignFailure();
    }
}

export function campaignTimestamp(raw: string | undefined)
{
    const match = raw?.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}):(\d{2}):(\d{2})$/);

    if (!match || Number(match[4]) > 59)
    {
        return undefined;
    }

    const at = eventTimestamp(`${match[1]}-${match[2]}-${match[3]}`);

    return at === undefined ? undefined : at + BigInt(match[4]!) * 1000n;
}

export function campaignRefresh(at: bigint, now: bigint, type: number, interval: number)
{
    if (type === 0)
    {
        return false;
    }

    if (type === 1 || type === 2)
    {
        return now - at >= BigInt(interval) * (type === 1 ? 60000n : 3600000n);
    }

    if (type === 3)
    {
        return now / 86400000n - at / 86400000n >= BigInt(interval);
    }

    if (type === 4)
    {
        return (now / 86400000n + 3n) / 7n - (at / 86400000n + 3n) / 7n >= BigInt(interval);
    }

    const a = new Date(Number(at)),
        b = new Date(Number(now));

    if (type === 5)
    {
        return a.getUTCFullYear() !== b.getUTCFullYear() || a.getUTCMonth() !== b.getUTCMonth();
    }

    if (type === 6)
    {
        return a.getUTCFullYear() !== b.getUTCFullYear();
    }

    return campaignFailure();
}

export function campaignEventMatches(
    code: number,
    parameters: string | undefined,
    selector: string,
)
{
    if (code !== 62)
    {
        return !parameters || parameters === selector;
    }

    const expected = (parameters ?? "").split(";"),
        actual = selector.split(";");

    return (
        expected.length === 2
        && actual.length === 2
        && expected.every(Boolean)
        && actual.every(Boolean)
        && expected.every((value, index) => value === "-1" || value === actual[index])
    );
}
