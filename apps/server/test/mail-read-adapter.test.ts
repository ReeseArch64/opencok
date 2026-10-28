import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { markMailRead } from "@opencok/repositories/mail-read";
import { mailReadQuery } from "@opencok/rules/mail";

const now = 1792756800000;
function database(options: { profile?: unknown[] | null; fail?: string; } = {})
{
    const queries: { text: string; params: unknown[]; }[] = [];
    let entries = [
        { uid: "ordinary", owner: "self", type: 2, status: 0 as number | null, time: 1n, saved: 1 },
        {
            uid: "gift",
            owner: "self",
            type: 28,
            status: null as number | null,
            time: 9007199254740993n,
            saved: 0,
        },
        { uid: "read", owner: "self", type: 28, status: 1 as number | null, time: 2n, saved: 0 },
        { uid: "odd", owner: "self", type: 28, status: -1 as number | null, time: 3n, saved: 0 },
        {
            uid: "foreign",
            owner: "other",
            type: 28,
            status: 0 as number | null,
            time: 4n,
            saved: 0,
        },
    ];
    let markers = new Map<string, bigint>();
    let openings = new Map<string, unknown[]>();
    let before:
        | { entries: typeof entries; markers: typeof markers; openings: typeof openings; }
        | undefined;
    const client = {
        query: async (statement: { text: string; }, params: unknown[] = []) => {
            const text = statement.text;
            queries.push({ text, params });
            if (text.startsWith("begin"))
            {
                before = {
                    entries: structuredClone(entries),
                    markers: new Map(markers),
                    openings: new Map(openings),
                };
            }
            if (text === "rollback" && before)
            {
                entries = before.entries;
                markers = before.markers;
                openings = before.openings;
            }
            if (text.includes("from \"opencok_kingdom\".\"userprofile\""))
            {
                if (options.fail === "profile")
                {
                    throw new Error("Synthetic profile failure");
                }
                return {
                    rows: options.profile === null ? [] : [options.profile ?? ["self", 1, "0", 0]],
                };
            }
            if (text.startsWith("update \"opencok_kingdom\".\"mail\""))
            {
                if (options.fail === "mail")
                {
                    throw new Error("Synthetic mail failure");
                }
                const [status, owner, ...ids] = params;
                const selected = entries.filter(
                    (entry) =>
                        entry.owner === owner
                        && ids.includes(entry.uid)
                        && (!text.includes("coalesce") || (entry.status ?? 0) === 0),
                );
                for (const entry of selected)
                {
                    entry.status = status as number;
                }
                return {
                    rows: selected.map((entry) => [entry.uid, entry.type, String(entry.time)]),
                };
            }
            if (text.startsWith("insert into \"opencok_kingdom\".\"mail_update\""))
            {
                if (options.fail === "marker")
                {
                    throw new Error("Synthetic marker failure");
                }
                for (let i = 0; i < params.length; i += 3)
                {
                    const key = `${params[i]}:${params[i + 1]}`;
                    const time = BigInt(params[i + 2] as string);
                    const previous = markers.get(key) ?? 0n;
                    markers.set(key, time > previous ? time : previous);
                }
            }
            if (text.startsWith("insert into \"opencok_kingdom\".\"mail_gift_opening\""))
            {
                if (options.fail === "opening")
                {
                    throw new Error("Synthetic opening failure");
                }
                for (let i = 0; i < params.length; i += 4)
                {
                    const key = `${params[i]}:${params[i + 1]}`;
                    if (!openings.has(key))
                    {
                        openings.set(key, params.slice(i, i + 4));
                    }
                }
            }
            if (text === "commit" && options.fail === "commit")
            {
                throw new Error("Synthetic commit failure");
            }
            return { rows: [] };
        },
    };
    return {
        db: drizzle(client as unknown as NodePgClient, { schema }),
        queries,
        state: () => ({ entries, markers, openings }),
    };
}

test("single read transitions only unread owned messages and atomically enqueues full-width gift opening records", async () => {
    const { db, queries, state } = database();
    await markMailRead(db, 1, "self", mailReadQuery(false, "gift", now));
    expect(state().entries.find((entry) => entry.uid === "gift")?.status).toBe(1);
    expect(state().openings.get("gift:9007199254740993")).toEqual([
        "gift",
        9007199254740993n,
        "self",
        BigInt(now),
    ]);
    expect(state().markers).toEqual(new Map([["self:gift", BigInt(now)]]));
    expect(queries[0]?.text).toBe("begin isolation level read committed read write");
    expect(queries[1]?.text).toEndWith("limit $2 for update");
    expect(queries[1]?.params).toEqual(["self", 1]);
    expect(queries[2]?.text).toContain("\"mail\".\"toUser\" = $2");
    expect(queries[2]?.text).toContain("coalesce(\"opencok_kingdom\".\"mail\".\"status\", 0) = 0");
    expect(queries[2]?.params).toEqual([1, "self", "gift"]);
    expect(queries[3]?.text).toContain(
        "greatest(\"opencok_kingdom\".\"mail_update\".\"updateTime\", excluded.\"updateTime\")",
    );
    expect(queries[4]?.text).toContain("on conflict (\"mailUid\",\"sendTime\") do nothing");
    expect(queries.at(-1)?.text).toBe("commit");
    for (const id of ["gift", "read", "odd", "foreign", "missing", ""])
    {
        await markMailRead(db, 1, "self", mailReadQuery(false, id, now + 1));
    }
    expect(state().openings.size).toBe(1);
    expect(state().markers.size).toBe(1);
    expect(state().entries.find((entry) => entry.uid === "odd")?.status).toBe(-1);
    expect(state().entries.find((entry) => entry.uid === "foreign")?.status).toBe(0);
    await markMailRead(db, 1, "self", mailReadQuery(false, "ordinary", now));
    expect(state().openings.size).toBe(1);
    expect(state().markers.size).toBe(2);
    expect(queries.map((entry) => entry.text).join("\n")).not.toMatch(
        /opencok_global|"saveFlag"|contents|rewardId|delete |select \*/,
    );
});

test("batch read marks all matched statuses and touches their markers without creating gift opening records", async () => {
    const { db, queries, state } = database();
    const query = mailReadQuery(true, "ordinary,gift,read,odd,foreign,missing,gift", now);
    await markMailRead(db, 1, "self", query);
    expect(
        state()
            .entries.filter((entry) => entry.owner === "self")
            .map((entry) => entry.status),
    ).toEqual([1, 1, 1, 1]);
    expect(state().entries.find((entry) => entry.uid === "foreign")?.status).toBe(0);
    expect(state().openings.size).toBe(0);
    expect([...state().markers.keys()].sort()).toEqual([
        "self:gift",
        "self:odd",
        "self:ordinary",
        "self:read",
    ]);
    expect(queries[2]?.text).not.toContain("coalesce");
    expect(queries[2]?.params).toEqual([
        1,
        "self",
        "ordinary",
        "gift",
        "read",
        "odd",
        "foreign",
        "missing",
    ]);
    await markMailRead(db, 1, "self", { ...query, now: now - 1 });
    expect([...state().markers.values()]).toEqual(Array.from({ length: 4 }, () => BigInt(now)));
    await markMailRead(db, 1, "self", mailReadQuery(false, "gift", now));
    expect(state().openings.size).toBe(0);
    const start = queries.length;
    await markMailRead(db, 1, "self", mailReadQuery(true, ",,", now));
    expect(queries.slice(start)).toHaveLength(3);
    expect(queries.slice(start).some((entry) => /^(insert|update)/.test(entry.text))).toBe(false);
});

test("read mutations reject unauthorized profiles before writes and roll back status, marker and opening together", async () => {
    for (
        const profile of [
            null,
            ["other", 1, "0", 0],
            ["self", 2, "0", 0],
            ["self", 1, "0", 1],
            ["self", 1, String(now + 1), 0],
        ]
    )
    {
        const { db, queries } = database({ profile });
        await markMailRead(db, 1, "self", mailReadQuery(false, "gift", now));
        expect(queries.some((entry) => /^(insert|update)/.test(entry.text))).toBe(false);
    }
    for (const fail of ["profile", "mail", "marker", "opening", "commit"])
    {
        const { db, queries, state } = database({ fail });
        const before = structuredClone(state());
        await expect(markMailRead(db, 1, "self", mailReadQuery(false, "gift", now))).rejects
            .toThrow();
        expect(state()).toEqual(before);
        expect(queries.at(-1)?.text).toBe("rollback");
    }
});

test("direct mutation callers cannot bypass ID, owner, realm or query bounds", () => {
    const { db, queries } = database();
    const query = mailReadQuery(false, "gift", now);
    for (const owner of ["", " ", "x".repeat(41), "\0", "\ud800"])
    {
        expect(() => markMailRead(db, 1, owner, query)).toThrow();
    }
    for (const realm of [0, 1.5, 2147483648])
    {
        expect(() => markMailRead(db, realm, "self", query)).toThrow();
    }
    for (
        const patch of [
            { now: -1 },
            { now: NaN },
            { batch: 1 },
            { ids: [] },
            { ids: ["a", "a"] },
            { ids: ["\0"] },
            { ids: ["\ud800"] },
            { ids: ["x".repeat(41)] },
        ]
    )
    {
        expect(() => markMailRead(db, 1, "self", { ...query, ...patch } as typeof query)).toThrow();
    }
    expect(queries).toEqual([]);
});
