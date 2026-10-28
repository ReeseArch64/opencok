import { realm_authority } from "@opencok/drizzle/schema/opencok_kingdom/realm_authority";
import { eq } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { expect, test } from "bun:test";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { loadRules } from "@opencok/resources/rules";
import { worldBirthRules, parseWorldBirth } from "@opencok/rules/world-birth";
import {
    initializeWorldBirth,
    worldBirthIdentity,
    allocateWorldBirth,
    createWorldBirthAdopter,
} from "@opencok/repositories/world-birth";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";

test(
    "fresh birth initialization commits only with the imported world, rejects existing players and fences stale owners",
    async () => {
        const pg = new DisposablePostgres();
        let db: ReturnType<typeof createDatabase<"kingdom">> | undefined;
        try
        {
            const admin = await pg.start();
            await admin.query("CREATE DATABASE \"world_birth\"");
            await admin.end();
            db = createDatabase("kingdom", { ...pg.options, database: "world_birth", max: 4 });
            await migrate(db.db, {
                migrationsFolder:
                    new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
                        .pathname,
            });
            const rules = worldBirthRules(await loadRules()),
                authority = await acquireRealmAuthority(db.db, 1, () => true);
            await expect(
                db.db.transaction(async (tx) => {
                    await initializeWorldBirth(tx, authority, rules, 1000000n);
                    throw new Error("forced import rollback");
                }),
            ).rejects.toThrow("forced import rollback");
            expect(await db.db.select().from(trigger_var)).toHaveLength(0);
            await db.db.transaction((tx) => initializeWorldBirth(tx, authority, rules, 1000000n));
            const [saved] = await db.db.select().from(trigger_var);
            expect(saved).toMatchObject({ ...worldBirthIdentity, refreshtime: 1000000n });
            expect(parseWorldBirth(saved!.value)).toMatchObject({
                schema: 1,
                version: 1,
                priority: 43000,
                round: 1,
                phase: 0,
                epoch: String(authority.epoch),
                counts: {},
            });
            await expect(
                db.db.transaction((tx) => initializeWorldBirth(tx, authority, rules, 1000000n)),
            ).rejects.toThrow("fresh resident world");
            await acquireRealmAuthority(db.db, 1, () => true);
            await expect(
                db.db.transaction((tx) => initializeWorldBirth(tx, authority, rules, 1000000n)),
            ).rejects.toThrow();
            expect(await db.db.select().from(trigger_var)).toEqual([saved!]);
            await db.db.delete(trigger_var);
            await db.db.insert(userprofile).values({
                uid: "existing-resident",
                serverId: 1,
                name: "Synthetic",
                country: "BR",
                level: 1,
                exp: 0,
            });
            const owner = await acquireRealmAuthority(db.db, 1, () => true);
            await expect(
                db.db.transaction((tx) => initializeWorldBirth(tx, owner, rules, 1000000n)),
            ).rejects.toThrow("fresh resident world");
            expect(await db.db.select().from(trigger_var)).toHaveLength(0);
        }
        finally
        {
            await db?.close();
            await pg.stop();
        }
    },
    120000,
);

test(
    "shared birth allocation honors native priority regions, rolls back failed placements and rehydrates factual counts on epoch replacement",
    async () => {
        const pg = new DisposablePostgres();
        let db: ReturnType<typeof createDatabase<"kingdom">> | undefined;
        try
        {
            const admin = await pg.start();
            await admin.query("CREATE DATABASE \"birth_allocation\"");
            await admin.end();
            db = createDatabase("kingdom", { ...pg.options, database: "birth_allocation", max: 4 });
            await migrate(db.db, {
                migrationsFolder:
                    new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
                        .pathname,
            });
            const rules = { ...worldBirthRules(await loadRules()), limits: [1] },
                authority = await acquireRealmAuthority(db.db, 1, () => true),
                first = 1 + 181 + 181 * 1201,
                second = 1 + 181 + 421 * 1201;
            await db.db.insert(worldpoint).values(
                [first, second].flatMap((point) =>
                    [point, point - 1, point - 1201, point - 1202].map((id) => ({
                        id,
                        worldId: 0,
                        x: (id - 1) % 1201,
                        y: Math.floor((id - 1) / 1201),
                        areaId: 1,
                        bornAreaId: point === first ? 67 : 71,
                        gridType: 2,
                        grid2Type: 0,
                        pointType: 0,
                        resLevel: 0,
                        resInitValue: 0,
                    }))
                ),
            );
            await db.db.transaction((tx) => initializeWorldBirth(tx, authority, rules, 1n));
            const place = async (owner: typeof authority, uid: string, fail = false) =>
                db!.db.transaction(async (tx) => {
                    const allocated = await allocateWorldBirth(tx, owner, 1201, rules, 1000000n);
                    await tx.insert(userprofile).values({
                        uid,
                        name: "Synthetic",
                        serverId: 1,
                        country: "BR",
                        level: 1,
                        exp: 0,
                        worldPoint: allocated.point,
                    });
                    for (const point of allocated.points)
                    {
                        await tx
                            .update(worldpoint)
                            .set({ pointType: point.id === allocated.point ? 1 : 8, ownerId: uid })
                            .where(eq(worldpoint.id, Number(point.id)));
                    }
                    if (fail)
                    {
                        throw new Error("failed city placement");
                    }
                    return allocated.point;
                });
            await expect(
                db.db.transaction(async (tx) => {
                    const random = await allocateWorldBirth(
                        tx,
                        authority,
                        1201,
                        rules,
                        1000000n,
                        "random",
                    );
                    expect([first, second]).toContain(random.point);
                    expect(
                        parseWorldBirth((await tx.select().from(trigger_var))[0]!.value).priority,
                    ).toBe(
                        43000,
                    );
                    throw new Error("random placement rollback");
                }),
            ).rejects.toThrow("random placement rollback");
            await expect(place(authority, "rolled-back", true)).rejects.toThrow(
                "failed city placement",
            );
            expect(parseWorldBirth((await db.db.select().from(trigger_var))[0]!.value))
                .toMatchObject({
                    version: 1,
                    priority: 43000,
                    counts: {},
                });
            expect(await db.db.select().from(userprofile)).toHaveLength(0);
            expect(await place(authority, "first-city")).toBe(first);
            const prior = (await db.db.select().from(trigger_var))[0]!,
                state = parseWorldBirth(prior.value);
            expect(state).toMatchObject({ version: 2, priority: 43001, counts: { 67: 1 } });
            state.counts[67] = 999;
            await db.db.update(trigger_var).set({ value: JSON.stringify(state) });
            const replacement = await acquireRealmAuthority(db.db, 1, () => true);
            await expect(place(authority, "stale-city")).rejects.toThrow();
            expect(await place(replacement, "second-city")).toBe(second);
            const saved = parseWorldBirth((await db.db.select().from(trigger_var))[0]!.value);
            expect(saved).toMatchObject({
                version: 3,
                priority: 43002,
                epoch: String(replacement.epoch),
                counts: { 67: 1, 71: 1 },
            });
            await expect(place(replacement, "no-space")).rejects.toThrow();
            expect(parseWorldBirth((await db.db.select().from(trigger_var))[0]!.value)).toEqual(
                saved,
            );
            expect(await db.db.select().from(userprofile)).toHaveLength(2);
        }
        finally
        {
            await db?.close();
            await pg.stop();
        }
    },
    120000,
);

test(
    "unknown imported birth phases require explicit audited operator adoption with stable receipts and expected versions",
    async () => {
        const pg = new DisposablePostgres();
        let db: ReturnType<typeof createDatabase<"kingdom">> | undefined;
        try
        {
            const admin = await pg.start();
            await admin.query("CREATE DATABASE \"birth_adoption\"");
            await admin.end();
            db = createDatabase("kingdom", { ...pg.options, database: "birth_adoption", max: 4 });
            await migrate(db.db, {
                migrationsFolder:
                    new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
                        .pathname,
            });
            const rules = worldBirthRules(await loadRules()),
                authority = await acquireRealmAuthority(db.db, 1, () => true),
                adopt = createWorldBirthAdopter(db.db, authority, rules, () => 1000000),
                request = {
                    operator: "synthetic-operator",
                    reason: "known source phase",
                    operationId: "source-phase-adoption",
                    expectedVersion: null,
                    priority: 43010,
                    round: 2,
                    phase: 1 as const,
                };
            await expect(
                db.db.transaction((tx) => allocateWorldBirth(tx, authority, 1201, rules, 1000000n)),
            ).rejects.toThrow();
            expect(await db.db.select().from(trigger_var)).toHaveLength(0);
            const replies = await Promise.all(Array.from({ length: 4 }, () => adopt(request)));
            expect(replies.every((reply) => reply.version === 1)).toBe(true);
            const saved = (await db.db.select().from(trigger_var))[0]!;
            expect(parseWorldBirth(saved.value)).toMatchObject({
                version: 1,
                priority: 43010,
                round: 2,
                phase: 1,
                counts: {},
            });
            expect(await db.db.select().from(command_receipt)).toHaveLength(1);
            await expect(adopt({ ...request, reason: "different evidence" })).rejects.toThrow(
                "receipt conflict",
            );
            await expect(adopt({ ...request, operationId: "stale-adoption" })).rejects.toThrow(
                "version changed",
            );
            expect(await db.db.select().from(trigger_var)).toEqual([saved]);
            await expect(
                adopt({ ...request, operationId: "invalid-adoption", priority: 42999 }),
            ).rejects.toThrow();
            const next = await adopt({
                ...request,
                operationId: "next-adoption",
                expectedVersion: 1,
                phase: 2,
            });
            expect(next.version).toBe(2);
            expect(await db.db.select().from(command_receipt)).toHaveLength(2);
            await acquireRealmAuthority(db.db, 1, () => true);
            await expect(
                adopt({ ...request, operationId: "lost-authority", expectedVersion: 2 }),
            ).rejects.toThrow();
            const url = new URL(`postgres://127.0.0.1:${pg.options.port}/birth_adoption`);
            url.username = String(pg.options.user);
            url.password = String(pg.options.password);
            const cli = async (...args: string[]) => {
                const child = Bun.spawn(
                    [
                        process.execPath,
                        "--no-env-file",
                        new URL("../scripts/world-birth.ts", import.meta.url).pathname,
                        ...args,
                    ],
                    {
                        env: { ...process.env, DATABASE_ROLE: "kingdom", DATABASE_URL: url.href },
                        stdin: "ignore",
                        stdout: "pipe",
                        stderr: "pipe",
                    },
                );
                const [stdout, stderr, code] = await Promise.all([
                    new Response(child.stdout).text(),
                    new Response(child.stderr).text(),
                    child.exited,
                ]);
                return { stdout, stderr, code };
            };
            const inspected = await cli("inspect", "1");
            expect(inspected.code).toBe(0);
            expect(JSON.parse(inspected.stdout)).toMatchObject({ available: true, version: 2 });
            const adopted = await cli(
                "adopt",
                "1",
                "synthetic-operator",
                "explicit source phase",
                "2",
                "43005",
                "1",
                "0",
                "cli-adoption",
            );
            expect(adopted.code).toBe(0);
            expect(JSON.parse(adopted.stdout)).toMatchObject({
                version: 3,
                priority: 43005,
                phase: 0,
            });
            const beforeWrongRealm = await db.db.select().from(realm_authority);
            expect((await cli("inspect", "2")).code).toBe(1);
            expect(await db.db.select().from(realm_authority)).toEqual(beforeWrongRealm);
        }
        finally
        {
            await db?.close();
            await pg.stop();
        }
    },
    120000,
);
