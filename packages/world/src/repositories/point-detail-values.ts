import type { Row } from "../contracts/rows";

export function integer(value: unknown): value is number
{
    return (
        typeof value === "number"
        && Number.isInteger(value)
        && value >= -2147483648
        && value <= 2147483647
    );
}

export function validText(value: unknown, limit: number): value is string
{
    return (
        typeof value === "string"
        && value.length <= limit
        && value.isWellFormed()
        && !value.includes("\0")
    );
}

export function blank(value: string | null | undefined): boolean
{
    if (value == null)
    {
        return true;
    }

    return Array.from(value).every((character) => {
        const code = character.charCodeAt(0);

        return (
            (code >= 9 && code <= 13)
            || (code >= 28 && code <= 32)
            || code === 0x1680
            || code === 0x180e
            || (code >= 0x2000 && code <= 0x2006)
            || (code >= 0x2008 && code <= 0x200a)
            || [0x2028, 0x2029, 0x205f, 0x3000].includes(code)
        );
    });
}

export function authorized(
    profile: Row | undefined,
    observer: string,
    kingdomId: number,
    now: number,
): boolean
{
    if (profile?.uid !== observer || profile.serverId !== kingdomId)
    {
        return false;
    }

    const flag = profile.banFlag ?? 0;
    const until = profile.banTime ?? 0n;

    return (
        flag === 0
        && typeof until === "bigint"
        && BigInt.asIntN(64, until) === until
        && until <= BigInt(now)
    );
}

export function single<T>(rows: T[]): T | undefined
{
    if (rows.length > 1)
    {
        throw new Error("Ambiguous world detail row");
    }

    return rows[0];
}
