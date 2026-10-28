import { expect, test } from "bun:test";
import { getTableName, type SQL, type Table } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";
import type { AllianceTransaction } from "../src/contracts/persistence";
import type { AllianceRecord } from "../src/contracts/records";
import type { AlliancePlan } from "../src/contracts/mutation";
import type {
    AllianceCommitRuntime,
    AllianceGameplayRuntime,
} from "../src/contracts/gameplay-runtime";
import { AllianceParticipantRepository } from "../src/repositories/participants";
import { AllianceGameplayRepository } from "../src/repositories/gameplay";
import { AllianceCommitRepository } from "../src/repositories/commit";
import { AllianceWriteRepository } from "../src/repositories/writes";

const readers = {
    text: (row: AllianceRecord, key: string) => String(row[key] ?? ""),
    long: (row: AllianceRecord, key: string) => BigInt(String(row[key] ?? 0)),
};
const input: MutationCommand = {
    owner: "owner",
    command: "al.apply",
    requestId: "request",
    request: Buffer.alloc(0),
};

function database(rows: readonly (readonly Record<string, unknown>[])[] = [])
{
    const dialect = new PgDialect();
    const queries: {
        kind: string;
        table: string;
        limit?: number;
        lock?: string;
        order?: string[];
        where?: { sql: string; params: unknown[]; };
        values?: unknown;
    }[] = [];
    let index = 0;
    const builder = (kind: string, table?: Table) => {
        const query: (typeof queries)[number] = { kind, table: table ? getTableName(table) : "" };
        queries.push(query);
        const result = rows[index++] ?? [];
        const chain = Object.assign(Promise.resolve(result), {
            from: (table: Table) => {
                query.table = getTableName(table);

                return chain;
            },
            where: (value: SQL) => {
                query.where = dialect.sqlToQuery(value);

                return chain;
            },
            limit: (value: number) => {
                query.limit = value;

                return chain;
            },
            orderBy: (...values: SQL[]) => {
                query.order = values.map((value) => dialect.sqlToQuery(value).sql);

                return chain;
            },
            for: (value: string) => {
                query.lock = value;

                return chain;
            },
            set: (value: unknown) => {
                query.values = value;

                return chain;
            },
        });

        return chain;
    };
    const db = {
        select: () => builder("select"),
        delete: (table: Table) => builder("delete", table),
        update: (table: Table) => builder("update", table),
    };

    return {
        queries,
        db: db as unknown as DatabaseClient<"kingdom">,
        tx: db as unknown as AllianceTransaction,
    };
}

function plan(): AlliancePlan
{
    return {
        write: {},
        inventory: {
            response: Buffer.alloc(0),
            postings: [],
            items: [],
            profile: {},
            resource: {},
            cooldowns: new Map(),
        },
    };
}

test("participant discovery combines saved profiles, owned mail and applications in sorted bounded sets", async () => {
    const h = database([
        [{ uid: "owner", allianceId: "z" }, { uid: "selected", allianceId: "a" }],
        [{ type: 17, contents: Buffer.from("{\"allianceId\":\"b\"}") }],
        [{ allianceId: "d", userId: "applicant" }],
        [{ uid: "existing" }, { uid: "owner" }, { uid: "existing" }],
    ]);
    const found = await new AllianceParticipantRepository(h.db).discover(input, {
        playerId: "selected",
        allianceId: "c",
        mailId: "mail",
    });
    expect(found.groups).toEqual(["a", "b", "c", "d", "z"]);
    expect(found.participants).toEqual(["applicant", "existing", "owner", "selected"]);
    expect([...found.ids].sort()).toEqual(found.groups);
    expect(h.queries.map((query) => query.table)).toEqual([
        "userprofile",
        "mail",
        "alliance_apply",
        "alliance_member",
    ]);
    expect(h.queries[1]!.where?.params).toEqual(["mail", "owner"]);
    expect(h.queries[2]!.where?.params).toEqual(["mail"]);
    expect(h.queries[3]!.limit).toBe(2049);
});

test("imported application mail binds its applicant while an empty alliance set skips member discovery", async () => {
    const imported = database([
        [{ allianceId: "guild" }],
        [{ type: 25, contents: Buffer.from("{\"applicantId\":\"imported\"}") }],
        [],
        [],
    ]);
    expect(
        (await new AllianceParticipantRepository(imported.db).discover(input, { mailId: "legacy" }))
            .participants,
    )
        .toEqual(["imported", "owner"]);
    const empty = database([[{ uid: "owner", allianceId: "" }]]);
    const result = await new AllianceParticipantRepository(empty.db).discover(input, {});
    expect(result.groups).toEqual([]);
    expect(result.participants).toEqual(["owner"]);
    expect(empty.queries).toHaveLength(1);
});

test("transaction revalidation rejects changed memberships and participants before inventory execution", async () => {
    for (const scenario of ["membership", "participants", "valid"])
    {
        const h = database([
            [{ uid: "owner", allianceId: scenario === "membership" ? "new" : "guild" }],
            [{ uid: "guild" }],
            [{ uid: scenario === "participants" ? "intruder" : "owner", allianceId: "guild" }],
            [],
        ]);
        const calls: string[] = [];
        const runtime: AllianceGameplayRuntime<
            { profile: AllianceRecord; resource: AllianceRecord; }
        > = {
            now: () => 123,
            kingdomId: 1,
            execute: async (command, apply) => {
                expect(command.participants).toEqual(["owner"]);
                calls.push("mutation");

                return Buffer.from((await apply(h.tx)).response);
            },
            executeInventory: async () => {
                calls.push("inventory");

                return { response: Buffer.alloc(0) };
            },
        };
        const repository = new AllianceGameplayRepository(runtime, {
            discover: async () => ({
                ids: new Set(["guild"]),
                groups: ["guild"],
                participants: ["owner"],
            }),
        }, {
            apply: async () => {
                calls.push("commit");
            },
        });

        if (scenario === "valid")
        {
            await repository.execute(input, {}, async () => plan());
            expect(calls).toEqual(["mutation", "inventory"]);
        }
        else
        {
            await expect(repository.execute(input, {}, async () => plan())).rejects.toThrow(
                scenario === "membership"
                    ? "Alliance membership changed"
                    : "Alliance participants changed",
            );
            expect(calls).toEqual(["mutation"]);
        }

        if (scenario !== "membership")
        {
            expect(h.queries.slice(0, 3).map((query) => [query.table, query.lock])).toEqual([
                ["userprofile", undefined],
                ["alliance", "update"],
                ["alliance_member", "update"],
            ]);
            expect(h.queries[1]!.order).toEqual(["\"opencok_kingdom\".\"alliance\".\"uid\" asc"]);
            expect(h.queries[2]!.order).toEqual([
                "\"opencok_kingdom\".\"alliance_member\".\"uid\" asc",
            ]);
        }
    }
});

test("production wrappers settle unique owners in order around writes and quest actions", async () => {
    const h = database(), result = plan(), calls: string[] = [];
    result.productionOwners = ["b", "a", "b"];
    result.productionAt = 77n;
    result.write.actions = [{ uid: "a", kind: "alliance.help", count: 1 }];
    const runtime: AllianceCommitRuntime = {
        ...readers,
        domains: new Map(),
        boundary: async (tx, owner, at, change, deleted, economy) => {
            expect(tx).toBe(h.tx);
            expect(at).toBe(77n);
            expect(deleted).toEqual([]);
            expect(() => economy.gold(1n)).toThrow("Unexpected alliance gold credit");
            calls.push("enter:" + owner);
            await change();
            calls.push("exit:" + owner);
        },
        recordAction: async (_tx, owner, kind, count, at) => {
            expect([owner, kind, count, at]).toEqual(["a", "alliance.help", 1, 99n]);
            calls.push("action");
        },
    };
    await new AllianceCommitRepository(runtime, {
        write: async (_tx, owner, write, participants, groups) => {
            expect(owner).toBe("owner");
            expect(write).toBe(result.write);
            expect(participants).toEqual(["owner", "a", "b"]);
            expect(groups).toEqual(["guild"]);
            calls.push("write");
        },
    }).apply(h.tx, "owner", result, ["owner", "a", "b"], ["guild"], 99n);
    expect(calls).toEqual(["enter:a", "enter:b", "write", "action", "exit:b", "exit:a"]);
});

test("foreign production owners reject before writes and foreign quest actors reject after writes", async () => {
    for (const kind of ["production", "action"])
    {
        const h = database(), result = plan(), calls: string[] = [];

        if (kind === "production")
        {
            result.productionOwners = ["foreign"];
        }
        else
        {
            result.write.actions = [{ uid: "foreign", kind: "alliance.help", count: 1 }];
        }

        const runtime: AllianceCommitRuntime = {
            ...readers,
            domains: new Map(),
            boundary: async () => {
                calls.push("boundary");
            },
            recordAction: async () => {
                calls.push("action");
            },
        };
        await expect(new AllianceCommitRepository(runtime, {
            write: async () => {
                calls.push("write");
            },
        })
            .apply(h.tx, "owner", result, ["owner"], ["guild"], 99n)).rejects.toThrow(
                kind === "production"
                    ? "Foreign alliance production owner"
                    : "Foreign alliance action",
            );
        expect(calls).toEqual(kind === "production" ? [] : ["write"]);
    }
});

test("help rescheduling uses the saved activity, exact deadline and version before aggregate writes", async () => {
    const saved = {
        id: "activity",
        ownerId: "owner",
        queueId: "queue",
        type: 1,
        itemId: "item",
        startedAt: 1n,
        dueAt: 100n,
        version: 2,
        status: 0,
        data: { pinned: true },
    };
    const h = database([[saved]]), result = plan(), calls: string[] = [];
    result.write.activities = [{ id: "activity", type: 1, dueAt: 9007199254740993n, version: 3 }];
    const runtime: AllianceCommitRuntime = {
        ...readers,
        domains: new Map([[1, async (tx, action, activity, at, economy) => {
            expect(tx).toBe(h.tx);
            expect(action).toBe("reschedule");
            expect(activity).toEqual({ ...saved, dueAt: 9007199254740993n, version: 3 });
            expect(at).toBe(99n);
            expect(() => economy.resource("wood", 1n)).toThrow("Unexpected help resource change");
            expect(() => economy.gold(1n)).toThrow("Unexpected help gold change");
            expect(() => economy.item("item", 1)).toThrow("Unexpected help item change");
            calls.push("reschedule");

            return Buffer.alloc(0);
        }]]),
        boundary: async (_tx, _owner, _at, change) => change(),
    };
    await new AllianceCommitRepository(runtime, {
        write: async () => {
            calls.push("write");
        },
    })
        .apply(h.tx, "owner", result, ["owner"], ["guild"], 99n);
    expect(calls).toEqual(["reschedule", "write"]);

    for (const rows of [[], [saved]])
    {
        const missing = database([rows]);
        const invalidRuntime = { ...runtime, domains: new Map() };
        await expect(new AllianceCommitRepository(invalidRuntime, {
            write: async () => {
                calls.push("unexpected");
            },
        })
            .apply(missing.tx, "owner", result, ["owner"], ["guild"], 99n)).rejects.toThrow(
                "Unsupported helped activity",
            );
    }

    expect(calls).toEqual(["reschedule", "write"]);
});

test("alliance deletion retains cleanup order and rejects foreign IDs before deletion", async () => {
    const h = database();
    await new AllianceWriteRepository(readers).write(
        h.tx,
        "owner",
        { deletedAlliances: ["guild"] },
        ["owner"],
        ["guild"],
    );
    expect(h.queries.map((query) => [query.kind, query.table])).toEqual([
        ["delete", "alliance"],
        ["delete", "alliance_science"],
        ["delete", "alliance_science_upgrade"],
        ["delete", "alliance_apply"],
        ["update", "alliance_help"],
    ]);
    expect(h.queries.every((query) => query.where?.params.includes("guild"))).toBe(true);
    expect(h.queries.at(-1)!.values).toEqual({ isvalid: 0 });
    const foreign = database();
    await expect(
        new AllianceWriteRepository(readers).write(
            foreign.tx,
            "owner",
            { deletedAlliances: ["foreign"] },
            ["owner"],
            ["guild"],
        ),
    ).rejects.toThrow("Foreign alliance deletion");
    expect(foreign.queries).toEqual([]);
});
