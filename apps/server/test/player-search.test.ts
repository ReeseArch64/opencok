import { expect, test } from "bun:test";
import {
    playerSearchQuery,
    playerSearchPage,
    playerSearchRemoteBudget,
    selectPlayerSearch,
} from "@opencok/rules/player-search";
import { playerSearch, playerSearchEntry } from "@opencok/mappings/player-search";
import type {
    PlayerSearchQuery,
    PlayerSearchRemote,
    PlayerSearchResult,
} from "@opencok/contracts/player-search";
import type { Row } from "@opencok/contracts/rows";
import { Rules } from "@opencok/rules/game";
import { sfs, decode, encode, fields } from "@opencok/messages/sfs";
import oracle from "./fixtures/player-search.json";

const rules = (maximum = "100", minimum = "5") =>
    new Rules(
        new Map(),
        new Map(),
        new Map(),
        new Map(),
        new Map([["lookfor", { k1: minimum, k2: maximum }]]),
    );
const query = (maximum = 100, cross = true, page = 1) =>
    playerSearchQuery("King", page, cross, 1, rules(String(maximum)));
const local = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
        uid: `L${i}`,
        name: `King ${i}`,
        level: 10,
        power: BigInt(i),
    }));
function remotes(count: number): PlayerSearchRemote[]
{
    return Array.from({ length: count }, (_, i) => {
        const key = `r${String(i).padStart(2, "0")}`;
        const data: Row = i % 7 === 0
            ? {}
            : { uid: key, mainBuildingLevel: i % 3 === 0 ? 0 : i % 3 === 1 ? 4 : 10 };
        return {
            key,
            kingdomId: 2,
            data,
        };
    });
}

test("ten-entry slicing matches 1680 frozen Java primitive cases including signed wrapping and null boundaries", () => {
    type Vector = [number, number, number, number, "error" | (string | null)[]];
    expect(oracle.cuts).toHaveLength(1680);
    for (const [count, page, max, nullAt, expected] of oracle.cuts as Vector[])
    {
        const rows = Array.from({ length: count }, (_, i) => (i === nullAt ? null : String(i)));
        if (expected === "error")
        {
            expect(() => playerSearchPage(rows, page, max)).toThrow();
        }
        else
        {
            expect(playerSearchPage(rows, page, max)).toEqual(expected);
        }
    }
});

test("local and cross selection match 2385 frozen Java list/hash-map cases", () => {
    type Vector = [
        number,
        number,
        number,
        number,
        "error" | [number | null, number, number, string[]],
    ];
    expect(oracle.searches).toHaveLength(2385);
    for (const [maximum, count, page, remoteCount, expected] of oracle.searches as Vector[])
    {
        const plan = query(maximum, remoteCount >= 0, page);
        const rows = local(count),
            remote = remotes(Math.max(0, remoteCount));
        if (expected === "error")
        {
            expect(() => selectPlayerSearch(plan, rows, remote)).toThrow();
        }
        else
        {
            const [budget, total, replyPage, ids] = expected;
            if (budget !== null)
            {
                expect(playerSearchRemoteBudget(plan, rows).limit).toBe(budget);
            }
            const result = selectPlayerSearch(plan, rows, remote);
            expect(result.entries.map((entry) => entry.data.uid)).toEqual(ids);
            expect(result.total).toBe(BigInt(total));
            expect(result.page).toBe(replyPage);
            expect(result.maximum).toBe(BigInt(maximum));
            expect(result.key).toBe("King");
            expect(decode(encode(playerSearch(result)))).toEqual(playerSearch(result));
        }
    }
});

test("query catalog parsing retains Java decimal syntax and explicit capacity bounds", () => {
    const plan = playerSearchQuery("  King%_  ", -1, true, 2, rules("+１００", "-２"));
    expect(plan).toEqual({
        key: "  King%_  ",
        page: -1,
        cross: true,
        kingdomId: 2,
        minimumLevel: -2,
        maximum: 100,
        limit: 101,
    });
    expect(Object.isFrozen(plan)).toBe(true);
    for (const value of ["", " 100", "1.0", "100x", "2147483648", "-1", "32767"])
    {
        expect(() => playerSearchQuery("", 1, true, 1, rules(value))).toThrow();
    }
    for (const value of ["", "5 ", "2147483648", "-2147483649"])
    {
        expect(() => playerSearchQuery("", 1, true, 1, rules("100", value))).toThrow();
    }
    expect(playerSearchQuery("", 1, false, 1, rules("32766")).limit).toBe(32767);
    expect(() => playerSearchQuery("", 1, false, 1, new Rules(new Map(), new Map(), new Map())))
        .toThrow();
    for (const page of [NaN, Infinity, 1.5, 2147483648])
    {
        expect(() => playerSearchQuery("", page, true, 1, rules())).toThrow();
    }
    for (const kingdom of [0, -1, 1.5, 2147483648])
    {
        expect(() => playerSearchQuery("", 1, true, kingdom, rules())).toThrow();
    }
    for (const key of ["\0", "\ud800", "x".repeat(32768)])
    {
        expect(() => playerSearchQuery(key, 1, true, 1, rules())).toThrow();
    }
    expect(playerSearchQuery("😀", 1, true, 1, rules()).key).toBe("😀");
});

test("cross mode uses only local page one and budgets directory candidates before remote eligibility", () => {
    const plan = query(100, true, 2),
        rows = local(101);
    expect(playerSearchRemoteBudget(plan, rows)).toEqual({ limit: 192, minimumLevel: 3 });
    const remote = Array.from({ length: 15 }, (_, i) => ({
        key: `R${i}`,
        kingdomId: 2,
        data: { uid: `R${i}`, mainBuildingLevel: 20 },
    }));
    const result = selectPlayerSearch(plan, rows, remote);
    expect(result.total).toBe(25n);
    expect(result.page).toBe(2);
    expect(result.entries).toHaveLength(10);
    expect(result.entries.every((entry) => entry.remote)).toBe(true);
    expect(result.entries.some((entry) => entry.data.uid === "L10")).toBe(false);
    const own = selectPlayerSearch(query(100, false, 2), rows);
    expect(own.page).toBe(1);
    expect(own.total).toBe(101n);
    expect(own.entries.map((entry) => entry.data.uid)).toEqual(
        Array.from({ length: 10 }, (_, i) => `L${i + 10}`),
    );
    expect(selectPlayerSearch(query(100, false, 999), local(10)).entries).toHaveLength(10);
    expect(selectPlayerSearch(query(100, false, 11), rows).entries).toEqual([]);
    const wrapped = { ...query(), minimumLevel: -2147483648 };
    expect(playerSearchRemoteBudget(wrapped, []).minimumLevel).toBe(2147483646);
    expect(playerSearchRemoteBudget(query(100, false), rows).limit).toBe(0);
    const repeated = selectPlayerSearch(
        query(),
        [local(1)[0]!, local(1)[0]!],
        [{ key: "L0", kingdomId: 2, data: { uid: "L0", mainBuildingLevel: 10 } }],
    );
    expect(repeated.entries.map((entry) => [entry.data.uid, entry.remote])).toEqual([
        ["L0", false],
        ["L0", false],
        ["L0", true],
    ]);
    expect(repeated.total).toBe(3n);
    expect(() => playerSearchRemoteBudget(query(32766, true), [])).toThrow();
});

test("remote selection handles missing cache entries, positive castle filtering and last map replacement", () => {
    const remote: PlayerSearchRemote[] = [
        { key: "missing", kingdomId: 2, data: {} },
        { key: "empty", kingdomId: 2, data: { uid: "empty" } },
        { key: "small", kingdomId: 2, data: { uid: "small", mainBuildingLevel: 4 } },
        { key: "zero", kingdomId: 2, data: { uid: "zero", mainBuildingLevel: 0 } },
        { key: "yes", kingdomId: 2, data: { uid: "yes", mainBuildingLevel: 5, name: "old" } },
        { key: "yes", kingdomId: 3, data: { uid: "yes", mainBuildingLevel: 6, name: "new" } },
    ];
    const result = selectPlayerSearch(query(), [], remote);
    expect(result.total).toBe(1n);
    expect(result.entries).toEqual([
        { kingdomId: 3, remote: true, data: { uid: "yes", mainBuildingLevel: 6, name: "new" } },
    ]);
    const negative = { ...query(), minimumLevel: -5 };
    expect(
        selectPlayerSearch(
            negative,
            [],
            [{ key: "zero", kingdomId: 2, data: { uid: "zero", mainBuildingLevel: 0 } }],
        ).entries,
    ).toEqual([]);
    for (
        const entry of [
            { key: "", kingdomId: 2, data: {} },
            { key: "one", kingdomId: 2, data: { uid: "other", mainBuildingLevel: 10 } },
            { key: "one", kingdomId: 0, data: { uid: "one", mainBuildingLevel: 10 } },
            { key: "one", kingdomId: 2, data: { uid: "one", mainBuildingLevel: "10" } },
        ] as PlayerSearchRemote[]
    )
    {
        expect(() => selectPlayerSearch(query(), [], [entry])).toThrow();
    }
});

test("injected query/candidate bounds cannot bypass the pure policy", () => {
    for (
        const patch of [
            { maximum: -1 },
            { limit: 1 },
            { kingdomId: 0 },
            { cross: null },
            { key: "\0" },
            { page: 1.5 },
        ]
    )
    {
        expect(() => selectPlayerSearch({ ...query(), ...patch } as PlayerSearchQuery, []))
            .toThrow();
    }
    expect(() => selectPlayerSearch(query(10), local(12))).toThrow();
    expect(() => selectPlayerSearch(query(), [{ uid: "low", level: 4 }])).toThrow();
    expect(() => selectPlayerSearch(query(), [{ uid: "", level: 10 }])).toThrow();
    expect(() => selectPlayerSearch(query(1), [], remotes(5))).toThrow();
    expect(() => selectPlayerSearch(query(100, false), [], remotes(1))).toThrow();
    expect(() => playerSearchPage([], 1, -1)).toThrow();
    expect(() => playerSearchPage(Array(32768).fill(1), 1, 1)).toThrow();
    const collisionKeys = Array.from(
        { length: 16 },
        (_, n) => Array.from({ length: 4 }, (_, bit) => (n & (1 << bit) ? "Aa" : "BB")).join(""),
    );
    expect(() =>
        selectPlayerSearch(
            query(),
            [],
            collisionKeys.map((key) => ({
                key,
                kingdomId: 2,
                data: { uid: key, mainBuildingLevel: 10 },
            })),
        )
    ).toThrow();
});

test("local SQL projection retains null omission and signed power without adding shared-profile fields", () => {
    const row: Row = {
        uid: "1",
        name: " King ",
        lang: null,
        pic: null,
        picVer: null,
        power: -9223372036854775808n,
        alliancename: null,
        abbr: null,
        level: 10,
        gold: 999n,
        deviceId: "private",
        mainBuildingLevel: 99,
    };
    const value = playerSearchEntry({ data: row, kingdomId: 2, remote: false });
    expect(value).toEqual({
        serverId: sfs.int(2),
        uid: sfs.string("1"),
        name: sfs.string(" King "),
        power: sfs.long(-9223372036854775808n),
        level: sfs.int(10),
    });
    const full = playerSearchEntry({
        data: {
            ...row,
            pic: "g001",
            picVer: 0,
            lang: "pt",
            alliancename: "Alliance",
            abbr: "ALL",
            power: 0n,
        },
        kingdomId: 1,
        remote: false,
    });
    expect(full.power).toEqual(sfs.long(0n));
    expect(full.alliancename).toEqual(sfs.string("Alliance"));
    expect(full.picVer).toEqual(sfs.int(0));
    expect(full.mainBuildingLevel).toBeUndefined();
    expect(full.vipLevel).toBeUndefined();
    expect(decode(encode(full))).toEqual(full);
});

test("remote shared-profile projection preserves sparse positive longs and version/default integer fields", () => {
    const value = playerSearchEntry({
        kingdomId: 2,
        remote: true,
        data: {
            uid: "1",
            name: "Remote",
            mainBuildingLevel: 15,
            power: 9007199254740993n,
            vipEndTime: 9223372036854775807n,
            offLineTime: 1n,
            picVer: 2,
            picfraId: 3,
            allianceId: "A",
            abbr: "ALL",
            lang: "en",
            gmFlag: 1,
            crossFightSrcServerId: 7,
            vipLevel: 4,
            svipLevel: 5,
            rank: 6,
            alliancename: "Not selected",
            gold: 999n,
        },
    });
    expect(value).toEqual({
        serverId: sfs.int(2),
        uid: sfs.string("1"),
        name: sfs.string("Remote"),
        lang: sfs.string("en"),
        abbr: sfs.string("ALL"),
        allianceId: sfs.string("A"),
        picVer: sfs.int(2),
        picfraId: sfs.int(3),
        gmFlag: sfs.int(1),
        crossFightSrcServerId: sfs.int(7),
        vipLevel: sfs.int(4),
        svipLevel: sfs.int(5),
        rank: sfs.int(6),
        power: sfs.long(9007199254740993n),
        vipEndTime: sfs.long(9223372036854775807n),
        offLineTime: sfs.long(1n),
        mainBuildingLevel: sfs.int(15),
        level: sfs.int(15),
    });
    expect(decode(encode(value))).toEqual(value);
    const sparse = playerSearchEntry({
        kingdomId: 1,
        remote: true,
        data: {
            uid: "1",
            power: -1n,
            vipEndTime: 0n,
            offLineTime: -9223372036854775808n,
            mainBuildingLevel: 0,
        },
    });
    expect(sparse).toEqual({
        serverId: sfs.int(1),
        uid: sfs.string("1"),
        picVer: sfs.int(0),
        picfraId: sfs.int(0),
        gmFlag: sfs.int(0),
        vipLevel: sfs.int(0),
        svipLevel: sfs.int(0),
        rank: sfs.int(0),
        crossFightSrcServerId: sfs.int(-1),
    });
});

test("wire projection rejects malformed numbers/strings and validates the search envelope", () => {
    for (const remote of [false, true])
    {
        for (
            const patch of [
                { uid: "" },
                { uid: "\ud800" },
                { name: "\0" },
                { picVer: 1.5 },
                { power: 1 },
                { power: 9223372036854775808n },
            ] as Row[]
        )
        {
            expect(() => playerSearchEntry({ kingdomId: 1, remote, data: { uid: "1", ...patch } }))
                .toThrow();
        }
    }
    const result: PlayerSearchResult = { key: "", page: 1, total: 0n, maximum: 100n, entries: [] };
    expect(playerSearch(result)).toEqual({
        key: sfs.string(""),
        page: sfs.int(1),
        total: sfs.long(0n),
        max: sfs.long(100n),
        list: sfs.array(),
    });
    for (
        const patch of [
            { key: "\0" },
            { page: 1.5 },
            { total: -1n },
            { total: 9223372036854775808n },
            { maximum: -1n },
        ]
    )
    {
        expect(() => playerSearch({ ...result, ...patch })).toThrow();
    }
    const actual = playerSearch(selectPlayerSearch(query(100, false), local(1)));
    const first = fields((actual.list!.value as ReturnType<typeof sfs.object>[])[0]!);
    expect(first.uid).toEqual(sfs.string("L0"));
    expect(Object.keys(actual).sort()).toEqual(["key", "list", "max", "page", "total"]);
});
