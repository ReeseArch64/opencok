import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import * as schema from "@opencok/drizzle/schema/global";
import { withAvailableNickname } from "@opencok/repositories/nickname-lock";
import { nicknameOccupied } from "@opencok/repositories/nickname";
import { validateNicknameChange } from "@opencok/rules/nickname-change";

function deferred()
{
    let resolve!: () => void;
    const promise = new Promise<void>((finish) => {
        resolve = finish;
    });
    return { promise, resolve };
}

function fixture()
{
    const locks = new Map<string, number>();
    const queries: { id: number; text: string; params: unknown[]; }[] = [];
    const released: number[] = [];
    const destroyed: number[] = [];
    const markers: number[] = [];
    let sequence = 0;
    let failure = "";
    let mapped = false;
    let occupied = false;
    let lockResult: unknown = undefined;
    const unlock = (id: number) => {
        for (const [key, owner] of locks)
        {
            if (owner === id)
            {
                locks.delete(key);
            }
        }
    };
    class Pool
    {
        async connect()
        {
            if (failure === "connect")
            {
                throw new Error("Synthetic pool failure");
            }
            const id = sequence++;
            let marker = false;
            return {
                release: (destroy = false) => {
                    released.push(id);
                    if (destroy)
                    {
                        destroyed.push(id);
                        unlock(id);
                    }
                },
                query: async (query: { text: string; }, params: unknown[] = []) => {
                    const text = query.text;
                    queries.push({ id, text, params });
                    if (text.startsWith("begin"))
                    {
                        expect(text).toBe("begin isolation level read committed read write");
                        if (failure === "begin")
                        {
                            throw Object.assign(new Error("Synthetic begin failure"), {
                                code: "08006",
                            });
                        }
                        return { rows: [] };
                    }
                    if (text === "rollback")
                    {
                        if (failure === "rollback")
                        {
                            throw new Error("Synthetic rollback failure");
                        }
                        marker = false;
                        unlock(id);
                        return { rows: [] };
                    }
                    if (text === "commit")
                    {
                        if (failure === "commit")
                        {
                            throw new Error("Synthetic commit failure");
                        }
                        if (marker)
                        {
                            markers.push(id);
                        }
                        unlock(id);
                        if (failure === "lost")
                        {
                            throw new Error("Synthetic lost commit acknowledgement");
                        }
                        return { rows: [] };
                    }
                    if (text.includes("pg_try_advisory_xact_lock"))
                    {
                        expect(text).toBe(
                            "select pg_try_advisory_xact_lock($1::bigint) as acquired",
                        );
                        expect(params).toHaveLength(1);
                        expect(typeof params[0]).toBe("string");
                        expect(BigInt.asIntN(64, BigInt(params[0] as string)).toString()).toBe(
                            params[0] as string,
                        );
                        if (failure === "lock")
                        {
                            throw Object.assign(new Error("Synthetic lock failure"), {
                                code: "57014",
                            });
                        }
                        if (lockResult !== undefined)
                        {
                            return { rows: lockResult };
                        }
                        const key = params[0] as string;
                        const acquired = !locks.has(key) || locks.get(key) === id;
                        if (acquired)
                        {
                            locks.set(key, id);
                        }
                        return { rows: [{ acquired }] };
                    }
                    expect([...locks.values()]).toContain(id);
                    if (text.includes("from \"opencok_global\".\"usermapping\""))
                    {
                        if (failure === "mapping")
                        {
                            throw Object.assign(new Error("Synthetic mapping failure"), {
                                code: "42P01",
                            });
                        }
                        return { rows: mapped ? [["self", "name", "alpha"]] : [] };
                    }
                    if (text.includes("from \"opencok_global\".\"account_new\""))
                    {
                        if (failure === "account")
                        {
                            throw Object.assign(new Error("Synthetic account failure"), {
                                code: "42P01",
                            });
                        }
                        return { rows: occupied ? [["self"]] : [] };
                    }
                    if (text === "select 1 as marker")
                    {
                        if (failure === "operation")
                        {
                            throw new Error("Synthetic operation failure");
                        }
                        marker = true;
                        return { rows: [{ marker: 1 }] };
                    }
                    throw new Error("Unexpected SQL");
                },
            };
        }
    }
    const db = drizzle(new Pool() as unknown as NodePgClient, { schema });
    return {
        db,
        locks,
        queries,
        markers,
        released,
        destroyed,
        fail: (value: string) => {
            failure = value;
        },
        directory: (mapping: boolean, account: boolean) => {
            mapped = mapping;
            occupied = account;
        },
        lockResult: (value: unknown) => {
            lockResult = value;
        },
    };
}

test("nickname mutation guard locks before strict availability and runs work on the same transaction", async () => {
    const instance = fixture();
    expect(
        await withAvailableNickname(instance.db, "alpha", async (tx) => {
            expect(instance.locks.size).toBe(1);
            const result = await tx.execute(sql`select 1 as marker`);
            expect(result.rows).toEqual([{ marker: 1 }]);
            return "done";
        }),
    ).toBe("done");
    expect(instance.queries.map((query) => query.id)).toEqual([0, 0, 0, 0, 0]);
    expect(instance.queries.map((query) => query.text.split(" ")[0])).toEqual([
        "begin",
        "select",
        "select",
        "select",
        "commit",
    ]);
    expect(instance.markers).toEqual([0]);
    expect(instance.locks.size).toBe(0);
    expect(instance.released).toEqual([0]);
});

test("equivalent nickname spellings contend across independent callers without invoking the loser", async () => {
    for (const other of ["alpha", "ÁLPHA", "ＡＬＰＨＡ", "alpha\u00a0", "al\u200bpha"])
    {
        const instance = fixture();
        const entered = deferred(),
            finish = deferred();
        const first = withAvailableNickname(instance.db, "alpha", async () => {
            entered.resolve();
            await finish.promise;
            return "winner";
        });
        await entered.promise;
        try
        {
            let invoked = false;
            await expect(
                withAvailableNickname(instance.db, other, async () => {
                    invoked = true;
                }),
            ).rejects.toMatchObject({ code: "105251" });
            expect(invoked).toBe(false);
            expect(instance.locks.size).toBe(1);
            expect(
                instance.queries.filter((query) => query.id === 1).map((query) =>
                    query.text.split(" ")[0]
                ),
            ).toEqual(["begin", "select", "rollback"]);
        }
        finally
        {
            finish.resolve();
        }
        expect(await first).toBe("winner");
        expect(instance.locks.size).toBe(0);
    }
});

test("different canonical nicknames can proceed while an earlier transaction remains active", async () => {
    const instance = fixture();
    const entered = deferred(),
        finish = deferred();
    const first = withAvailableNickname(instance.db, "alpha", async () => {
        entered.resolve();
        await finish.promise;
    });
    await entered.promise;
    try
    {
        expect(await withAvailableNickname(instance.db, "beta", async () => "other")).toBe("other");
        expect(instance.locks.size).toBe(1);
        const keys = instance.queries
            .filter((query) => query.text.includes("pg_try_advisory_xact_lock"))
            .map((query) => query.params[0]);
        expect(new Set(keys).size).toBe(2);
    }
    finally
    {
        finish.resolve();
    }
    await first;
});

test("occupied names reject before work while orphan mappings remain available under the held lock", async () => {
    const instance = fixture();
    instance.directory(true, true);
    let calls = 0;
    const work = async () => {
        calls++;
        return "changed";
    };
    await expect(withAvailableNickname(instance.db, "alpha", work)).rejects.toMatchObject({
        code: "105251",
    });
    expect(calls).toBe(0);
    expect(instance.locks.size).toBe(0);
    expect(instance.queries.at(-1)?.text).toBe("rollback");
    instance.directory(true, false);
    expect(await withAvailableNickname(instance.db, "alpha", work)).toBe("changed");
    expect(calls).toBe(1);
});

test("nickname mutation guard never treats SQL lookup failures as permission to charge", async () => {
    for (const stage of ["connect", "begin", "lock", "mapping", "account"])
    {
        const instance = fixture();
        instance.directory(true, false);
        instance.fail(stage);
        let calls = 0;
        await expect(
            withAvailableNickname(instance.db, "alpha", async () => {
                calls++;
            }),
        ).rejects.toThrow("nickname change transaction");
        expect(calls).toBe(0);
        expect(instance.locks.size).toBe(0);
        expect(instance.released).toEqual(stage === "connect" ? [] : [0]);
    }
});

test("nickname guard rejects malformed lock replies and input without starting protected work", async () => {
    for (
        const rows of [
            [],
            [{ acquired: null }],
            [{ acquired: 1 }],
            [{ acquired: "true" }],
            [{ acquired: true }, { acquired: true }],
        ]
    )
    {
        const instance = fixture();
        instance.lockResult(rows);
        await expect(
            withAvailableNickname(instance.db, "alpha", async () => {
                throw new Error("Unexpected callback");
            }),
        ).rejects.toThrow("nickname change transaction");
        expect(instance.queries).toHaveLength(3);
    }
    for (const name of ["", " alpha", "alpha ", "a\0b", "😀", "\ud800", "a".repeat(201), null, 1])
    {
        const instance = fixture();
        await expect(
            withAvailableNickname(instance.db, name as string, async () => {}),
        ).rejects.toThrow("nickname change input");
        expect(instance.queries).toHaveLength(0);
    }
});

test("callback and commit failures roll back while lost commit acknowledgements never report success", async () => {
    for (const failure of ["operation", "commit", "lost"])
    {
        const instance = fixture();
        instance.fail(failure);
        await expect(
            withAvailableNickname(
                instance.db,
                "alpha",
                async (tx) => tx.execute(sql`select 1 as marker`),
            ),
        ).rejects.toThrow("nickname change transaction");
        expect(instance.queries.at(-1)?.text).toBe("rollback");
        expect(instance.locks.size).toBe(0);
        expect(instance.markers).toEqual(failure === "lost" ? [0] : []);
        expect(instance.released).toEqual([0]);
    }
});

test("game exceptions keep their code and transaction cleanup permits a subsequent request", async () => {
    const instance = fixture();
    await expect(
        withAvailableNickname(
            instance.db,
            "alpha",
            async () =>
                validateNicknameChange("(alpha", { forbidden: () => false, badWords: () => false }),
        ),
    ).rejects.toMatchObject({ code: "113995" });
    expect(instance.locks.size).toBe(0);
    expect(await withAvailableNickname(instance.db, "alpha", async () => "retry")).toBe("retry");
});

test("failed rollback discards the connection and does not turn an uncertain operation into success", async () => {
    const instance = fixture();
    instance.fail("rollback");
    await expect(
        withAvailableNickname(instance.db, "alpha", async () => {
            throw new Error("Synthetic operation failure");
        }),
    ).rejects.toThrow("nickname change transaction");
    expect(instance.destroyed).toEqual([0]);
    expect(instance.locks.size).toBe(0);
    instance.fail("");
    expect(await withAvailableNickname(instance.db, "alpha", async () => "retry")).toBe("retry");
});

test("read-only nickname availability retains its legacy SQL fallback independently of the mutation guard", async () => {
    const db = drizzle(
        {
            query: async () => {
                throw Object.assign(new Error("Synthetic SQL failure"), { code: "42P01" });
            },
        } as unknown as NodePgClient,
        { schema },
    );
    expect(await nicknameOccupied(db, "alpha")).toBe(false);
});
