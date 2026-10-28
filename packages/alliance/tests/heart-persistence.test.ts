import { expect, test } from "bun:test";
import { getTableName, type SQL, type Table } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { encode, sfs } from "@opencok/messages/sfs";
import type { AllianceTransaction } from "../src/contracts/persistence";
import { AllianceHeartRepository } from "../src/repositories/heart";

function database(rows: readonly (readonly Record<string, unknown>[])[] = [])
{
    const dialect = new PgDialect();
    const queries: {
        kind: string;
        table?: string;
        sql?: string;
        where?: { sql: string; params: unknown[]; };
        order?: string[];
        lock?: string;
        limit?: number;
        values?: unknown;
    }[] = [];
    let index = 0;
    const builder = (kind: string, table?: Table) => {
        const query: (typeof queries)[number] = { kind, table: table && getTableName(table) };
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
            orderBy: (...values: SQL[]) => {
                query.order = values.map((value) => dialect.sqlToQuery(value).sql);

                return chain;
            },
            for: (value: string) => {
                query.lock = value;

                return chain;
            },
            limit: (value: number) => {
                query.limit = value;

                return chain;
            },
            set: (value: unknown) => {
                query.values = value;

                return chain;
            },
            values: (value: unknown) => {
                query.values = value;

                return chain;
            },
            returning: () => chain,
        });

        return chain;
    };
    const db = {
        execute: async (value: SQL) => {
            queries.push({ kind: "execute", sql: dialect.sqlToQuery(value).sql });
        },
        select: () => builder("select"),
        selectDistinct: () => builder("selectDistinct"),
        update: (table: Table) => builder("update", table),
        insert: (table: Table) => builder("insert", table),
        delete: (table: Table) => builder("delete", table),
    };

    return {
        queries,
        db: db as unknown as DatabaseClient<"kingdom">,
        tx: db as unknown as AllianceTransaction,
    };
}

const runtime = {
    recipient: (uid: string) => uid,
    cityInteger: (value: unknown) => Number(value),
};

test("heart send validates its target before the advisory lock and locks selected city points in order", async () => {
    const recipient = { uid: "other", serverId: 1 };
    const worlds = [{ uid: "owner", pointId: 4 }, { uid: "other", pointId: 1 }];
    const points = [{ id: 1 }, { id: 4 }];
    const members = [{ uid: "owner", allianceId: "alliance" }];
    const h = database([[recipient], worlds, points, members]);
    const repository = new AllianceHeartRepository({
        ...runtime,
        recipient: (uid) => {
            expect(uid).toBe("other");
            expect(h.queries).toEqual([]);

            return uid;
        },
    });
    expect(await repository.read(h.tx, "owner", "heart.send", encode({ uid: sfs.string("other") })))
        .toEqual({ recipient, worlds, points, members, pending: [] });
    expect(h.queries[0]).toEqual({
        kind: "execute",
        sql: "select pg_advisory_xact_lock(728214, 0)",
    });
    expect(h.queries.slice(1).map((query) => query.table)).toEqual([
        "userprofile",
        "user_world",
        "worldpoint",
        "alliance_member",
    ]);
    expect(h.queries[3]!.where?.params).toEqual([0, 4, 1]);
    expect(h.queries[3]!.order).toEqual(["\"opencok_kingdom\".\"worldpoint\".\"id\" asc"]);
    expect(h.queries[3]!.lock).toBe("update");
    const invalid = database();
    await expect(new AllianceHeartRepository({
        ...runtime,
        recipient: () => {
            throw new Error("invalid recipient");
        },
    }).read(invalid.tx, "owner", "heart.send", encode({ uid: sfs.string("other") })))
        .rejects.toThrow("invalid recipient");
    expect(invalid.queries).toEqual([]);
});

test("heart acknowledgments retain owned ID selection and fail on duplicate, oversized or stale batches", async () => {
    for (const delivered of [[1, 1], Array.from({ length: 65 }, (_, index) => index + 1)])
    {
        const h = database();
        await expect(new AllianceHeartRepository(runtime).write(h.tx, "owner", { delivered }))
            .rejects.toThrow("Invalid heart delivery selection");
        expect(h.queries).toEqual([]);
    }

    const h = database([[{ id: 4 }]]);
    const validated: unknown[][] = [];
    await expect(new AllianceHeartRepository({
        ...runtime,
        cityInteger: (value, minimum) => {
            validated.push([value, minimum]);

            return Number(value);
        },
    }).write(h.tx, "owner", { delivered: [4, 9] })).rejects.toThrow(
        "Stale heart delivery selection",
    );
    expect(validated).toEqual([[4, 1], [9, 1]]);
    expect(h.queries).toHaveLength(1);
    expect(h.queries[0]!.table).toBe("receive_heart");
    expect(h.queries[0]!.where?.params).toEqual(["owner", 4, 9]);
    const stale = database([[]]);
    await expect(new AllianceHeartRepository(runtime).write(stale.tx, "owner", {
        points: [{ id: 4, uid: "other", until: 9007199254740993n, effect: "1" }],
        pending: { uid: "other", duration: 60, effect: "1" },
        delivered: [1],
    })).rejects.toThrow("Stale heart city");
    expect(stale.queries).toHaveLength(1);
    expect(stale.queries[0]!.values).toEqual({
        sendHeartDurationTime: 9007199254740n,
        heartType: "1",
    });
    expect(stale.queries[0]!.where?.params).toEqual([0, 4, "other", 1]);
});

test("pending heart delivery reads preserve the locked batch and bound online owner discovery", async () => {
    const pending = [{ id: 9, senduid: "sender" }, { id: 10, senduid: "sender" }];
    const h = database([pending, [{ uid: "sender", name: "Sender" }], [{ pointId: 4 }]]);
    const repository = new AllianceHeartRepository(runtime);
    expect(await repository.read(h.tx, "owner", "heart.init")).toEqual({
        worlds: [{ pointId: 4 }],
        points: [],
        members: [],
        pending: pending.map((row) => ({ ...row, senderName: "Sender" })),
    });
    expect(h.queries[0]!.lock).toBe("update");
    expect(h.queries[0]!.limit).toBe(64);
    expect(h.queries[0]!.order).toEqual(["\"opencok_kingdom\".\"receive_heart\".\"id\" asc"]);
    expect(h.queries[1]!.where?.params).toEqual(["sender"]);
    const owners = database([[{ uid: "a" }, { uid: "b" }]]);
    expect(await repository.pendingOwners(owners.db, [])).toEqual([]);
    await expect(repository.pendingOwners(owners.db, Array.from({ length: 129 }, () => "a")))
        .rejects.toThrow("Heart owner selection exceeds bound");
    expect(owners.queries).toEqual([]);
    expect(await repository.pendingOwners(owners.db, ["b", "a"])).toEqual(["a", "b"]);
    expect(owners.queries[0]!.kind).toBe("selectDistinct");
    expect(owners.queries[0]!.limit).toBe(128);
    expect(owners.queries[0]!.order).toEqual([
        "\"opencok_kingdom\".\"receive_heart\".\"uid\" asc",
    ]);
});
