import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as kingdom from "@opencok/drizzle/schema/kingdom";
import * as global from "@opencok/drizzle/schema/global";
import {
    createWorldFavoriteStore,
    checkWorldFavoriteStore,
} from "@opencok/repositories/world-favorites";
import { favoriteName, favoriteServer, favoriteServerType } from "@opencok/rules/world-favorites";
import { Rules, type Rule } from "@opencok/rules/game";
import { GameService as Game } from "@opencok/services/game";
import type { Row } from "@opencok/contracts/rows";
import type { GameStore } from "@opencok/contracts/game";
import { sfs, fields, encode, decode, Type, type Fields } from "@opencok/messages/sfs";
import { worldFavorites } from "@opencok/mappings/world-favorites";
import oracle from "./fixtures/world-favorite-names.json";

const now = 1792756800123;
const ruleSet = () =>
    new Rules(
        new Map(),
        new Map(),
        new Map(),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        undefined,
        undefined,
        undefined,
        {
            servers: new Map<string, Rule>([
                ["1", { id: "1" }],
                ["3", { id: "3" }],
                ["9", { id: "9", test: "true" }],
            ]),
        },
    );
function fixture()
{
    let state = { profile: ["self", 1, 0n, 0] as unknown[] | null, rows: [] as unknown[][] };
    let working = structuredClone(state),
        failure = "",
        active = false;
    let clock = now;
    let types: unknown[][] = [
        [1, 0],
        [2, 4],
        [3, 22],
    ];
    const queries: { text: string; params: unknown[]; }[] = [],
        globalQueries: { text: string; params: unknown[]; }[] = [];
    const client = {
        query: async (query: { text: string; }, params: unknown[] = []) => {
            const text = query.text;
            queries.push({ text, params });
            if (text.startsWith("begin"))
            {
                expect(active).toBe(false);
                active = true;
                working = structuredClone(state);
                return { rows: [] };
            }
            if (text === "rollback")
            {
                active = false;
                return { rows: [] };
            }
            if (text === "commit")
            {
                active = false;
                if (failure === "commit")
                {
                    throw new Error("Synthetic commit failure");
                }
                state = working;
                if (failure === "lost")
                {
                    throw new Error("Synthetic lost commit reply");
                }
                return { rows: [] };
            }
            if (text.startsWith("select"))
            {
                if (params[0] === 0)
                {
                    return { rows: [] };
                }
                if (text.includes("\"userprofile\""))
                {
                    expect(params).toEqual(["self", 1]);
                    if (failure === "profile")
                    {
                        throw new Error("Synthetic profile failure");
                    }
                    return { rows: working.profile ? [working.profile] : [] };
                }
                expect(text).toContain("\"createTime\" desc nulls last");
                expect(params).toEqual(["self", 32768]);
                const rows = working.rows
                    .filter((row) => row[0] === "self")
                    .sort(
                        (a, b) =>
                            Number(a[6]) - Number(b[6])
                            || (a[7] == null
                                ? b[7] == null
                                    ? 0
                                    : 1
                                : b[7] == null
                                ? -1
                                : BigInt(a[7] as bigint) > BigInt(b[7] as bigint)
                                ? -1
                                : BigInt(a[7] as bigint) < BigInt(b[7] as bigint)
                                ? 1
                                : 0)
                            || Number(a[1]) - Number(b[1]),
                    );
                return { rows: rows.slice(0, 32768) };
            }
            if (text.startsWith("insert"))
            {
                expect(text).toContain("on conflict (\"uid\",\"point\",\"server\") do update set");
                const row = params.slice(0, 8);
                expect(params.slice(8)).toEqual(row);
                if (failure === "insert")
                {
                    throw new Error("Synthetic insert failure");
                }
                if (failure === "empty")
                {
                    return { rows: [] };
                }
                const index = working.rows.findIndex(
                    (existing) =>
                        existing[0] === row[0] && existing[1] === row[1] && existing[6] === row[6],
                );
                if (index < 0)
                {
                    working.rows.push(row);
                }
                else
                {
                    working.rows[index] = row;
                }
                return { rows: [["self"]] };
            }
            expect(text).toStartWith("delete from \"opencok_kingdom\".\"world_favorite\"");
            expect(params[0]).toBe("self");
            if (
                failure === "delete"
                || (failure === "second-delete"
                    && queries.filter((q) => q.text.startsWith("delete")).length === 2)
            )
            {
                throw new Error("Synthetic delete failure");
            }
            const pairs = new Set(
                Array.from(
                    { length: (params.length - 1) / 2 },
                    (_, index) => `${params[1 + index * 2]}:${params[2 + index * 2]}`,
                ),
            );
            working.rows = working.rows.filter(
                (row) => row[0] !== "self" || !pairs.has(`${row[1]}:${row[6]}`),
            );
            return { rows: [] };
        },
    };
    const globalClient = {
        query: async (query: { text: string; }, params: unknown[] = []) => {
            globalQueries.push({ text: query.text, params });
            if (params[0] === 0)
            {
                return { rows: [] };
            }
            if (failure === "global")
            {
                throw new Error("Synthetic global failure");
            }
            return { rows: types.filter((row) => params.includes(row[0])) };
        },
    };
    const db = drizzle(client as unknown as NodePgClient, { schema: kingdom }),
        globalDb = drizzle(globalClient as unknown as NodePgClient, { schema: global });
    const store = createWorldFavoriteStore(db, globalDb, 1),
        rules = ruleSet();
    const game = new Game({} as GameStore, rules, { kingdomId: 1 }, () => clock++, {
        worldFavorites: store,
    });
    return {
        store,
        game,
        rules,
        db,
        globalDb,
        queries,
        globalQueries,
        get state()
        {
            return state;
        },
        fail(value: string)
        {
            failure = value;
        },
        setTypes(value: unknown[][])
        {
            types = value;
        },
        add: (params: Fields = {}) =>
            game.execute("self", "world.favo.add", {
                point: sfs.int(10),
                type: sfs.int(2),
                name: sfs.string("  My {place}  "),
                ...params,
            }),
        list: (params: Fields = {}) => game.execute("self", "world.favo.get", params),
        remove: (points: number[], servers: number[]) =>
            game.execute("self", "world.favo.delme", {
                point: sfs.array(points.map(sfs.int)),
                server: sfs.array(servers.map(sfs.int)),
            }),
    };
}

test("favorite name validation matches all BMP primitive Java cases and documents storage-only exclusions", () => {
    const bitmap = Buffer.from(oracle.bmpAccepted, "base64");
    expect(bitmap.length).toBe(8192);
    for (let code = 0; code < 65536; code++)
    {
        const legacy = !!(bitmap[code >>> 3]! & (1 << (code & 7)));
        const expected = legacy && code !== 0 && (code < 0xd800 || code > 0xdfff);
        expect(favoriteName("X" + String.fromCharCode(code) + "Y"), code.toString(16)).toBe(
            expected,
        );
    }
    for (const row of oracle.cases)
    {
        expect(favoriteName(row.name)).toBe(
            row.legacy && row.name.length <= 255 && row.name.isWellFormed()
                && !row.name.includes("\0"),
        );
    }
    for (const value of [null, undefined, 1, {}])
    {
        expect(favoriteName(value)).toBe(false);
    }
});

test("server catalog upper bounds and every legacy type branch preserve signed boundary behavior", () => {
    const rules = ruleSet();
    expect(favoriteServer(undefined, 4, rules)).toBe(4);
    for (const id of [-2147483648, -1, 0, 1, 2, 3])
    {
        expect(favoriteServer(id, 1, rules)).toBe(id);
    }
    expect(() => favoriteServer(4, 1, rules)).toThrow();
    rules.profile.servers!.set("unicode", { id: "+１２", test: "TRUE" });
    expect(favoriteServer(12, 1, rules)).toBe(12);
    rules.profile.servers!.set("broken", { id: " 13" });
    expect(() => favoriteServer(1, 1, rules)).toThrow();
    expect(favoriteServer(undefined, 1, rules)).toBe(1);
    const empty = new Rules(new Map(), new Map(), new Map());
    expect(favoriteServer(-2147483648, 1, empty)).toBe(-2147483648);
    expect(() => favoriteServer(0, 1, empty)).toThrow();
    const expected = [
        0,
        1,
        2,
        3,
        2,
        3,
        1,
        7,
        7,
        9,
        9,
        11,
        11,
        13,
        13,
        15,
        15,
        0,
        1,
        0,
        0,
        21,
        21,
        0,
        0,
        0,
    ];
    for (const server of [-1, 1, 999999])
    {
        for (let type = 0; type < expected.length; type++)
        {
            expect(favoriteServerType(server, type)).toBe(expected[type]!);
        }
    }
    for (let type = 0; type < expected.length; type++)
    {
        expect(favoriteServerType(1000000, type)).toBe(
            [1, 4, 5, 6, 8, 10, 12, 14, 16, 18].includes(type) ? 1 : 0,
        );
    }
    expect(favoriteServerType(1, undefined)).toBe(0);
    expect(favoriteServerType(1, 999)).toBe(0);
});

test("add and replacement use owned atomic upserts, distinct clocks and exact response types", async () => {
    const f = fixture();
    f.state.rows.push(["other", 10, 8, -1, -1, "Other", 1, 1n]);
    const first = await f.add({ _cok_: sfs.int(3) });
    expect(decode(encode(first.body))).toEqual({
        state: sfs.int(1),
        point: sfs.int(10),
        createTime: sfs.long(now + 1),
        _cok_: sfs.int(3),
    });
    expect(first.pushes).toEqual([]);
    expect(f.state.rows.find((row) => row[0] === "self")).toEqual([
        "self",
        10,
        2,
        -1,
        -1,
        "  My {place}  ",
        1,
        BigInt(now),
    ]);
    await f.add({ name: sfs.string("New"), cityType: sfs.int(0), resType: sfs.int(4) });
    expect(f.state.rows).toHaveLength(2);
    expect(f.state.rows.find((row) => row[0] === "self")![5]).toBe("New");
    expect(f.state.rows.find((row) => row[0] === "other")![5]).toBe("Other");
    await f.add({ server: sfs.int(2) });
    expect(f.state.rows).toHaveLength(3);
    expect(f.queries.filter((q) => q.text.startsWith("delete"))).toHaveLength(0);
    expect(
        f.queries
            .filter((q) => q.text.includes("\"userprofile\""))
            .every((q) => q.text.endsWith("for update")),
    ).toBe(true);
});

test("listing preserves server/time ordering, null omission, exact longs and global type normalization", async () => {
    const f = fixture();
    f.state.rows.push(
        ["self", 5, 1, null, null, null, 1, null],
        ["self", 6, 2, -1, -1, "Same time", 1, 2n],
        ["self", 3, 2, 0, 4, "New", 1, 9007199254740993n],
        ["self", 2, 4, -1, -1, "Cross", 2, 1n],
        ["self", 4, 5, -1, -1, "National", 3, 4n],
        ["other", 7, 2, -1, -1, "Other", 1, 10n],
    );
    const result = await f.list({ cmdBaseTime: sfs.string("opaque") });
    const rows = (result.body.favo!.value as ReturnType<typeof sfs.object>[]).map((value) =>
        fields(value)
    );
    expect(rows.map((row) => row.point!.value)).toEqual([3, 6, 5, 2, 4]);
    expect(rows[0]!.createTime).toEqual(sfs.long(9007199254740993n));
    expect(rows[2]).toEqual({
        point: sfs.int(5),
        type: sfs.int(1),
        server: sfs.int(1),
        serverType: sfs.int(0),
    });
    expect(rows[3]!.serverType).toEqual(sfs.int(2));
    expect(rows[4]!.serverType).toEqual(sfs.int(21));
    expect(result.body.cmdBaseTime).toEqual(sfs.string("opaque"));
    expect(result.pushes).toEqual([]);
    expect(f.globalQueries[0]!.params).toEqual([1, 2, 3]);
    expect(decode(encode(result.body))).toEqual(result.body);
    expect(f.queries.find((q) => q.text.includes("\"userprofile\""))!.text).toEndWith("for share");
    const empty = fixture();
    expect((await empty.list()).body.favo).toEqual(sfs.array());
    expect(empty.globalQueries).toHaveLength(0);
});

test("paired deletion preserves cross-pairs and owners, echoes duplicates, and succeeds for empty/repeated selections", async () => {
    const f = fixture();
    for (const owner of ["self", "other"])
    {
        for (const point of [1, 2])
        {
            for (const server of [1, 2])
            {
                f.state.rows.push([owner, point, 0, -1, -1, "", server, 0n]);
            }
        }
    }
    const result = await f.remove([1, 2, 1], [1, 2, 1]);
    expect(result.body).toEqual({
        state: sfs.int(1),
        pointArray: sfs.array([sfs.int(1), sfs.int(2), sfs.int(1)]),
        serverArray: sfs.array([sfs.int(1), sfs.int(2), sfs.int(1)]),
    });
    expect(f.state.rows.filter((row) => row[0] === "self").map((row) => [row[1], row[6]])).toEqual([
        [1, 2],
        [2, 1],
    ]);
    expect(f.state.rows.filter((row) => row[0] === "other")).toHaveLength(4);
    expect(f.queries.find((q) => q.text.startsWith("delete"))!.params).toEqual([
        "self",
        1,
        1,
        2,
        2,
    ]);
    expect((await f.remove([1, 2], [1, 2])).body.state).toEqual(sfs.int(1));
    expect((await f.remove([], [])).body.state).toEqual(sfs.int(1));
});

test("replacement and deletion failures roll back atomically and uncertain commits remain safe to retry", async () => {
    for (const failure of ["insert", "empty", "commit", "lost"])
    {
        const f = fixture();
        await f.add();
        const before = structuredClone(f.state.rows);
        f.fail(failure);
        await expect(f.add({ name: sfs.string("Changed") })).rejects.toThrow();
        if (failure !== "lost")
        {
            expect(f.state.rows).toEqual(before);
        }
        else
        {
            expect(f.state.rows[0]![5]).toBe("Changed");
        }
        f.fail("");
        await f.add({ name: sfs.string("Changed") });
        expect(f.state.rows).toHaveLength(1);
    }
    for (const failure of ["delete", "commit", "lost"])
    {
        const f = fixture();
        await f.add();
        f.fail(failure);
        expect((await f.remove([10], [1])).body.state).toEqual(sfs.int(0));
        expect(f.state.rows).toHaveLength(failure === "lost" ? 0 : 1);
        f.fail("");
        expect((await f.remove([10], [1])).body.state).toEqual(sfs.int(1));
        expect(f.state.rows).toHaveLength(0);
    }
    const bulk = fixture();
    for (let point = 0; point < 501; point++)
    {
        bulk.state.rows.push(["self", point, 0, -1, -1, "", 1, 0n]);
    }
    bulk.fail("second-delete");
    expect(
        (
            await bulk.remove(
                Array.from({ length: 501 }, (_, i) => i),
                Array(501).fill(1),
            )
        ).body.state,
    ).toEqual(sfs.int(0));
    expect(bulk.state.rows).toHaveLength(501);
});

test("malformed requests and unauthorized profiles cannot access or mutate favorites", async () => {
    for (
        const params of [
            { point: sfs.string("1") },
            { type: sfs.double(2) },
            { name: sfs.string("bad/name") },
            { name: sfs.string("x".repeat(256)) },
            { server: sfs.int(4) },
            { cityType: sfs.int(1.5) },
        ] as Fields[]
    )
    {
        const f = fixture();
        await expect(f.add(params)).rejects.toThrow();
        expect(f.queries).toHaveLength(0);
    }
    for (
        const profile of [
            null,
            ["other", 1, 0n, 0],
            ["self", 2, 0n, 0],
            ["self", 1, BigInt(now + 100), 0],
            ["self", 1, 0n, 1],
        ]
    )
    {
        for (const operation of ["get", "add", "del"] as const)
        {
            const f = fixture();
            f.state.profile = profile;
            await expect(
                operation === "get"
                    ? f.list()
                    : operation === "add"
                    ? f.add()
                    : f.remove([10], [1]),
            ).rejects.toThrow();
            expect(f.state.rows).toEqual([]);
            expect(f.globalQueries).toHaveLength(0);
            expect(f.queries.filter((q) => /^(insert|delete)/.test(q.text))).toHaveLength(0);
        }
    }
    const f = fixture();
    await expect(f.remove([1], [])).rejects.toThrow();
    await expect(
        f.game.execute("self", "world.favo.delme", {
            point: { type: Type.IntArray, value: [1] },
            server: sfs.array([sfs.int(1)]),
        }),
    ).rejects.toThrow();
    expect(f.queries).toHaveLength(0);
});

test("listing rejects unrepresentable output instead of truncating and validates projection ownership", async () => {
    const f = fixture();
    for (let i = 0; i < 4000; i++)
    {
        f.state.rows.push(["self", i, 0, -1, -1, "x".repeat(255), 1, 0n]);
    }
    await expect(f.list()).rejects.toThrow();
    expect(f.state.rows).toHaveLength(4000);
    const oversized = fixture();
    oversized.state.rows = Array.from({ length: 32768 }, (_, point) => [
        "self",
        point,
        0,
        -1,
        -1,
        "",
        1,
        0n,
    ]);
    await expect(oversized.list()).rejects.toThrow();
    expect(oversized.globalQueries).toHaveLength(0);
    expect(() =>
        worldFavorites(
            { profile: undefined, rows: [{ uid: "other" }], serverTypes: new Map() },
            "self",
        )
    ).toThrow();
    for (
        const patch of [
            { createTime: 9223372036854775808n },
            { point: 1.5 },
            { name: "\ud800" },
        ] as Row[]
    )
    {
        expect(() =>
            worldFavorites(
                { profile: undefined, rows: [{ uid: "self", ...patch }], serverTypes: new Map() },
                "self",
            )
        ).toThrow();
    }
});

test("readiness and repository validation use existing tables without connecting or changing schema", async () => {
    const f = fixture();
    await checkWorldFavoriteStore(f.db, f.globalDb);
    expect(f.queries[0]!.params).toEqual([0]);
    expect(f.globalQueries[0]!.params).toEqual([0]);
    for (const owner of ["", "x\0", "\ud800", "x".repeat(256)])
    {
        await expect(f.store.list(owner, now)).rejects.toThrow();
    }
    await expect(f.store.remove("self", [{ point: 1, server: Infinity }], now)).rejects.toThrow();
    await expect(
        f.store.add("self", {
            point: 1,
            server: 1,
            type: 1,
            cityType: -1,
            resType: -1,
            name: "\0",
            now,
        }),
    ).rejects.toThrow();
    expect(f.queries).toHaveLength(1);
    expect(f.globalQueries).toHaveLength(1);
});

test("global metadata failure or invalid duplicate rows cannot produce a fabricated partial list", async () => {
    for (const failure of ["global", "duplicate", "invalid"])
    {
        const f = fixture();
        await f.add();
        const before = structuredClone(f.state.rows);
        if (failure === "global")
        {
            f.fail("global");
        }
        else
        {
            f.setTypes(
                failure === "duplicate"
                    ? [
                        [1, 0],
                        [1, 2],
                    ]
                    : [[1, NaN]],
            );
        }
        await expect(f.list()).rejects.toThrow();
        expect(f.state.rows).toEqual(before);
    }
});
