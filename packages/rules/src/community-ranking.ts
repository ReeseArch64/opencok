import type { DonationRankingKind } from "@opencok/contracts/community-ranking";
import type { Row } from "@opencok/contracts/rows";
import { javaDecimal } from "./java-integer.ts";

const int = (value: unknown) => Number(javaDecimal(String(value ?? 0), 32));

const long = (value: unknown) => javaDecimal(String(value ?? 0), 64);

const day = 86400000;

export function rankingCalendar(now: number, offsetMinutes = 0)
{
    if (
        !Number.isSafeInteger(now)
        || !Number.isInteger(offsetMinutes)
        || Math.abs(offsetMinutes) > 840
    )
    {
        throw new Error("Invalid ranking clock");
    }

    const local = now + offsetMinutes * 60000;
    const start = Math.floor(local / day) * day;
    const date = new Date(start);

    if (!Number.isFinite(date.getTime()))
    {
        throw new Error("Invalid ranking date");
    }

    const weekday = date.getUTCDay();
    const sunday = start - weekday * day;
    const monday = start - ((weekday + 6) % 7) * day;
    const format = (time: number) => {
        const d = new Date(time);

        return `${String(d.getUTCFullYear()).padStart(4, "0")}${
            String(d.getUTCMonth() + 1).padStart(2, "0")
        }${String(d.getUTCDate()).padStart(2, "0")}`;
    };

    return {
        start: BigInt(start - offsetMinutes * 60000),
        nextDay: BigInt(start + day - offsetMinutes * 60000),
        nextMonday: BigInt(monday + 7 * day - offsetMinutes * 60000),
        dayKey: format(start),
        weekKey: format(sunday),
    };
}

export function donationRankingRows(
    rows: readonly Row[],
    kind: DonationRankingKind,
    now: number,
): Row[]
{
    if (rows.length > 32767)
    {
        throw new Error("Oversized donation ranking");
    }

    const calendar = rankingCalendar(now);
    const result = rows
        .filter((row) => row.profileUid != null)
        .map((row) => {
            const rank = int(row.rank);
            const current = long(row.donateTime) >= calendar.start
                && long(row.donateTime) < calendar.nextDay;
            const donation = kind === "today"
                ? current
                    ? int(row.todayprogress)
                    : 0
                : kind === "week"
                ? int(row.historyProgress)
                : int(row.progress);
            const honor = kind === "today"
                ? current
                    ? int(row.todaydonate)
                    : 0
                : kind === "week"
                ? int(row.historyDonate)
                : int(row.point);

            return {
                ...row,
                rank,
                donation,
                honor,
                key: (Math.imul(donation, 10) + rank) | 0,
                power: long(row.power),
            };
        });
    const power = (a: Row, b: Row) =>
        long(a.power) === long(b.power) ? 0 : long(a.power) > long(b.power) ? -1 : 1;

    return result.sort((a, b) => {
        if (kind === "today")
        {
            return (b.donation - a.donation) | 0 || (b.rank - a.rank) | 0 || power(a, b);
        }

        return (b.key - a.key) | 0 || (kind === "all" ? power(a, b) : 0);
    });
}
