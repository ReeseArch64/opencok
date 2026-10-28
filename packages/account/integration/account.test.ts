import { expect, test } from "bun:test";
import { createDatabase } from "@opencok/drizzle";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { usermapping } from "@opencok/drizzle/schema/opencok_global/usermapping";
import { userbindmapping } from "@opencok/drizzle/schema/opencok_global/userbindmapping";
import { provisionHash } from "@opencok/rules/provisioning";
import { DisposablePostgres } from "../../drizzle/tests/support/postgres";
import { AccountStore } from "../src/repositories/account";

test(
    "account discovery preserves mapping filters, legacy time collisions and durable activation",
    async () => {
        const pg = new DisposablePostgres();
        let database: ReturnType<typeof createDatabase<"global">> | undefined;
        let accounts: AccountStore | undefined;
        const open = () => {
            const url = new URL("postgresql://127.0.0.1/account_test");
            url.port = String(pg.options.port);
            url.username = String(pg.options.user);
            url.password = String(pg.options.password);
            return new AccountStore({ databaseUrl: url.href, timeoutMs: 5000 });
        };
        try
        {
            const admin = await pg.start();
            await admin.query("CREATE DATABASE \"account_test\"");
            await admin.end();
            database = createDatabase("global", {
                ...pg.options,
                database: "account_test",
                max: 4,
            });
            await migrate(database.db, {
                migrationsFolder:
                    new URL("../../drizzle/migrations/global", import.meta.url).pathname,
            });
            const time = 9007199254740993n;
            await database.db.insert(account_new).values([
                {
                    gameUid: "100",
                    server: "1",
                    uuid: "device",
                    gameUserLevel: 1,
                    active: 0,
                    lastTime: time,
                },
                {
                    gameUid: "200",
                    server: "2",
                    uuid: "device",
                    gameUserLevel: 2,
                    active: null,
                    lastTime: time,
                },
                {
                    gameUid: "300",
                    server: "1",
                    uuid: "device",
                    gameUserLevel: 3,
                    active: 0,
                    lastTime: time + 1n,
                },
                {
                    gameUid: "400",
                    server: "1",
                    uuid: "device",
                    gameUserLevel: 4,
                    active: 1,
                    lastTime: time + 2n,
                },
                {
                    gameUid: "500",
                    server: "1",
                    uuid: "other",
                    gameUserLevel: 5,
                    active: 0,
                    lastTime: time + 3n,
                },
            ]);
            await database.db.insert(usermapping).values([
                ...["100", "200", "300", "400"].map((gameUid) => ({
                    gameUid,
                    mappingType: "device",
                    mappingValue: "device",
                })),
                { gameUid: "500", mappingType: "device", mappingValue: "other" },
            ]);
            await database.db.insert(userbindmapping).values({
                gameUid: "100",
                mappingType: "device",
                mappingValue: "device",
            });
            accounts = open();
            await accounts.start();
            await accounts.health();
            const expected = [
                {
                    gameUid: "300",
                    server: "1",
                    uuid: "device",
                    gameUserLevel: "3",
                    active: "0",
                    lastTime: String(time + 1n),
                },
                {
                    gameUid: "200",
                    server: "2",
                    uuid: "device",
                    gameUserLevel: "2",
                    active: null,
                    lastTime: String(time),
                },
            ];
            expect(await accounts.getAll("device", "device", false)).toEqual(expected);
            expect(await accounts.getAll("device", "device", true)).toEqual([
                {
                    gameUid: "100",
                    server: "1",
                    uuid: "device",
                    gameUserLevel: "1",
                    active: "0",
                    lastTime: String(time),
                },
            ]);
            expect(await accounts.getAll("name", "device", false)).toEqual([]);
            expect(await accounts.getAll("device", "missing", false)).toEqual([]);
            const identity = { issuer: "synthetic", subject: "new-account" };
            const input = { kingdomId: 1, deviceUuid: "new-device", country: "BR", language: "pt" };
            const store = accounts.provisioning();
            const reserved = await store.reserve(identity, input);
            expect(reserved.ready).toBe(false);
            expect(await accounts.getAll("device", input.deviceUuid, false)).toEqual([]);
            const receipt = {
                gameUid: reserved.reservation.gameUid,
                kingdomId: 1,
                requestHash: provisionHash(reserved.reservation),
            };
            const activated = await store.activate(identity, reserved.reservation, receipt);
            expect(activated.state).toBe("ready");
            const created = await accounts.getAll("device", input.deviceUuid, false);
            expect(created).toHaveLength(1);
            expect(created[0]).toMatchObject({
                gameUid: receipt.gameUid,
                server: "1",
                gameUserLevel: "1",
                active: "0",
            });
            expect(await store.activate(identity, reserved.reservation, receipt)).toEqual(
                activated,
            );
            expect(await accounts.getAll("device", input.deviceUuid, false)).toEqual(created);
            await accounts.close();
            accounts = undefined;
            await database.close();
            database = undefined;
            await pg.restart();
            accounts = open();
            await accounts.start();
            expect(await accounts.getAll("device", "device", false)).toEqual(expected);
            expect(await accounts.getAll("device", input.deviceUuid, false)).toEqual(created);
            expect(await accounts.provisioning().reserve(identity, input)).toEqual({
                ...reserved,
                ready: true,
            });
        }
        finally
        {
            await Promise.allSettled([accounts?.close(), database?.close()]);
            await pg.stop();
        }
    },
    120000,
);
