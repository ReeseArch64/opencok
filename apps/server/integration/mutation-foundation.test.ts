import { expect, test } from "bun:test";
import { createDatabase } from "@opencok/drizzle";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { acquireRealmAuthority, fenceRealmDatabase } from "@opencok/repositories/realm-authority";
import { createMutationExecutor, relayMutationEvent } from "@opencok/repositories/mutation";
import { createEconomyMutationExecutor } from "@opencok/repositories/economy-mutation";
import { updateProfilePreference } from "@opencok/repositories/profile-preferences";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { eq } from "drizzle-orm";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";

function loseCommit(pool: ReturnType<typeof createDatabase<"kingdom">>["pool"], statement: string)
{
    const originalConnect = pool.connect;
    const connect = pool.connect.bind(pool);
    let armed = true;
    Object.defineProperty(pool, "connect", {
        configurable: true,
        value: (...connectArgs: unknown[]) => {
            if (connectArgs.length)
            {
                return Reflect.apply(originalConnect, pool, connectArgs);
            }
            return connect().then((client) => {
                let touched = false;
                return {
                    async query(...args: unknown[])
                    {
                        const first = args[0];
                        const text = typeof first === "string"
                            ? first
                            : first && typeof first === "object" && "text" in first
                            ? first.text
                            : undefined;
                        if (typeof text === "string" && text.startsWith("begin"))
                        {
                            touched = false;
                        }
                        if (typeof text === "string" && text.trimStart().startsWith(statement))
                        {
                            touched = true;
                        }
                        const result = await Reflect.apply(client.query, client, args);
                        if (armed && touched && text === "commit")
                        {
                            armed = false;
                            throw new Error("Synthetic lost commit response");
                        }
                        return result;
                    },
                    release: (destroy?: boolean) => client.release(destroy),
                };
            });
        },
    });
    return {
        restore: () => Object.defineProperty(pool, "connect", { value: originalConnect }),
        fired: () => !armed,
    };
}

const command = (requestId: string) => ({
    owner: "synthetic-owner",
    requestId,
    command: "synthetic.purchase",
    request: Buffer.from([0, 255, 1]),
});

test(
    "persistent mutation receipts, ledger and epoch fencing survive concurrency, rollback and restart",
    async () => {
        const pg = new DisposablePostgres();
        const databases: ReturnType<typeof createDatabase<"kingdom">>[] = [];
        try
        {
            const admin = await pg.start();
            await admin.query("CREATE DATABASE \"mutation_one\"");
            await admin.query("CREATE DATABASE \"mutation_two\"");
            await admin.end();
            const open = (database: string) => {
                const result = createDatabase("kingdom", {
                    ...pg.options,
                    database,
                    max: 5,
                    statement_timeout: 4000,
                    query_timeout: 4500,
                });
                databases.push(result);
                return result;
            };
            const first = open("mutation_one"),
                second = open("mutation_one"),
                other = open("mutation_two");
            for (
                const [database, realm] of [
                    [first, 1],
                    [other, 2],
                ] as const
            )
            {
                await migrate(database.db, {
                    migrationsFolder:
                        new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
                            .pathname,
                });
                await database.db.insert(userprofile).values({
                    uid: "synthetic-owner",
                    name: "Synthetic",
                    serverId: realm,
                    country: "BR",
                    level: 1,
                    exp: 0,
                    gold: 9007199254740993n,
                });
                await database.db.insert(user_resource).values({
                    uid: "synthetic-owner",
                    wood: 20n,
                    stone: 0n,
                    iron: 0n,
                    food: 50n,
                    silver: 0,
                    chip: 0,
                    diamond: 0,
                    dragon_food: 0,
                    dragon_gold: 0,
                    lastUpdateTime: 0n,
                });
                await database.db.insert(user_mixed_info).values({
                    uid: "synthetic-owner",
                    mdata: "{}",
                });
            }
            let ready = true;
            const owner = await acquireRealmAuthority(first.db, 1, () => ready);
            const execute = createEconomyMutationExecutor(first.db, owner);
            let applications = 0;
            const purchase = async () => {
                applications++;
                return {
                    changes: [
                        { asset: "profile.gold" as const, delta: -7n, reason: "synthetic.cost" },
                        { asset: "resource.wood" as const, delta: 5n, reason: "synthetic.reward" },
                    ],
                    response: Buffer.from([0, 128, 255]),
                    events: [
                        {
                            id: "synthetic-event",
                            type: "purchase.confirmed",
                            payload: Buffer.from("synthetic"),
                        },
                    ],
                };
            };
            const replies = await Promise.all(
                Array.from({ length: 8 }, () => execute(command("duplicate"), purchase)),
            );
            expect(applications).toBe(1);
            for (const reply of replies)
            {
                expect(reply).toEqual(Buffer.from([0, 128, 255]));
            }
            expect(await first.db.select().from(command_receipt)).toHaveLength(1);
            const postings = await first.db.select().from(economy_posting).orderBy(
                economy_posting.entry,
            );
            expect(postings.map((p) => [p.before, p.delta, p.after])).toEqual([
                [9007199254740993n, -7n, 9007199254740986n],
                [20n, 5n, 25n],
            ]);
            await expect(
                execute({ ...command("duplicate"), request: Buffer.from("changed") }, purchase),
            ).rejects.toThrow("conflict");
            await expect(execute({ ...command("duplicate"), command: "other" }, purchase)).rejects
                .toThrow(
                    "conflict",
                );
            expect(applications).toBe(1);
            for (const delta of [-9007199254740993n, 9223372036854775807n])
            {
                await expect(
                    execute(command(`invalid-${delta}`), async () => ({
                        changes: [{ asset: "profile.gold", delta, reason: "invalid" }],
                        response: Buffer.alloc(0),
                    })),
                ).rejects.toThrow("balance");
            }
            const generic = createMutationExecutor(first.db, owner);
            await expect(
                generic(command("rollback"), async (tx) => {
                    await tx
                        .update(userprofile)
                        .set({ gold: 1n })
                        .where(eq(userprofile.uid, "synthetic-owner"));
                    throw new Error("synthetic transaction failure");
                }),
            ).rejects.toThrow("synthetic transaction failure");
            expect((await first.db.select().from(userprofile))[0]!.gold).toBe(9007199254740986n);
            expect(await first.db.select().from(command_receipt)).toHaveLength(1);
            await expect(
                execute(command("invalid-effect"), async () => ({
                    changes: [{ asset: "profile.gold", delta: -1n, reason: "test" }],
                    response: Buffer.alloc(1048577),
                })),
            ).rejects.toThrow("payload");
            expect((await first.db.select().from(userprofile))[0]!.gold).toBe(9007199254740986n);
            for (const table of ["command_receipt", "economy_posting", "mutation_outbox"])
            {
                await first.pool.query(
                    `CREATE OR REPLACE FUNCTION opencok_kingdom.synthetic_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic write failure'; END $$`,
                );
                await first.pool.query(
                    `CREATE TRIGGER synthetic_failure BEFORE INSERT ON opencok_kingdom.${table} FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.synthetic_failure()`,
                );
                try
                {
                    await expect(
                        execute(command(`failure-${table}`), async () => ({
                            changes: [{ asset: "profile.gold", delta: -1n, reason: "test" }],
                            response: Buffer.alloc(0),
                            events: [{ id: "failure", type: "test", payload: Buffer.alloc(0) }],
                        })),
                    ).rejects.toThrow();
                    expect((await first.db.select().from(userprofile))[0]!.gold).toBe(
                        9007199254740986n,
                    );
                    expect(await first.db.select().from(command_receipt)).toHaveLength(1);
                    expect(await first.db.select().from(economy_posting)).toHaveLength(2);
                }
                finally
                {
                    await first.pool.query(
                        `DROP TRIGGER synthetic_failure ON opencok_kingdom.${table}`,
                    );
                }
            }
            let publishes = 0;
            await expect(
                relayMutationEvent(first.db, owner, async () => {
                    publishes++;
                    throw new Error("lost remote acknowledgment");
                }),
            ).rejects.toThrow();
            expect((await first.db.select().from(mutation_outbox))[0]!.publishedAt).toBe(0n);
            expect(
                await relayMutationEvent(first.db, owner, async (event) => {
                    publishes++;
                    expect(event.id).toBe("synthetic-event");
                    expect(event.kingdomId).toBe(1);
                }),
            ).toBe(true);
            expect(
                await relayMutationEvent(first.db, owner, async () => {
                    publishes++;
                }),
            ).toBe(false);
            expect(publishes).toBe(2);
            const competing = await Promise.allSettled(
                ["food-a", "food-b"].map((id) =>
                    execute(command(id), async () => ({
                        changes: [{ asset: "resource.food", delta: -40n, reason: "test.cost" }],
                        response: Buffer.alloc(0),
                    }))
                ),
            );
            expect(competing.filter((result) => result.status === "fulfilled")).toHaveLength(1);
            expect((await first.db.select().from(user_resource))[0]!.food).toBe(10n);
            const otherOwner = await acquireRealmAuthority(other.db, 2, () => true);
            await createEconomyMutationExecutor(other.db, otherOwner)(
                command("duplicate"),
                purchase,
            );
            expect(await other.db.select().from(command_receipt)).toHaveLength(1);
            await expect(
                createMutationExecutor(other.db, owner)(command("wrong-realm"), async () => ({
                    response: Buffer.alloc(0),
                })),
            ).rejects.toThrow();
            ready = false;
            await expect(execute(command("disconnected"), purchase)).rejects.toThrow();
            ready = true;
            await expect(
                generic(command("loss-during-write"), async (tx) => {
                    await tx
                        .update(userprofile)
                        .set({ gold: 1n })
                        .where(eq(userprofile.uid, "synthetic-owner"));
                    ready = false;
                    return { response: Buffer.alloc(0) };
                }),
            ).rejects.toThrow();
            ready = true;
            expect((await first.db.select().from(userprofile))[0]!.gold).toBe(9007199254740986n);
            fenceRealmDatabase(first.db, owner);
            expect(() => first.db.update(userprofile)).toThrow("transaction");
            expect(
                await updateProfilePreference(
                    first.db,
                    "synthetic-owner",
                    1,
                    "showEquip",
                    Date.now(),
                    () => 1,
                ),
            ).toBe(1);
            let release!: () => void, entered!: () => void;
            const gate = new Promise<void>((resolve) => {
                release = resolve;
            });
            const locked = new Promise<void>((resolve) => {
                entered = resolve;
            });
            const pending = generic(command("in-flight"), async () => {
                entered();
                await gate;
                return { response: Buffer.from("ordered") };
            });
            await locked;
            let acquired = false;
            const takeover = acquireRealmAuthority(second.db, 1, () => true).then((authority) => {
                acquired = true;
                return authority;
            });
            await Bun.sleep(50);
            expect(acquired).toBe(false);
            release();
            await pending;
            const replacement = await takeover;
            expect(replacement.epoch).toBe(owner.epoch + 1n);
            await expect(
                updateProfilePreference(
                    first.db,
                    "synthetic-owner",
                    1,
                    "showEquip",
                    Date.now(),
                    () => 0,
                ),
            ).rejects.toThrow();
            await expect(execute(command("duplicate"), purchase)).rejects.toThrow();
            const resumed = createEconomyMutationExecutor(second.db, replacement);
            expect(await resumed(command("duplicate"), purchase)).toEqual(replies[0]!);
            expect(applications).toBe(2);
            const loss = loseCommit(
                second.pool,
                "insert into \"opencok_kingdom\".\"command_receipt\"",
            );
            try
            {
                await expect(resumed(command("uncertain"), purchase)).rejects.toThrow();
                expect(loss.fired()).toBe(true);
                expect(await resumed(command("uncertain"), purchase)).toEqual(replies[0]!);
                expect(applications).toBe(3);
            }
            finally
            {
                loss.restore();
            }
            for (const database of databases.splice(0))
            {
                await database.close();
            }
            await pg.restart();
            const restarted = open("mutation_one");
            const restartOwner = await acquireRealmAuthority(restarted.db, 1, () => true);
            expect(
                await createEconomyMutationExecutor(restarted.db, restartOwner)(
                    command("duplicate"),
                    purchase,
                ),
            ).toEqual(replies[0]!);
            expect(applications).toBe(3);
            expect((await restarted.db.select().from(userprofile))[0]!.gold).toBe(
                9007199254740979n,
            );
            expect(await restarted.db.select().from(economy_posting)).toHaveLength(5);
        }
        finally
        {
            await Promise.allSettled(databases.map((database) => database.close()));
            await pg.stop();
        }
    },
    120000,
);
