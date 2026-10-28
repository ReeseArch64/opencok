import { expect, test } from "bun:test";
import { createDatabase } from "@opencok/drizzle";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { and, eq } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { parse_info } from "@opencok/drizzle/schema/opencok_kingdom/parse_info";
import { acquireRealmAuthority, fenceRealmDatabase } from "@opencok/repositories/realm-authority";
import { PushPreferenceService } from "@opencok/player/services/push-preferences";
import { getConfigurationByPlayerId } from "@opencok/player/repositories/push-preferences-snapshot";
import { initializeWorldNewsPreference } from "@opencok/player/repositories/world-news-preference";
import { setPushPreference } from "@opencok/player/repositories/push-preferences";
import { createRealmGameService } from "../src/composition/game";
import type { GameStore } from "@opencok/contracts/game";
import { Rules } from "@opencok/rules/game";
import { fields, sfs, type Fields, type Value } from "@opencok/messages/sfs";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";

const rows = (body: Fields) => (body.pushSetting!.value as Value[]).map(fields);

test(
    "player push preferences preserve first-read shapes, realm isolation, persistence and epoch fencing",
    async () => {
        const pg = new DisposablePostgres();
        const databases: ReturnType<typeof createDatabase<"kingdom">>[] = [];
        const now = 1000;

        try
        {
            const admin = await pg.start();
            await admin.query("CREATE DATABASE \"push_one\"");
            await admin.query("CREATE DATABASE \"push_two\"");
            await admin.end();
            const open = (database: string) => {
                const connection = createDatabase("kingdom", {
                    ...pg.options,
                    database,
                    max: 5,
                    statement_timeout: 4000,
                    query_timeout: 4500,
                });
                databases.push(connection);

                return connection;
            };
            const first = open("push_one");
            const replacement = open("push_one");
            const other = open("push_two");

            for (const [database, realm] of [[first, 1], [other, 2]] as const)
            {
                await migrate(database.db, {
                    migrationsFolder:
                        new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
                            .pathname,
                });
                await database.db.insert(userprofile).values([
                    {
                        uid: "self",
                        name: "Synthetic",
                        serverId: realm,
                        country: "BR",
                        level: 1,
                        exp: 0,
                    },
                    {
                        uid: "other",
                        name: "Other",
                        serverId: realm,
                        country: "BR",
                        level: 1,
                        exp: 0,
                    },
                ]);
                await database.db.insert(parse_info).values({
                    uid: "other",
                    type: 3,
                    status: 99,
                    audio: 9,
                });
            }
            const owner = await acquireRealmAuthority(first.db, 1, () => true, now);
            fenceRealmDatabase(first.db, owner);
            const otherOwner = await acquireRealmAuthority(other.db, 2, () => true, now);
            fenceRealmDatabase(other.db, otherOwner);
            const compose = (database: typeof first, realm: number) => {
                const profile = async (uid: string) =>
                    (await database.db.select().from(userprofile).where(eq(userprofile.uid, uid))
                        .limit(1))[0];
                const preferences = new PushPreferenceService({
                    getProfileById: profile,
                    getConfigurationByPlayerId: (uid) =>
                        getConfigurationByPlayerId(database.db, uid),
                    initializeWorldNewsPreference: (uid, instant) =>
                        initializeWorldNewsPreference(database.db, uid, realm, instant),
                    setPushPreference: (uid, input, instant) =>
                        setPushPreference(database.db, uid, realm, input, instant),
                }, () => now);

                return createRealmGameService(
                    { getProfileById: profile } as unknown as GameStore,
                    new Rules(new Map(), new Map(), new Map()),
                    { kingdomId: realm },
                    () => now,
                    { playerPreferences: preferences },
                );
            };
            const game = compose(first, 1);
            const initial = await game.execute("self", "pushSetting.get", {
                uid: sfs.string("other"),
            });
            expect(rows(initial.body).find((row) => row.type!.value === 15)).toEqual({
                type: sfs.int(15),
                status: sfs.int(0),
            });
            const saved = await game.execute("self", "pushSetting.get", {});
            expect(rows(saved.body).find((row) => row.type!.value === 15)).toEqual({
                type: sfs.int(15),
                status: sfs.int(0),
                audio: sfs.int(1),
            });
            await game.execute("self", "parse.push.set", {
                uid: sfs.string("other"),
                type: sfs.int(3),
                status: sfs.int(-7),
            });
            expect((await getConfigurationByPlayerId(first.db, "self")).pushSettings).toEqual([
                { type: 3, status: -7, audio: 1 },
                { type: 15, status: 0, audio: 1 },
            ]);
            await expect(initializeWorldNewsPreference(first.db, "self", 1, now)).rejects.toThrow();
            await expect(
                setPushPreference(first.db, "self", 2, { type: 3, status: 2, audio: 0 }, now),
            ).rejects.toThrow();
            await expect(
                setPushPreference(first.db, "missing", 1, { type: 3, status: 2, audio: 0 }, now),
            ).rejects.toThrow();
            await replacement.db.update(userprofile).set({ banFlag: 1 }).where(
                eq(userprofile.uid, "self"),
            );
            await expect(
                setPushPreference(first.db, "self", 1, { type: 3, status: 2, audio: 0 }, now),
            ).rejects.toThrow();
            await replacement.db.update(userprofile).set({ banFlag: 0 }).where(
                eq(userprofile.uid, "self"),
            );
            expect((await getConfigurationByPlayerId(first.db, "self")).pushSettings[0]).toEqual({
                type: 3,
                status: -7,
                audio: 1,
            });
            await Promise.all(
                Array.from({ length: 8 }, (_, index) =>
                    setPushPreference(first.db, "self", 1, {
                        type: 3,
                        status: index,
                        audio: 100 + index,
                    }, now)),
            );
            const selected = await first.db.select().from(parse_info).where(
                and(eq(parse_info.uid, "self"), eq(parse_info.type, 3)),
            );
            expect(selected).toHaveLength(1);
            expect(selected[0]!.status).toBeGreaterThanOrEqual(0);
            expect(selected[0]!.status).toBeLessThan(8);
            expect(selected[0]!.audio).toBe(100 + selected[0]!.status);
            expect((await getConfigurationByPlayerId(first.db, "other")).pushSettings).toEqual([
                { type: 3, status: 99, audio: 9 },
            ]);
            expect((await getConfigurationByPlayerId(other.db, "self")).pushSettings).toEqual([]);
            await setPushPreference(other.db, "self", 2, { type: 3, status: 42, audio: -1 }, now);
            const successor = await acquireRealmAuthority(replacement.db, 1, () => true, now + 1);
            fenceRealmDatabase(replacement.db, successor);
            expect(successor.epoch).toBeGreaterThan(owner.epoch);
            await expect(
                setPushPreference(first.db, "self", 1, { type: 3, status: 999, audio: 0 }, now),
            ).rejects.toThrow();
            await setPushPreference(
                replacement.db,
                "self",
                1,
                { type: 3, status: 7, audio: 8 },
                now,
            );
            const expected =
                (await getConfigurationByPlayerId(replacement.db, "self")).pushSettings;
            expect(expected).toEqual([{ type: 3, status: 7, audio: 8 }, {
                type: 15,
                status: 0,
                audio: 1,
            }]);
            await Promise.all(databases.map((database) => database.pool.end()));
            databases.length = 0;
            await pg.restart();
            const restarted = open("push_one");
            const restartOwner = await acquireRealmAuthority(restarted.db, 1, () => true, now + 2);
            fenceRealmDatabase(restarted.db, restartOwner);
            expect(restartOwner.epoch).toBeGreaterThan(successor.epoch);
            expect((await getConfigurationByPlayerId(restarted.db, "self")).pushSettings).toEqual(
                expected,
            );
            const restored = await compose(restarted, 1).execute("self", "pushSetting.get", {});
            expect(rows(restored.body).find((row) => row.type!.value === 3)).toEqual({
                type: sfs.int(3),
                status: sfs.int(7),
                audio: sfs.int(8),
            });
            const restoredOther = open("push_two");
            expect((await getConfigurationByPlayerId(restoredOther.db, "self")).pushSettings)
                .toEqual([
                    { type: 3, status: 42, audio: -1 },
                ]);
        }
        finally
        {
            await Promise.all(databases.map((database) => database.pool.end()));
            await pg.stop();
        }
    },
    120000,
);
