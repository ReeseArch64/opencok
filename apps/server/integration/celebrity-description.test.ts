import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabases } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { celebrity } from "@opencok/drizzle/schema/opencok_kingdom/celebrity";
import { sfs } from "@opencok/messages/sfs";
import { createRealmCelebrityDescriptionService } from "../src/composition/celebrity-description.ts";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";

test(
    "owned celebrity descriptions isolate realms, recheck locked owners and preserve saved bytes across restart",
    async () => {
        const pg = new DisposablePostgres();
        const topology = {
            globalDatabase: "celebrity_global",
            kingdoms: [{ id: 1, database: "celebrity_one" }, { id: 2, database: "celebrity_two" }],
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
                        ...topology.kingdoms.map((r) => r.database),
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
            for (const realm of databases.kingdoms.values())
            {
                await migrate(realm.db, {
                    migrationsFolder:
                        new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
                            .pathname,
                });
            }
            for (const [realm, uid] of [[1, "1001"], [1, "2001"], [2, "2001"]] as const)
            {
                await databases.getKingdom(realm).db.insert(userprofile).values({
                    uid,
                    name: uid,
                    level: 1,
                    exp: 0,
                    serverId: realm,
                    country: "BR",
                    gmFlag: 11,
                });
            }
            await databases.getKingdom(1).db.insert(celebrity).values({
                uid: "2001",
                description: Buffer.from("local decoy"),
            });
            await databases.getKingdom(2).db.insert(celebrity).values({
                uid: "2001",
                description: Buffer.from("remote public"),
            });
            const filterInputs: string[] = [];
            let filterFailure = false;
            const compose = () =>
                createRealmCelebrityDescriptionService(
                    {
                        getProfileById: async (uid) =>
                            (await databases!.getKingdom(1).db.select().from(userprofile).where(
                                eq(userprofile.uid, uid),
                            ))[0],
                    },
                    databases!,
                    1,
                    {
                        filterBadWords: (value) => {
                            filterInputs.push(value);
                            if (filterFailure)
                            {
                                throw new Error("Synthetic filter failure");
                            }
                            return value.replace("blocked", "**");
                        },
                    },
                );
            const service = compose();
            expect(
                await service.read("1001", { uid: sfs.string("2001"), serverId: sfs.int(2) }, 1000),
            ).toEqual({ description: sfs.string("remote public") });
            expect(
                await service.read("1001", { uid: sfs.string("2001"), serverId: sfs.int(9) }, 1000),
            ).toEqual({ description: sfs.string("") });
            expect(
                await service.save("1001", {
                    uid: sfs.string("2001"),
                    description: sfs.string("blocked public"),
                }, 1000),
            ).toEqual({});
            expect(filterInputs).toEqual(["blocked public"]);
            const saved = await databases.getKingdom(1).db.select().from(celebrity).where(
                eq(celebrity.uid, "1001"),
            );
            expect(saved).toHaveLength(1);
            expect(
                await service.read("1001", { uid: sfs.string("1001"), serverId: sfs.int(1) }, 1000),
            ).toEqual({ description: sfs.string("** public") });
            filterFailure = true;
            await expect(service.save("1001", { description: sfs.string("replacement") }, 1000))
                .rejects.toThrow("Synthetic filter failure");
            expect(
                await databases.getKingdom(1).db.select().from(celebrity).where(
                    eq(celebrity.uid, "1001"),
                ),
            ).toEqual(saved);
            filterFailure = false;
            const cachedOwner = (await databases.getKingdom(1).db.select().from(userprofile).where(
                eq(userprofile.uid, "1001"),
            ))[0]!;
            await databases.getKingdom(1).db.update(userprofile).set({ gmFlag: 0 }).where(
                eq(userprofile.uid, "1001"),
            );
            const stale = createRealmCelebrityDescriptionService(
                { getProfileById: async () => cachedOwner },
                databases,
                1,
                {
                    filterBadWords: () => {
                        throw new Error("Must recheck locked owner before filtering");
                    },
                },
            );
            expect(await stale.save("1001", { description: sfs.string("stale write") }, 1000))
                .toEqual({});
            expect(
                await databases.getKingdom(1).db.select().from(celebrity).where(
                    eq(celebrity.uid, "1001"),
                ),
            ).toEqual(saved);
            await databases.getKingdom(1).db.update(userprofile).set({ gmFlag: 11 }).where(
                eq(userprofile.uid, "1001"),
            );
            expect(
                (await databases.getKingdom(1).db.select().from(celebrity).where(
                    eq(celebrity.uid, "2001"),
                ))[0]!.description,
            ).toEqual(Buffer.from("local decoy"));
            expect(
                (await databases.getKingdom(2).db.select().from(celebrity).where(
                    eq(celebrity.uid, "2001"),
                ))[0]!.description,
            ).toEqual(Buffer.from("remote public"));
            await databases.close();
            databases = undefined;
            await pg.restart();
            databases = createDatabases(pg.options, topology);
            expect(
                await databases.getKingdom(1).db.select().from(celebrity).where(
                    eq(celebrity.uid, "1001"),
                ),
            ).toEqual(saved);
            expect(
                await compose().read(
                    "1001",
                    { uid: sfs.string("1001"), serverId: sfs.int(1) },
                    1000,
                ),
            ).toEqual({ description: sfs.string("** public") });
        }
        finally
        {
            await databases?.close();
            await pg.stop();
        }
    },
    90000,
);
