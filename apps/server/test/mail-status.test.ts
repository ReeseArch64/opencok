import { expect, test } from "bun:test";
import { mailStatusQuery, calculateMailStatus } from "@opencok/rules/mail";
import { mailStatus } from "@opencok/mappings/mail";
import type { MailStatusCount } from "@opencok/contracts/mail";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const now = 1792756800000;
function count(type: number, status = 0, amount = 1n, allianceNotice = false): MailStatusCount
{
    return { type, status, count: amount, allianceNotice };
}
function result(category: number | undefined, counts: MailStatusCount[])
{
    return decode(encode(mailStatus(calculateMailStatus(mailStatusQuery(category, now), counts))));
}

test("empty mailbox status returns eight int category objects or a selected pair of longs", () => {
    expect(result(undefined, [])).toEqual(
        Object.fromEntries(
            Array.from({ length: 8 }, (_, i) => [
                String(i + 1),
                sfs.object({ total: sfs.int(0), unread: sfs.int(0) }),
            ]),
        ),
    );
    for (let category = 1; category <= 8; category++)
    {
        expect(result(category, [])).toEqual({ total: sfs.long(0), unread: sfs.long(0) });
    }
    for (const category of [-2147483648, -1, 0, 9, 2147483647])
    {
        expect(result(category, [])).toEqual({});
    }
});

test("combined mailbox mappings cover message, moderation, battle and bottle variants without inventing categories", () => {
    const groups = [
        2,
        14,
        11,
        28,
        29,
        13,
        15,
        16,
        32,
        21,
        22,
        20,
        37,
        38,
        45,
        46,
        17,
        25,
        26,
        27,
        33,
        10,
        34,
        35,
        36,
        6,
        7,
        8,
        18,
        30,
        48,
        9,
        12,
        5,
        42,
        23,
        24,
        39,
        40,
        43,
        44,
    ].map((type) => count(type));
    expect(result(undefined, [...groups, count(0), count(49), count(999)])).toEqual(
        Object.fromEntries(
            [5, 3, 1, 7, 9, 10, 4, 2].map((total, index) => [
                String(index + 1),
                sfs.object({ total: sfs.int(total), unread: sfs.int(total) }),
            ]),
        ),
    );
});

test("special title and overlapping alliance gifts intentionally differ between combined and selected categories", () => {
    const counts = [count(2, 0, 3n, true), count(34, 1, 2n), count(999, 0, 5n, true)];
    expect(result(undefined, counts)["1"]).toEqual(
        sfs.object({ total: sfs.int(0), unread: sfs.int(0) }),
    );
    expect(result(undefined, counts)["5"]).toEqual(
        sfs.object({ total: sfs.int(10), unread: sfs.int(8) }),
    );
    expect(result(1, counts)).toEqual({ total: sfs.long(5), unread: sfs.long(3) });
    expect(result(5, counts)).toEqual({ total: sfs.long(2), unread: sfs.long(0) });
});

test("mail status counts preserve int wrapping, long precision and distinct invalid-status behavior", () => {
    expect(result(undefined, [count(2, 0, 2147483648n)])["1"]).toEqual(
        sfs.object({ total: sfs.int(-2147483648), unread: sfs.int(-2147483648) }),
    );
    expect(result(1, [count(2, 0, 9007199254740993n)])).toEqual({
        total: sfs.long(9007199254740993n),
        unread: sfs.long(9007199254740993n),
    });
    expect(result(1, [count(2, 0, 9223372036854775807n), count(2, 1, 1n)])).toEqual({
        total: sfs.long(-9223372036854775808n),
        unread: sfs.long(9223372036854775807n),
    });
    expect(() => result(undefined, [count(2, 2)])).toThrow("102192");
    expect(() => result(undefined, [count(999, -1, 1n, true)])).toThrow("102192");
    expect(result(1, [count(2, 2), count(2, 0)])).toEqual({
        total: sfs.long(1),
        unread: sfs.long(1),
    });
    expect(result(undefined, [count(999, 99)])["1"]).toEqual(
        sfs.object({ total: sfs.int(0), unread: sfs.int(0) }),
    );
});

test("mail status rejects malformed snapshots and noninteger selectors before emitting counts", () => {
    for (const category of [NaN, Infinity, 1.5, 2147483648])
    {
        expect(() => mailStatusQuery(category, now)).toThrow();
    }
    expect(() => mailStatusQuery(1, NaN)).toThrow();
    for (
        const counts of [
            [count(2), count(2)],
            [count(2, 0, 0n)],
            [count(2, 0, -1n)],
            [count(2, 0, 9223372036854775808n)],
            [count(2.5)],
            Array.from({ length: 32768 }, (_, i) => count(i)),
        ]
    )
    {
        expect(() => result(undefined, counts)).toThrow("102192");
    }
});
