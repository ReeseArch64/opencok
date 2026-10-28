import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as kingdom from "@opencok/drizzle/schema/kingdom";
import * as global from "@opencok/drizzle/schema/global";
import {
    createPlayerSearchStore,
    checkPlayerSearchStore,
} from "@opencok/repositories/player-search";
import {
    playerSearchQuery,
    playerSearchRemoteBudget,
    sharedSearchProfile,
} from "@opencok/rules/player-search";
import { GameService as Game } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { Rules } from "@opencok/rules/game";
import { Type, sfs, fields, encode, decode, extension, type Fields } from "@opencok/messages/sfs";

const now = 1792756800123;
const ruleSet = () => {
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.items.set("lookfor", { k1: "5", k2: "100" });
    rules.power.vip = new Map([
        ["101", { id: "101", point: "200" }],
        ["100", { id: "100", point: "0" }],
        ["109", { id: "109", point: "100" }],
    ]);
    return rules;
};
const localRow = (uid: string, level = 10): unknown[] => [
    uid,
    "King " + uid,
    "pt",
    "g001",
    2,
    9007199254740993n,
    "Alliance",
    "ALL",
    level,
];
const remoteRow = (uid: string, level = 10): unknown[] => [
    uid,
    "King " + uid,
    "g002",
    3,
    4,
    "en",
    "A",
    0,
    -1,
    123n,
    2,
    9007199254740995n,
    "ALL",
    level,
    100,
    BigInt(now + 1000),
    2,
    5,
];
function match(value: string, pattern: string): boolean
{
    let expression = "^";
    for (let i = 0; i < pattern.length; i++)
    {
        const char = pattern[i]!;
        if (char === "%")
        {
            expression += ".*";
        }
        else if (char === "_")
        {
            expression += ".";
        }
        else if (char === "\\")
        {
            expression += "\\u{" + pattern[++i]!.codePointAt(0)!.toString(16) + "}";
        }
        else
        {
            expression += "\\u{" + char.codePointAt(0)!.toString(16) + "}";
        }
    }
    return new RegExp(expression + "$", "isu").test(value);
}
function fixture(cross = true)
{
    const queries: { realm: number; text: string; params: unknown[]; }[] = [];
    const state = {
        profile: ["self", 1, 0n, 0] as unknown[] | null,
        local: [] as unknown[][],
        mappings: [] as { uid: string; name: string; type: string; }[],
        accounts: [] as { uid: string; server: string; level: number; }[],
        remote: [] as unknown[][],
        failure: "",
        rawLocal: false,
        rawMappings: false,
        rawAccounts: false,
        rawRemote: false,
        onProfile: undefined as (() => void) | undefined,
    };
    const client = (realm: number) => ({
        query: async (q: { text: string; }, params: unknown[] = []) => {
            const text = q.text;
            queries.push({ realm, text, params });
            if (text.startsWith("begin"))
            {
                expect(text).toBe("begin isolation level repeatable read read only");
                return { rows: [] };
            }
            if (text === "rollback")
            {
                return { rows: [] };
            }
            if (text === "commit")
            {
                if (state.failure === `commit${realm}`)
                {
                    throw new Error("Synthetic private commit details");
                }
                return { rows: [] };
            }
            if (!text.startsWith("select "))
            {
                throw new Error("Unexpected mutation");
            }
            if (params.length === 1 && params[0] === 0)
            {
                return { rows: [] };
            }
            if (realm === 0)
            {
                if (text.includes("from \"opencok_global\".\"usermapping\""))
                {
                    if (state.failure === "mapping")
                    {
                        throw new Error("Synthetic private mapping details");
                    }
                    const rows = state.rawMappings
                        ? state.mappings
                        : state.mappings
                            .filter((row) =>
                                row.type === params[0] && match(row.name, String(params[1]))
                            )
                            .sort((a, b) => (a.uid < b.uid ? -1 : 1))
                            .slice(0, Number(params[2]));
                    return { rows: rows.map((row) => [row.uid]) };
                }
                if (state.failure === "account")
                {
                    throw new Error("Synthetic private account details");
                }
                const allowed = params.slice(0, -2),
                    own = params.at(-2),
                    minimum = Number(params.at(-1));
                const rows = state.rawAccounts
                    ? state.accounts
                    : state.accounts
                        .filter(
                            (row) =>
                                allowed.includes(row.uid) && row.server !== own
                                && row.level >= minimum,
                        )
                        .sort((a, b) => (a.uid < b.uid ? -1 : 1));
                return { rows: rows.map((row) => [row.uid, row.server]) };
            }
            if (realm === 1 && !text.includes("join"))
            {
                if (state.failure === "profile")
                {
                    throw new Error("Synthetic private observer details");
                }
                state.onProfile?.();
                return { rows: state.profile ? [state.profile] : [] };
            }
            if (realm === 1)
            {
                if (state.failure === "local")
                {
                    throw new Error("Synthetic private local details");
                }
                const rows = state.rawLocal
                    ? state.local
                    : state.local
                        .filter(
                            (row) =>
                                match(String(row[1]), String(params[0]))
                                && Number(row[8]) >= Number(params[2]),
                        )
                        .sort((a, b) =>
                            String(a[0]) < String(b[0]) ? -1 : String(a[0]) > String(b[0]) ? 1 : 0
                        )
                        .slice(0, Number(params[3]));
                return { rows };
            }
            if (state.failure === "remote")
            {
                throw new Error("Synthetic private remote details");
            }
            const ids = params.slice(1, -1);
            const rows = state.rawRemote
                ? state.remote
                : state.remote.filter((row) => ids.includes(row[0]));
            return { rows: rows.slice(0, Number(params.at(-1))) };
        },
    });
    const realmDatabases = new Map(
        [1, 2].map((id) => [
            id,
            { db: drizzle(client(id) as unknown as NodePgClient, { schema: kingdom }) },
        ]),
    );
    const topology = {
        kingdoms: realmDatabases,
        global: { db: drizzle(client(0) as unknown as NodePgClient, { schema: global }) },
        getKingdom: (id: number) => {
            const db = realmDatabases.get(id);
            if (!db)
            {
                throw new Error("Synthetic route absent");
            }
            return db;
        },
    } as unknown as Parameters<typeof createPlayerSearchStore>[0];
    const store = createPlayerSearchStore(topology, 1),
        rules = ruleSet();
    const game = new Game(
        {} as GameStore,
        rules,
        { kingdomId: 1, crossSearchEnabled: cross },
        () => now,
        { playerSearch: store },
    );
    return {
        state,
        queries,
        store,
        topology,
        rules,
        game,
        search: (params: Fields = {}) =>
            game.execute("self", "search.player", {
                key: sfs.string("King"),
                page: sfs.int(1),
                ...params,
            }),
        add: (uid: string, server = "2", level = 10) => {
            state.mappings.push({ uid, name: "King " + uid, type: "name" });
            state.accounts.push({ uid, server, level });
            state.remote.push(remoteRow(uid, level));
        },
    };
}
const entries = (body: Fields) => (body.list!.value as ReturnType<typeof sfs.object>[]).map(fields);

test("local command uses prefix/level joins and legacy response pagination without global reads", async () => {
    const f = fixture(false);
    f.state.local = Array.from({ length: 101 }, (_, i) => localRow(String(i).padStart(3, "0")));
    f.state.local.push(localRow("low", 4), [
        "wrong",
        "Other",
        null,
        null,
        null,
        null,
        null,
        null,
        10,
    ]);
    const result = await f.search({
        page: sfs.int(2),
        uid: sfs.string("other"),
        _cok_: sfs.int(7),
        cmdBaseTime: sfs.string("opaque"),
    });
    expect(result.body.page).toEqual(sfs.int(1));
    expect(result.body.total).toEqual(sfs.long(101));
    expect(result.body.max).toEqual(sfs.long(100));
    expect(entries(result.body).map((row) => row.uid!.value)).toEqual(
        Array.from({ length: 10 }, (_, i) => String(i + 10).padStart(3, "0")),
    );
    expect(entries(result.body)[0]!.power).toEqual(sfs.long(9007199254740993n));
    expect(result.body._cok_).toEqual(sfs.int(7));
    expect(result.body.cmdBaseTime).toEqual(sfs.string("opaque"));
    expect(result.pushes).toEqual([]);
    expect(decode(encode(result.body))).toEqual(result.body);
    expect(f.queries.every((q) => q.realm === 1)).toBe(true);
    const read = f.queries.find((q) => q.text.includes("inner join"))!;
    expect(read.params).toEqual(["King%", 400000, 5, 101]);
    expect(read.text).toContain("left join \"opencok_kingdom\".\"alliance\"");
    expect(read.text).toContain("inner join \"opencok_kingdom\".\"user_building\"");
    expect(read.text).toContain("inner join \"opencok_kingdom\".\"playerinfo\"");
    expect(read.text).toContain("\"userprofile\".\"name\" ilike $1");
    expect(read.text).toContain("\"user_building\".\"itemId\" = $2");
    expect(read.text).toContain("\"user_building\".\"level\" >= $3");
    expect(read.text).not.toContain("\"banTime\"");
    expect(read.text).not.toContain("\"banFlag\"");
    expect(read.text).not.toContain("\"star\"");
    expect(f.queries[1]!.params).toEqual(["self", 1]);
});

test("cross command combines local page one with directory-routed public profiles and active VIP", async () => {
    const f = fixture();
    f.state.local = Array.from(
        { length: 101 },
        (_, i) => localRow(`L${String(i).padStart(3, "0")}`),
    );
    f.add("R1");
    f.add("R2");
    const result = await f.search({ page: sfs.int(2) });
    expect(result.body.page).toEqual(sfs.int(2));
    expect(result.body.total).toEqual(sfs.long(12));
    const rows = entries(result.body);
    expect(rows).toHaveLength(2);
    expect(rows.every((row) => String(row.uid!.value).startsWith("R"))).toBe(true);
    expect(rows[0]!.serverId).toEqual(sfs.int(2));
    expect(rows[0]!.level).toEqual(sfs.int(10));
    expect(rows[0]!.mainBuildingLevel).toEqual(sfs.int(10));
    expect(rows[0]!.vipLevel).toEqual(sfs.int(10));
    expect(rows[0]!.svipLevel).toEqual(sfs.int(2));
    expect(rows[0]!.power).toEqual(sfs.long(9007199254740995n));
    expect(rows[0]!.allianceId).toEqual(sfs.string("A"));
    expect(rows[0]!.alliancename).toBeUndefined();
    expect(rows[0]!.vipScore).toBeUndefined();
    expect(rows[0]!.profileServerId).toBeUndefined();
    const map = f.queries.find((q) => q.text.includes("from \"opencok_global\".\"usermapping\""))!;
    expect(map.params).toEqual(["name", "King%", 192]);
    expect(map.text).not.toContain("account_new");
    expect(map.text).not.toContain("\"active\"");
    const account = f.queries.find((q) =>
        q.text.includes("from \"opencok_global\".\"account_new\"")
    )!;
    expect(account.params).toEqual(["R1", "R2", "1", 3]);
    expect(account.text).toContain("\"account_new\".\"server\" <> $3");
    expect(account.text).toContain("\"account_new\".\"gameUserLevel\" >= $4");
    const remote = f.queries.find((q) => q.realm === 2 && q.text.startsWith("select"))!;
    expect(remote.params).toEqual([400000, "R1", "R2", 3]);
    expect(remote.text).toContain("left join \"opencok_kingdom\".\"user_vip\"");
    expect(remote.text).toContain("left join \"opencok_kingdom\".\"alliance_member\"");
    expect(remote.text).not.toContain("\"banFlag\"");
    expect(f.queries.filter((q) => q.text.startsWith("begin")).map((q) => q.realm)).toEqual([
        1,
        0,
        2,
    ]);
    expect(decode(encode(result.body))).toEqual(result.body);
});

test("mapping window is limited before account eligibility and is never refilled", async () => {
    const f = fixture();
    f.rules.items.set("lookfor", { k1: "5", k2: "1" });
    f.add("01", "1");
    f.add("02", "2", 2);
    f.add("03");
    f.add("04");
    f.add("05");
    f.state.accounts = f.state.accounts.filter((row) => row.uid !== "03");
    const result = await f.search();
    expect(entries(result.body).map((row) => row.uid!.value)).toEqual(["04"]);
    expect(result.body.total).toEqual(sfs.long(1));
    expect(
        f.queries.find((q) => q.text.includes("from \"opencok_global\".\"usermapping\""))!.params,
    ).toEqual(["name", "King%", 4]);
    const accounts = f.queries.find((q) =>
        q.text.includes("from \"opencok_global\".\"account_new\"")
    )!;
    expect(accounts.params).toEqual(["01", "02", "03", "04", "1", 3]);
    expect(
        f.queries.filter((q) => q.text.includes("from \"opencok_global\".\"usermapping\"")),
    ).toHaveLength(1);
});

test("missing remote profiles become ordered placeholders and low/absent castles remain excluded", async () => {
    const f = fixture();
    for (const id of ["missing", "low", "zero", "normal"])
    {
        f.add(id);
    }
    f.state.remote = f.state.remote.filter((row) => row[0] !== "missing");
    f.state.remote.find((row) => row[0] === "low")![13] = 4;
    f.state.remote.find((row) => row[0] === "zero")![13] = null;
    const q = playerSearchQuery("King", 1, true, 1, f.rules);
    const snapshot = await f.store.search(
        "self",
        q,
        now,
        (rows) => playerSearchRemoteBudget(q, rows),
    );
    expect(snapshot.remote.map((entry) => entry.key)).toEqual(["low", "normal", "zero", "missing"]);
    expect(snapshot.remote.at(-1)!.data).toEqual({});
    const result = await f.search();
    expect(entries(result.body).map((row) => row.uid!.value)).toEqual(["normal"]);
    f.state.remote.find((row) => row[0] === "normal")![15] = BigInt(now);
    expect(entries((await f.search()).body)[0]!.vipLevel).toEqual(sfs.int(0));
});

test("remote profile batches share one read-only realm snapshot and never exceed 500 identities", async () => {
    const f = fixture();
    f.rules.items.set("lookfor", { k1: "5", k2: "1000" });
    for (let i = 0; i < 501; i++)
    {
        f.add(String(i).padStart(4, "0"));
    }
    const result = await f.search();
    expect(result.body.total).toEqual(sfs.long(501));
    const reads = f.queries.filter((q) => q.realm === 2 && q.text.startsWith("select"));
    expect(reads.map((q) => q.params.length)).toEqual([502, 3]);
    expect(reads.map((q) => q.params.at(-1))).toEqual([501, 2]);
    expect(f.queries.filter((q) => q.realm === 2 && q.text.startsWith("begin"))).toHaveLength(1);
    expect(f.queries.filter((q) => q.realm === 2 && q.text === "commit")).toHaveLength(1);
});

test("missing, foreign, transferred or banned observers cannot reach candidate queries", async () => {
    for (
        const profile of [
            null,
            ["other", 1, 0n, 0],
            ["self", 2, 0n, 0],
            ["self", 1, BigInt(now + 1), 0],
            ["self", 1, 0n, 1],
        ]
    )
    {
        const f = fixture();
        f.state.profile = profile;
        f.add("remote");
        await expect(f.search()).rejects.toThrow();
        expect(f.queries.every((q) => q.realm === 1)).toBe(true);
        expect(f.queries.some((q) => q.text.includes("join"))).toBe(false);
    }
    const exact = fixture(false);
    exact.state.profile = ["self", 1, BigInt(now), null];
    expect((await exact.search()).body.total).toEqual(sfs.long(0));
});

test("unknown, malformed or inconsistent directory routes fail without local/empty fallback", async () => {
    for (const server of ["3", "0", "-1", "02", "+2", "2x", "2147483648"])
    {
        const f = fixture();
        f.add("R", server);
        await expect(f.search()).rejects.toThrow("player search unavailable");
        expect(f.queries.some((q) => q.realm === 2)).toBe(false);
    }
    for (const mode of ["foreign", "duplicate", "realm", "excess"])
    {
        const f = fixture();
        f.add("R");
        f.state.rawRemote = true;
        if (mode === "foreign")
        {
            f.state.remote = [remoteRow("foreign")];
        }
        if (mode === "realm")
        {
            f.state.remote[0]![10] = 1;
        }
        if (mode === "duplicate" || mode === "excess")
        {
            f.state.remote.push(remoteRow(mode === "duplicate" ? "R" : "other"));
        }
        await expect(f.search()).rejects.toThrow("player search unavailable");
        expect(f.queries.at(-1)!.text).toBe("rollback");
    }
    for (const mode of ["mapping", "account"])
    {
        const f = fixture();
        f.add("R");
        if (mode === "mapping")
        {
            f.state.rawMappings = true;
            f.state.mappings.push({ ...f.state.mappings[0]! });
        }
        else
        {
            f.state.rawAccounts = true;
            f.state.accounts.push({ uid: "foreign", server: "2", level: 10 });
        }
        await expect(f.search()).rejects.toThrow("player search unavailable");
    }
});

test("dependency failures are sanitized and no query path writes game state", async () => {
    for (
        const failure of [
            "profile",
            "local",
            "mapping",
            "account",
            "remote",
            "commit1",
            "commit0",
            "commit2",
        ]
    )
    {
        const f = fixture();
        f.add("R");
        f.state.failure = failure;
        await expect(f.search()).rejects.toThrow("player search unavailable");
        expect(f.queries.every((q) => /^(select|begin|commit|rollback)/.test(q.text))).toBe(true);
    }
    const empty = fixture();
    expect((await empty.search()).body.total).toEqual(sfs.long(0));
    expect(empty.queries.some((q) => q.text.includes("from \"opencok_global\".\"account_new\"")))
        .toBe(
            false,
        );
});

test("malformed command parameters cannot access the store and complete responses obey frame bounds", async () => {
    for (
        const params of [
            { key: sfs.int(1) },
            { key: sfs.null() },
            { key: sfs.string("\0") },
            { key: sfs.string("\ud800") },
            { page: sfs.string("1") },
            { page: sfs.long(1) },
            { page: sfs.int(1.5) },
            { key: sfs.string("é".repeat(16384)) },
        ] as Fields[]
    )
    {
        const f = fixture();
        await expect(f.search(params)).rejects.toThrow();
        expect(f.queries).toEqual([]);
    }
    const f = fixture(false);
    await expect(f.game.execute("self", "search.player", {})).rejects.toThrow();
    expect(f.queries).toEqual([]);
    const base = (await f.search()).body;
    const overhead = encode(
        extension("search.player", {
            ...base,
            _cok_: { type: Type.Bytes, value: Buffer.alloc(0) },
        }),
    ).length;
    const accepted = await f.search({
        _cok_: { type: Type.Bytes, value: Buffer.alloc(1024 * 1024 - overhead) },
    });
    expect(encode(extension("search.player", accepted.body)).length).toBe(1024 * 1024);
    await expect(
        f.search({ _cok_: { type: Type.Bytes, value: Buffer.alloc(1024 * 1024 - overhead + 1) } }),
    ).rejects.toMatchObject({ reason: "player_search" });
});

test("repository validates direct callers, captures the plan and limits inspector authority", async () => {
    const f = fixture();
    f.add("R");
    const q = { ...playerSearchQuery("King", 1, true, 1, f.rules) };
    f.state.onProfile = () => Object.assign(q, { key: "Changed", cross: false, minimumLevel: 999 });
    const result = await f.store.search("self", q, now, () => ({ limit: 202, minimumLevel: 3 }));
    expect(result.remote[0]!.data.uid).toBe("R");
    for (
        const patch of [
            { kingdomId: 2 },
            { key: "\0" },
            { minimumLevel: NaN },
            { maximum: 32767 },
            { limit: 1 },
            { page: 0.5 },
        ]
    )
    {
        const invalid = fixture();
        await expect(
            invalid.store.search(
                "self",
                { ...playerSearchQuery("King", 1, true, 1, invalid.rules), ...patch },
                now,
                () => ({ limit: 202, minimumLevel: 3 }),
            ),
        ).rejects.toThrow();
        expect(invalid.queries).toEqual([]);
    }
    for (
        const budget of [
            { limit: 203, minimumLevel: 3 },
            { limit: 202, minimumLevel: 4 },
            { limit: 32768, minimumLevel: 3 },
            { limit: -1, minimumLevel: 3 },
        ]
    )
    {
        const invalid = fixture();
        await expect(
            invalid.store.search(
                "self",
                playerSearchQuery("King", 1, true, 1, invalid.rules),
                now,
                () => budget,
            ),
        ).rejects.toThrow();
        expect(invalid.queries.every((q) => q.realm === 1)).toBe(true);
    }
    const invalid = fixture();
    invalid.state.rawLocal = true;
    invalid.state.local = [localRow("low", 4)];
    await expect(invalid.search()).rejects.toThrow();
    expect(invalid.queries.every((q) => q.realm === 1)).toBe(true);
});

test("shared public profile derives VIP in catalog order without repairs or unrelated attributes", () => {
    const rules = ruleSet();
    expect(
        sharedSearchProfile(
            {
                vipScore: 200,
                vipEndTime: BigInt(now + 1),
                allianceId: "A",
                abbr: "  ALL  ",
                rank: 4,
            },
            rules,
            now,
        ),
    ).toMatchObject({ vipLevel: 10, rank: 4, abbr: "  ALL  " });
    expect(
        sharedSearchProfile({ vipScore: 0, vipEndTime: BigInt(now + 1) }, rules, now).vipLevel,
    ).toBe(1);
    expect(
        sharedSearchProfile({ vipScore: -1, vipEndTime: BigInt(now + 1) }, rules, now).vipLevel,
    ).toBe(0);
    expect(
        sharedSearchProfile(
            { vipEndTime: BigInt(now), allianceId: "\u2003", abbr: "ALL", rank: 4 },
            rules,
            now,
        ),
    ).toMatchObject({ vipLevel: 0, rank: 0, abbr: "" });
    expect(sharedSearchProfile({ allianceId: "A", abbr: "\u2003" }, rules, now).abbr).toBe("");
    rules.power.vip = undefined;
    expect(sharedSearchProfile({}, rules, now)).toMatchObject({
        vipLevel: 0,
        mainBuildingLevel: 0,
        power: 0n,
        crossFightSrcServerId: -1,
    });
    expect(() => sharedSearchProfile({ vipEndTime: BigInt(now + 1) }, rules, now)).toThrow();
    for (
        const data of [
            { vipEndTime: 1 },
            { power: 9223372036854775808n },
            { mainBuildingLevel: 1.5 },
            { picVer: "1" },
            { allianceId: 1 },
            { abbr: 2 },
        ] as Row[]
    )
    {
        expect(() => sharedSearchProfile(data, ruleSet(), now)).toThrow();
    }
    const bad = ruleSet();
    bad.power.vip!.set("bad", { id: "bad", point: "0" });
    expect(() => sharedSearchProfile({ vipEndTime: BigInt(now + 1) }, bad, now)).toThrow();
});

test("readiness probes only the local realm and conditionally the global directory", async () => {
    const f = fixture();
    await checkPlayerSearchStore(f.topology, 1, false);
    expect(f.queries.map((q) => q.realm)).toEqual([1, 1, 1, 1]);
    f.queries.length = 0;
    await checkPlayerSearchStore(f.topology, 1, true);
    expect(f.queries.map((q) => q.realm)).toEqual([1, 1, 1, 1, 0, 0]);
    expect(f.queries.every((q) => q.params.length === 1 && q.params[0] === 0)).toBe(true);
});
