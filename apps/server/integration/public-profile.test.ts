import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabases } from "@opencok/drizzle";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { loadRules } from "@opencok/resources/rules";
import { sfs } from "@opencok/messages/sfs";
import { checkPublicProfileStore } from "@opencok/player/repositories/public-profile";
import { createRealmPublicProfileService } from "../src/composition/public-profile.ts";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";

test(
    "owned public profiles route read-only snapshots across realms and survive restart without fallback",
    async () => {
        const pg = new DisposablePostgres();
        const topology = {
            globalDatabase: "profile_global",
            kingdoms: [{ id: 1, database: "profile_one" }, { id: 2, database: "profile_two" }],
        };
        let databases: ReturnType<typeof createDatabases> | undefined;
        try
        {
            const admin = await pg.start();
            try
            {
                for (
                    const name of [
                        topology.globalDatabase,
                        ...topology.kingdoms.map((realm) => realm.database),
                    ]
                )
                {
                    await admin.query(`CREATE DATABASE "${name}"`);
                }
            }
            finally
            {
                await admin.end();
            }
            databases = createDatabases(pg.options, topology);
            await migrate(databases.global.db, {
                migrationsFolder:
                    new URL("../../../packages/drizzle/migrations/global", import.meta.url)
                        .pathname,
            });
            for (const realm of databases.kingdoms.values())
            {
                await migrate(realm.db, {
                    migrationsFolder:
                        new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
                            .pathname,
                });
                await checkPublicProfileStore(realm.db);
            }
            for (
                const [realm, uid, name] of [[1, "1001", "Observer"], [1, "2001", "Local decoy"], [
                    1,
                    "2002",
                    "Local",
                ], [2, "2001", "Remote"]] as const
            )
            {
                const db = databases.getKingdom(realm).db;
                await db.insert(userprofile).values({
                    uid,
                    name,
                    serverId: realm,
                    level: 1,
                    exp: 12,
                    pf: "private-platform",
                    country: "BR",
                    gold: 9007199254740993n,
                });
                await db.insert(user_lord).values({ uid });
                await db.insert(user_general).values({
                    uuid: `general-${uid}`,
                    uid,
                    generalId: "240000",
                    level: 1,
                    status: 1,
                });
            }
            await databases.global.db.insert(account_new).values({
                gameUid: "2001",
                server: "2",
                uuid: "profile-device",
                gameUserLevel: 1,
                lastTime: 0n,
            });
            const rules = await loadRules();
            const markers: number[] = [];
            const compose = () =>
                createRealmPublicProfileService(
                    {
                        getProfileById: async (uid) =>
                            (await databases!.getKingdom(1).db.select().from(userprofile).where(
                                eq(userprofile.uid, uid),
                            ))[0],
                    },
                    databases!,
                    rules,
                    1,
                    async (realm) => {
                        markers.push(realm);
                        return new Map([["2001", "9007199254740995"]]);
                    },
                    () => 1792756800000,
                );
            const before = await Promise.all(
                [1, 2].map((realm) => databases!.getKingdom(realm).db.select().from(userprofile)),
            );
            const profile = compose();
            const remote = await profile.get("1001", {
                uid: sfs.string("2001"),
                serverId: sfs.int(1),
            });
            expect(remote.name).toEqual(sfs.string("Remote"));
            expect(remote.serverId).toEqual(sfs.int(2));
            expect(remote.lastUpdateTime).toEqual(sfs.string("9007199254740995"));
            expect(remote).not.toHaveProperty("pf");
            expect(remote).not.toHaveProperty("gold");
            expect(remote).not.toHaveProperty("banFlag");
            expect((await profile.get("1001", { uid: sfs.string("2002") })).name).toEqual(
                sfs.string("Local"),
            );
            expect(markers).toEqual([2, 1]);
            await expect(profile.get("1001", { uid: sfs.string("9999") })).rejects.toThrow();
            expect(
                await Promise.all(
                    [1, 2].map((realm) =>
                        databases!.getKingdom(realm).db.select().from(userprofile)
                    ),
                ),
            ).toEqual(before);
            await databases.global.db.update(account_new).set({ server: "9" }).where(
                eq(account_new.gameUid, "2001"),
            );
            await expect(profile.get("1001", { uid: sfs.string("2001") })).rejects.toThrow();
            expect(markers).toEqual([2, 1]);
            await databases.global.db.update(account_new).set({ server: "2" }).where(
                eq(account_new.gameUid, "2001"),
            );
            await databases.close();
            databases = undefined;
            await pg.restart();
            databases = createDatabases(pg.options, topology);
            expect(await compose().get("1001", { uid: sfs.string("2001") })).toEqual(remote);
            expect(await databases.getKingdom(1).db.select().from(userprofile)).toEqual(before[0]!);
        }
        finally
        {
            await databases?.close();
            await pg.stop();
        }
    },
    90000,
);
