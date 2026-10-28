import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { Cache } from "@opencok/storage/session";
import { playerUpdateScript, publishPlayerUpdate } from "@opencok/storage/player-update";
import { avatarProfileUpdate } from "@opencok/rules/avatar-profile";
import { publishAvatarProfile } from "@opencok/repositories/avatar-profile";
import type {
    AvatarCompletionRecord,
    AvatarProfileProjector,
    AvatarProfilePublisher,
} from "@opencok/contracts/files";
import oracle from "./fixtures/avatar-profile-lua.json";

const time = 1792756800123n;
function completion(): AvatarCompletionRecord
{
    return {
        ownerUid: "1001",
        sequence: 5,
        hash: "a".repeat(64),
        picVer: 2000005,
        committedAt: time,
        pendingEffects: 6,
        effects: JSON.stringify({
            version: 1,
            mail: null,
            profile: { userName: "Synthetic", platform: "test", updatedAt: "1792756800" },
        }),
    };
}
class MemoryCache extends Cache
{
    values = new Map<string, string>();
    calls: { command: string; args: string[]; }[] = [];
    constructor(realm = 1)
    {
        super({ redisUrl: "unused", timeoutMs: 1000, kingdomId: realm });
    }
    override async command(command: string, ...args: string[]): Promise<unknown>
    {
        this.calls.push({ command, args });
        if (command === "MGET")
        {
            return args.map((key) => this.values.get(key) ?? null);
        }
        expect(command).toBe("EVAL");
        expect(args[0]).toBe(playerUpdateScript);
        expect(args[1]).toBe("1");
        const key = args[2]!;
        const row = oracle.cases.find(
            (row) => row.before === (this.values.get(key) ?? null) && row.incoming === args[3],
        );
        if (!row)
        {
            throw new Error("Missing synthetic Lua oracle case");
        }
        if (row.writes)
        {
            this.values.set(key, row.after!);
        }
        return row.result;
    }
}
function fixture()
{
    let state = {
        profile: ["1001", 1] as unknown[] | null,
        entry: completion() as AvatarCompletionRecord | null,
    };
    let working = structuredClone(state);
    const queries: { text: string; params: unknown[]; }[] = [];
    let failure = "";
    const client = {
        query: async (statement: { text: string; }, params: unknown[] = []) => {
            const text = statement.text;
            queries.push({ text, params });
            if (text.startsWith("begin"))
            {
                working = structuredClone(state);
                return { rows: [] };
            }
            if (text === "rollback")
            {
                return { rows: [] };
            }
            if (text === "commit")
            {
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
            const table = text.includes("\"userprofile\"") ? "profile" : "completion";
            if (failure === `${text.split(" ")[0]}:${table}`)
            {
                throw new Error("Synthetic database failure");
            }
            if (text.startsWith("select"))
            {
                if (table === "profile")
                {
                    return { rows: working.profile ? [working.profile] : [] };
                }
                const e = working.entry;
                return {
                    rows: e
                        ? [
                            [
                                e.ownerUid,
                                e.sequence,
                                e.hash,
                                e.picVer,
                                e.committedAt,
                                e.effects,
                                e.pendingEffects,
                                e.revision ?? 0n,
                            ],
                        ]
                        : [],
                };
            }
            expect(text.startsWith("update")).toBe(true);
            expect(table).toBe("completion");
            expect(params.slice(1)).toEqual(["1001", 5, working.entry!.pendingEffects]);
            if (failure === "cas")
            {
                return { rows: [] };
            }
            working.entry!.pendingEffects = Number(params[0]);
            return { rows: [["1001"]] };
        },
    };
    const db = drizzle(client as unknown as NodePgClient, { schema });
    const cache = new MemoryCache();
    const publisher: AvatarProfilePublisher = async (update) =>
        cache.publishPlayerUpdateTime(update.owner, update.updatedAt);
    return {
        db,
        queries,
        cache,
        get state()
        {
            return state;
        },
        fail: (value: string) => {
            failure = value;
        },
        run: (
            publish = publisher,
            project: AvatarProfileProjector = avatarProfileUpdate,
            timeoutMs = 1000,
        ) => publishAvatarProfile(db, 1, "1001", 5, project, publish, timeoutMs),
    };
}

test("the exact Lua script matches isolated Lua 5.1 evidence and integer ordering", () => {
    expect(createHash("sha256").update(playerUpdateScript).digest("hex")).toBe(oracle.scriptSha256);
    expect(oracle.cases).toHaveLength(154);
    const canonical = (s: string) =>
        /^(0|[1-9][0-9]{0,18})$/.test(s) && BigInt(s) <= 9223372036854775807n;
    const previous = (s: string) => /^[0-9]{1,19}$/.test(s) && BigInt(s) <= 9223372036854775807n;
    for (const row of oracle.cases)
    {
        const valid = canonical(row.incoming)
            && (row.before === null || row.before === "" || previous(row.before));
        const writes = valid
            && (row.before === null || row.before === ""
                || BigInt(row.incoming) > BigInt(row.before));
        expect(row.result).toBe(valid ? (writes ? 1 : 0) : -1);
        expect(row.writes).toBe(writes ? 1 : 0);
        expect(row.after).toBe(writes ? row.incoming : row.before);
    }
    expect(playerUpdateScript).not.toContain("tonumber");
});

test("publisher uses the established realm key and its marker is readable by existing profile queries", async () => {
    const cache = new MemoryCache();
    await cache.publishPlayerUpdateTime("1001", "1792756800");
    expect(await cache.playerUpdateTimes(1, ["1001"])).toEqual(new Map([["1001", "1792756800"]]));
    await cache.publishPlayerUpdateTime("1001", "1792756801");
    await cache.publishPlayerUpdateTime("1001", "1792756800");
    expect(await cache.playerUpdateTimes(1, ["1001"])).toEqual(new Map([["1001", "1792756801"]]));
    expect(cache.calls[0]!.args.slice(1)).toEqual([
        "1",
        "opencok:kingdom:1:player-update:1001",
        "1792756800",
    ]);
    const second = new MemoryCache(2);
    await second.publishPlayerUpdateTime("1001", "1792756800");
    expect(second.calls[0]!.args[2]).toBe("opencok:kingdom:2:player-update:1001");
    expect(await cache.playerUpdateTimes(2, ["1001"])).toEqual(new Map());
    const exact = new MemoryCache();
    exact.values.set("opencok:kingdom:1:player-update:1001", "9007199254740992");
    await exact.publishPlayerUpdateTime("1001", "9007199254740993");
    expect(exact.values.get("opencok:kingdom:1:player-update:1001")).toBe("9007199254740993");
});

test("invalid cache inputs and replies reject without silently replacing malformed markers", async () => {
    let calls = 0;
    const command = async () => {
        calls++;
        return 1;
    };
    for (const uid of ["", "x".repeat(256), "bad\0uid", "\ud800"])
    {
        await expect(publishPlayerUpdate(command, 1, uid, "1")).rejects.toThrow();
    }
    for (const value of ["", "01", "-1", "9223372036854775808", "1.0"])
    {
        await expect(publishPlayerUpdate(command, 1, "1001", value)).rejects.toThrow();
    }
    for (const realm of [0, -1, 1.5, 2147483648])
    {
        await expect(publishPlayerUpdate(command, realm, "1001", "1")).rejects.toThrow();
    }
    expect(calls).toBe(0);
    for (const result of [-1, 2, "1", null, undefined])
    {
        await expect(publishPlayerUpdate(async () => result, 1, "1001", "1")).rejects.toThrow();
    }
    const bad = new MemoryCache();
    bad.values.set("opencok:kingdom:1:player-update:1001", "1e3");
    await expect(bad.publishPlayerUpdateTime("1001", "1792756800")).rejects.toThrow();
    expect(bad.values.get("opencok:kingdom:1:player-update:1001")).toBe("1e3");
    await expect(
        publishPlayerUpdate(
            async () => {
                throw new Error("synthetic-private-detail");
            },
            1,
            "1001",
            "1",
        ),
    ).rejects.not.toThrow("synthetic-private-detail");
});

test("profile intent uses committed metadata and exact seconds, rejecting foreign or malformed snapshots", () => {
    expect(avatarProfileUpdate(completion(), 2)).toEqual({
        owner: "1001",
        kingdomId: 2,
        sequence: 5,
        picVer: 2000005,
        committedAt: time,
        updatedAt: "1792756800",
        userName: "Synthetic",
        platform: "test",
    });
    for (
        const patch of [
            { ownerUid: "other" },
            { sequence: 0 },
            { picVer: 2000006 },
            { hash: "bad" },
            { pendingEffects: 4 },
            { pendingEffects: 8 },
            { committedAt: -1n },
            { effects: "invalid" },
        ]
    )
    {
        expect(() => avatarProfileUpdate({ ...completion(), ...patch }, 1)).toThrow();
    }
    for (
        const profile of [
            null,
            [],
            { userName: "Synthetic", platform: "test", updatedAt: "01792756800" },
            { userName: null, platform: "test", updatedAt: "1792756800" },
            { userName: "Synthetic", platform: "\ud800", updatedAt: "1792756800" },
        ]
    )
    {
        expect(() =>
            avatarProfileUpdate({
                ...completion(),
                effects: JSON.stringify({ version: 1, profile }),
            }, 1)
        ).toThrow();
    }
});

test("owned publication and acknowledgment clear only bit two while preserving immutable history", async () => {
    for (const bits of [2, 3, 6, 7])
    {
        const f = fixture();
        f.state.entry!.pendingEffects = bits;
        const before = structuredClone(f.state.entry!);
        const result = await f.run();
        expect(result.published).toBe(true);
        expect(f.state.entry).toEqual({ ...before, pendingEffects: bits & ~2 });
        expect(await f.cache.playerUpdateTimes(1, ["1001"])).toEqual(
            new Map([["1001", "1792756800"]]),
        );
        expect(f.queries[0]!.text).toBe("begin isolation level read committed read write");
        expect(f.queries[1]!.text).toEndWith("limit $2 for update");
        expect(f.queries[1]!.params).toEqual(["1001", 1]);
        expect(f.queries[2]!.text).toEndWith("limit $3 for update");
        expect(f.queries[2]!.params).toEqual(["1001", 5, 1]);
        expect(f.queries.map((q) => q.text).join("\n")).not.toMatch(
            /insert |delete |"mail"|"gold"/,
        );
        expect((await f.run()).published).toBe(false);
        expect(f.cache.calls.filter((c) => c.command === "EVAL")).toHaveLength(1);
    }
});

test("publication and commit failures retain replay safety after an external write", async () => {
    for (
        const failure of [
            "select:profile",
            "select:completion",
            "update:completion",
            "cas",
            "commit",
        ]
    )
    {
        const f = fixture();
        const before = structuredClone(f.state);
        f.fail(failure);
        await expect(f.run()).rejects.toThrow();
        expect(f.state).toEqual(before);
        expect(f.queries.at(-1)!.text).toBe("rollback");
        f.fail("");
        expect((await f.run()).published).toBe(true);
        expect(f.state.entry!.pendingEffects).toBe(4);
    }
    const lost = fixture();
    lost.fail("lost");
    await expect(lost.run()).rejects.toThrow();
    expect(lost.state.entry!.pendingEffects).toBe(4);
    lost.fail("");
    expect((await lost.run()).published).toBe(false);
    expect(lost.cache.calls).toHaveLength(1);
    const failed = fixture();
    await expect(
        failed.run(async () => {
            throw new Error("synthetic-private-error");
        }),
    ).rejects.toThrow("Avatar profile publication unavailable");
    expect(failed.state.entry!.pendingEffects).toBe(6);
    expect(failed.queries.some((q) => q.text.startsWith("update"))).toBe(false);
});

test("timeout aborts publication and a late response cannot acknowledge rolled-back work", async () => {
    const f = fixture();
    let release: () => void = () => {};
    let signal: AbortSignal | undefined;
    let late = false;
    await expect(
        f.run(
            async (_update, current) => {
                signal = current;
                await new Promise<void>((resolve) => {
                    release = resolve;
                });
                late = true;
            },
            avatarProfileUpdate,
            100,
        ),
    ).rejects.toThrow("Avatar profile publication unavailable");
    expect(signal?.aborted).toBe(true);
    expect(f.state.entry!.pendingEffects).toBe(6);
    release();
    await Promise.resolve();
    await Promise.resolve();
    expect(late).toBe(true);
    expect(f.queries.some((q) => q.text.startsWith("update"))).toBe(false);
    expect(f.queries.at(-1)!.text).toBe("rollback");
});

test("foreign owners, invalid projections and absent work never invoke the publisher", async () => {
    for (const profile of [null, ["other", 1], ["1001", 2]])
    {
        const f = fixture();
        f.state.profile = profile;
        expect((await f.run()).published).toBe(false);
        expect(f.cache.calls).toEqual([]);
        expect(f.queries).toHaveLength(3);
    }
    for (const pending of [0, 1, 4, 5])
    {
        const f = fixture();
        f.state.entry!.pendingEffects = pending;
        expect((await f.run()).published).toBe(false);
        expect(f.cache.calls).toEqual([]);
    }
    for (
        const patch of [
            { owner: "other" },
            { kingdomId: 2 },
            { updatedAt: "0" },
            { sequence: 6 },
            { userName: null },
        ]
    )
    {
        const f = fixture();
        await expect(
            f.run(
                undefined,
                (entry, realm) =>
                    ({ ...avatarProfileUpdate(entry, realm), ...patch }) as ReturnType<
                        typeof avatarProfileUpdate
                    >,
            ),
        ).rejects.toThrow();
        expect(f.cache.calls).toEqual([]);
    }
    const invalid = fixture();
    for (const timeout of [0, 99, 30001, NaN])
    {
        expect(() =>
            publishAvatarProfile(
                invalid.db,
                1,
                "1001",
                5,
                avatarProfileUpdate,
                async () => {},
                timeout,
            )
        ).toThrow();
    }
    expect(invalid.queries).toEqual([]);
});
