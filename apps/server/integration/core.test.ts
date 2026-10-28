import { configureEggActivity } from "../test/fixtures/egg-activity";
import { configureGoldEggs } from "../test/fixtures/gold-eggs";
import type { DeliveredGiftProof } from "@opencok/contracts/paid-gifts";
import { paylog } from "@opencok/drizzle/schema/opencok_kingdom/paylog";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { avatar_storage } from "@opencok/drizzle/schema/opencok_kingdom/avatar_storage";
import { catalog as campaignRulesCatalog } from "../../../packages/resources/src/catalogs/data/trigger-activity";
import { flower_info } from "@opencok/drizzle/schema/opencok_kingdom/flower_info";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { catalog as campaignVariablesCatalog } from "../../../packages/resources/src/catalogs/data/trigger-var";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { eq } from "drizzle-orm";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import type { AddressInfo } from "node:net";
import { randomUUID } from "node:crypto";
import { createChatApp } from "../../chat/src/app.ts";
import { createChatRepository } from "@opencok/repositories/chat";
import { expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabases } from "@opencok/drizzle";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";
import { startServer } from "../src/server.ts";
import { Cache } from "@opencok/storage/session";
import { Coordination } from "@opencok/storage/coordination";
import { Database } from "@opencok/repositories/game";
import type { Config } from "../src/config.ts";
import { fields, sfs, str, Type, type Value, type Fields } from "@opencok/messages/sfs";
import { FOREVER } from "@opencok/mappings/city";
import { Client } from "./client.ts";
import { dataConfigItems } from "../test/fixtures/data-config.ts";
import { loadRules } from "@opencok/resources/rules";

async function eventually(check: () => Promise<boolean>, timeout = 15000)
{
    const end = Date.now() + timeout;
    while (Date.now() < end)
    {
        if (await check().catch(() => false))
        {
            return;
        }
        await Bun.sleep(100);
    }
    throw new Error("Synthetic dependency readiness timed out");
}

test("PostgreSQL SFS login, city and map preserve state and isolate both realms", async () => {
    const pg = new DisposablePostgres();
    const resources = await mkdtemp(join(tmpdir(), "opencok-server-test-"));
    const suffix = randomBytes(6).toString("hex");
    const redis = `opencok-server-redis-${suffix}`,
        zk = `opencok-server-zk-${suffix}`;
    const containers: string[] = [];
    const servers: Awaited<ReturnType<typeof startServer>>[] = [];
    const clients: Client[] = [];
    const shopReplays = new Map<number, { request: Fields; reply: Fields; }>();
    const tradeReplays = new Map<number, { request: Fields; reply: Fields; }>();
    let chat: ReturnType<typeof createChatApp> | undefined;
    let chatRepository: ReturnType<typeof createChatRepository> | undefined;
    const adapters: Database[] = [];
    let databases: ReturnType<typeof createDatabases> | undefined;
    const topology = {
        globalDatabase: "synthetic_global",
        kingdoms: [
            { id: 1, database: "synthetic_kingdom_1" },
            { id: 2, database: "synthetic_kingdom_2" },
        ],
    };
    const endpoint = async (name: string, port: number) =>
        Number(
            Buffer.from(await pg.docker(["port", name, `${port}/tcp`]))
                .toString()
                .trim()
                .split(":")
                .at(-1),
        );
    try
    {
        const admin = await pg.start();
        try
        {
            for (
                const name of [
                    topology.globalDatabase,
                    ...topology.kingdoms.map((k) => k.database),
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
        for (const kingdom of databases.kingdoms.values())
        {
            await migrate(kingdom.db, {
                migrationsFolder:
                    new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
                        .pathname,
            });
        }
        for (const id of [1, 2])
        {
            const db = databases.getKingdom(id).db;
            const uid = `synthetic-player-${id}`;
            await databases.global.db.insert(account_new).values({
                gameUid: uid,
                server: String(id),
                uuid: "synthetic-device",
                gameUserLevel: 1,
                lastTime: 0n,
            });
            await db.insert(userprofile).values({
                uid,
                name: `Synthetic ${id}`,
                serverId: id,
                level: 1,
                exp: 0,
                country: "BR",
                deviceUuid: "synthetic-device",
                pf: "Google",
                gold: 9007199254740993n,
            });
            await db.insert(flower_info).values({ uid, lastflowerRanking: 1 });
            await db.insert(avatar_storage).values({
                uid,
                avatarId: "509878",
                expirationTime: -1n,
            });
            await db.insert(mail).values({
                uid: "synthetic-mail-reward",
                toUser: uid,
                type: 2,
                rewardId: "wood,0,5",
                contents: Buffer.from("synthetic"),
                createTime: 1000n,
            });
            await db.insert(user_mixed_info).values({ uid, mdata: "{}" });
            await db.insert(new_general).values({
                uid,
                id: 53500,
                level: 3,
                exp: 123,
                quality: 1,
                state: 1,
                star: 2,
                talentpoint: 4,
                talent: "53900;1",
            });
            await db.insert(user_resource).values({
                uid,
                wood: BigInt(10000 * id),
                stone: 0n,
                iron: 0n,
                food: 0n,
                silver: 0,
                chip: 0,
                diamond: 0,
                dragon_food: 0,
                dragon_gold: 0,
                lastUpdateTime: 0n,
            });
            await db
                .insert(user_building)
                .values({ uuid: "synthetic-building", uid, itemId: 400000, pos: 0, level: 1 });
            await db.insert(queue).values({
                uuid: "synthetic-queue",
                ownerId: uid,
                qid: 1,
                type: 0,
                startTime: FOREVER,
                endTime: FOREVER,
                updateTime: FOREVER,
            });
            await db.insert(user_world).values({
                uid,
                pointId: 12011,
                worldId: 0,
                lastCityDefTime: 0n,
            });
            await db.insert(worldpoint).values({
                id: 12011,
                worldId: 0,
                x: 10,
                y: 10,
                areaId: 0,
                gridType: 0,
                grid2Type: 0,
                pointType: 1,
                resLevel: 1,
                resInitValue: 0,
                ownerName: `Synthetic ${id}`,
            });
            await db.insert(user_army).values({ uid, armyId: "100001", level: 2, free: 17 });
            await db
                .insert(user_item)
                .values({ uuid: "synthetic-item", ownerId: uid, itemId: "200001", count: 7 });
            await db.insert(user_lord).values({ uid, medal: "synthetic-medal" });
        }
        const configRecords = [
            ...dataConfigItems({
                player_max: { k3: "30" },
                function_on6: { k12: "0" },
                resources_basics: { k7: "100", k8: "300" },
            }).values(),
        ]
            .map(
                (record) =>
                    `<ItemSpec ${
                        Object.entries(record)
                            .map(([key, value]) => `${key}="${value}"`)
                            .join(" ")
                    }/>`,
            )
            .join("");
        const xml: Record<string, string> = {
            treasure: "<ItemSpec id=\"1\" lv=\"1\" exp=\"100\" helper=\"1\"/>",
            quest: "",
            building:
                "<ItemSpec id=\"400001\" level=\"1\" time=\"30\"/><ItemSpec id=\"400002\" level=\"2\" time=\"40\"/>",
            role:
                "<ItemSpec id=\"100101\" player_exp=\"100000\"/><ItemSpec id=\"100102\" player_exp=\"200000\"/>",
            position:
                "<ItemSpec id=\"9900\" position=\"0\"/><ItemSpec id=\"9906\" position=\"6\"/>",
            item: `<Group id="data_config">${configRecords}</Group>`,
            function_on:
                "<ItemSpec id=\"avatar\" online=\"all\" test=\"all\" version=\"7.23.0\" pf=\"all\"/><ItemSpec id=\"general\" online=\"all\" test=\"all\" version=\"7.23.0\" pf=\"all\"/>",
            status:
                "<ItemSpec id=\"509878\" type2=\"100\" time=\"3600\" overlap=\"2\" group=\"500500\" subgroup=\"265\"/>",
            arms:
                "<ItemSpec id=\"100001\" attack=\"12\" attack_add=\"3\" defence=\"10\" defence_add=\"2\" upkeep=\"24\" power=\"0.5\"/><ItemSpec id=\"100002\"/>",
            goods:
                "<ItemSpec id=\"200001\" type=\"21\" useall=\"1\" para1=\"50\"/><ItemSpec id=\"200002\" para1=\"60\"/><ItemSpec id=\"200021\" type=\"17\" price=\"100\"/>",
        };
        for (const [name, records] of Object.entries(xml))
        {
            await Bun.write(join(resources, `${name}.xml`), `<database>${records}</database>`);
        }
        for (
            const [name, image, port] of [
                [redis, "redis:6.2.24-bookworm", 6379],
                [zk, "zookeeper:3.4.14", 2181],
            ] as const
        )
        {
            await pg.docker([
                "run",
                "--detach",
                "--rm",
                "--name",
                name,
                "--publish",
                `127.0.0.1::${port}`,
                image,
            ]);
            containers.push(name);
        }
        const url = new URL(`postgres://127.0.0.1:${pg.options.port}/postgres`);
        url.username = String(pg.options.user);
        url.password = String(pg.options.password);
        chatRepository = createChatRepository({ databaseUrl: url.toString(), topology });
        chat = createChatApp({
            repository: chatRepository,
            signingSecret: "synthetic-profile-secret",
            websocketUrl: "ws://127.0.0.1/chat/ws",
        });
        expect(await chat.runMaintenance()).toBe(true);
        await new Promise<void>((resolve) => chat!.server.listen(0, "127.0.0.1", resolve));
        const chatPort = (chat.server.address() as AddressInfo).port;
        const deliveredOrders = new Map<string, DeliveredGiftProof>();
        const base: Config = {
            paidGiftGateway: {
                delivered: async ({ owner, orderId }) => {
                    const proof = deliveredOrders.get(orderId);
                    return proof?.owner === owner ? proof : null;
                },
            },
            nicknameChat: {
                url: `http://127.0.0.1:${chatPort}/_internal/nickname`,
                signingSecret: "synthetic-profile-secret",
            },
            host: "127.0.0.1",
            port: 0,
            healthPort: 0,
            kingdomId: 1,
            kingdomDatabase: topology.kingdoms[0]!.database,
            playerKingdoms: topology.kingdoms,
            globalDatabase: topology.globalDatabase,
            databaseUrl: url.toString(),
            redisUrl: `redis://127.0.0.1:${await endpoint(redis, 6379)}/0`,
            zookeeper: `127.0.0.1:${await endpoint(zk, 2181)}`,
            zkPath: "/opencok-experiment/COK1",
            loginSecret: "synthetic-secret",
            mapSize: 1200,
            timeoutMs: 2000,
        };
        const cache = new Cache(base);
        await eventually(async () => (await cache.command("PING")) === "PONG");
        await cache.command(
            "HSET",
            "opencok:kingdom:3:world-effects",
            "487",
            "{\"value\":\"0.1\"}",
        );
        expect(await cache.worldEffects(3)).toEqual(new Map([["487", "{\"value\":\"0.1\"}"]]));
        await eventually(async () => {
            const coordination = new Coordination({
                ...base,
                zkPath: `/opencok-experiment/probe_${suffix}`,
            });
            try
            {
                await coordination.start();
                return coordination.ready;
            }
            finally
            {
                coordination.close();
            }
        });
        const exchangeCatalog = await loadRules();
        for (const id of [1, 2])
        {
            const settings = {
                ...base,
                kingdomId: id,
                kingdomDatabase: topology.kingdoms[id - 1]!.database,
                zkPath: `/opencok-experiment/COK${id}`,
            };
            const runtimeRules = await loadRules(resources, id);
            (runtimeRules.power.newGeneralBases ??= new Map()).set("53500", { id: "53500" });
            (runtimeRules.power.newGeneralSkills ??= new Map()).set("53900", {
                id: "53900",
                type: "0",
            });
            runtimeRules.advanced.campaignRules = campaignRulesCatalog.rules;
            for (const [itemId, rule] of exchangeCatalog.goods)
            {
                if (!runtimeRules.goods.has(itemId))
                {
                    runtimeRules.goods.set(itemId, rule);
                }
            }
            runtimeRules.reconnect.rewards = exchangeCatalog.reconnect.rewards;
            const tokenPanel = { ...exchangeCatalog.power.activityPanels!.get("57209")! };
            delete tokenPanel.start;
            delete tokenPanel.end;
            (runtimeRules.power.activityPanels ??= new Map()).set("57209", tokenPanel);
            runtimeRules.advanced.campaignVariables = new Map(
                campaignVariablesCatalog.variables.map((variable) => [
                    `${variable.scope}$${variable.id}`,
                    variable,
                ]),
            );
            runtimeRules.shops.set("wire-shop", {
                id: "wire-shop",
                onsale: "1",
                item_id: "200001",
                sale_type: "10",
                value1_type: "1",
                value1: "1",
                buy_times: "1",
            });
            runtimeRules.trades.set("wire-trade", {
                id: "wire-trade",
                pool_num: "1",
                castle_level: "0",
                recycle_item: "200001",
                range: "1",
                rate: "1",
                num: "1",
                exchange_item: "200001",
                exchange_num: "1",
                exchange_rate: "1",
            });
            const server = await startServer(settings, runtimeRules);
            servers.push(server);
            const adapter = new Database(settings);
            adapters.push(adapter);
            const before = await adapter.getCityByPlayerId(`synthetic-player-${id}`, Date.now());
            const client = new Client(server.port, id);
            clients.push(client);
            expect((await client.handshake()).tk?.type).toBe(Type.String);
            expect((await client.login("wrong", `synthetic-player-${id}`)).ec?.value).toBe(3);
            expect(
                (await client.login(base.loginSecret, `synthetic-player-${id}`, "wrong-device")).ec
                    ?.value,
            ).toBe(3);
            expect((await client.login(base.loginSecret, `synthetic-player-${3 - id}`)).ec?.value)
                .toBe(
                    3,
                );
            expect((await client.login(base.loginSecret, `synthetic-player-${id}`)).zn?.value).toBe(
                `COK${id}`,
            );
            const init = fields((await client.next()).p);
            expect(str(init, "c")).toBe("init");
            const data = fields(init.p);
            expect(fields(data.user).gold?.value).toBe(9007199254740993n);
            expect(fields(data.user).serverId?.value).toBe(id);
            expect(fields(data.resource).wood?.value).toBe(BigInt(10000 * id));
            const loginPower = fields(data.playerInfo);
            expect(loginPower.playerPower?.type).toBe(Type.Int);
            expect(loginPower.armyPower?.type).toBe(Type.Long);
            expect(loginPower.battleWin?.type).toBe(Type.Int);
            const heroes = data.generallist!.value as Value[];
            const hero = heroes.map(fields).find((entry) => entry.id?.value === 53500)!;
            expect(hero.level).toEqual(sfs.int(3));
            expect(hero.exp).toEqual(sfs.int(123));
            expect(hero.talent).toEqual(
                sfs.array([sfs.object({ id: sfs.int(53900), level: sfs.int(1) })]),
            );
            expect(
                (await client.command("cmd.finishinit", { _cok_: sfs.string("synthetic-init") }))
                    ._cok_
                    ?.value,
            ).toBe("synthetic-init");
            expect((await client.command("cmd.ping")).serverNowTime?.type).toBe(Type.Long);
            const power = await client.command("get.power.info");
            expect(loginPower.playerPower).toEqual(power.playerPower);
            expect(loginPower.armyPower).toEqual(power.armyPower);
            await eventually(async () =>
                client.received.some((packet) =>
                    str(fields(packet.p), "c", "") === "push.common.notice"
                )
            );
            expect((await client.command("item.askFor", { itemId: sfs.int(212023) })).success)
                .toEqual(
                    sfs.string("1"),
                );
            expect(
                await client.command("avatar.activate", { avatarId: sfs.string("509878") }),
            ).toMatchObject({ statusId: sfs.int(509878) });
            const tokenProjection = await client.command("act.exchange", {
                ids: sfs.string("57209"),
            });
            const tokenActivity = fields(
                fields((tokenProjection.exchange!.value as Value[])[0]).activity,
            );
            expect(tokenActivity.level).toEqual(sfs.int(0));
            expect(tokenActivity.rewards!.value as Value[]).toHaveLength(5);
            const campaignLoginNotice = fields(
                fields(
                    client.received.find((packet) =>
                        str(fields(packet.p), "c", "") === "push.common.notice"
                    )!
                        .p,
                ).p,
            );
            expect(campaignLoginNotice.msgId).toEqual(sfs.string("9440790"));
            expect(campaignLoginNotice.para).toEqual(
                sfs.array([sfs.string(""), sfs.string(`Synthetic ${id}`)]),
            );
            expect((await client.command("get.trouble.list")).array).toEqual(sfs.array([]));
            expect((await client.command("act.exchange", { ids: sfs.string("57006") })).exchange)
                .toEqual(
                    sfs.array([]),
                );
            const costInfo = await client.command("continuedcost.info", {
                _cok_: sfs.long(9007199254740993n),
            });
            expect(costInfo._cok_).toEqual(sfs.long(9007199254740993n));
            expect(costInfo.costPoint).toBeUndefined();
            const previousVariables = runtimeRules.advanced.campaignVariables;
            try
            {
                runtimeRules.advanced.campaignVariables = new Map(
                    campaignVariablesCatalog.variables.map((variable) => [
                        `${variable.scope}$${variable.id}`,
                        variable,
                    ]),
                );
                const genericVariables = await client.command("get.activity.value", {
                    keys: sfs.string("I$long_sss;$kingwar_testitem_sent_2"),
                    _cok_: sfs.int(455),
                });
                expect(genericVariables._cok_).toEqual(sfs.int(455));
                expect(genericVariables.values).toEqual(
                    sfs.string("I$long_sss=100;$kingwar_testitem_sent_2=0"),
                );
            }
            finally
            {
                runtimeRules.advanced.campaignVariables = previousVariables;
            }
            expect((await client.command("continuedcost.apply", {})).errorCode?.value).toBe(
                "102192",
            );
            expect((await client.command("hero.target.deliver", {})).errorCode?.value).toBe(
                "102192",
            );
            expect((await client.command("hero.rank.deliver", {})).errorCode?.value).toBe("102192");
            expect((await client.command("expedition.notify", {})).errorCode?.value).toBe("102192");
            expect((await client.command("expedition.award.deliver", {})).errorCode?.value).toBe(
                "102192",
            );
            expect((await client.command("continuedcost.rank.deliver", {})).errorCode?.value).toBe(
                "102192",
            );
            const expeditionFeature = runtimeRules.features.get("17_wk"),
                expeditionSwitch = runtimeRules.features.get("wk_switch_new");
            try
            {
                runtimeRules.features.set("17_wk", {
                    version: "12.06.0",
                    online: "all",
                    test: "all",
                });
                runtimeRules.features.set("wk_switch_new", {
                    version: "12.06.0",
                    online: "close",
                    test: "close",
                });
                const history = await client.command("newexpidition.rankinfo", {
                    _cok_: sfs.long(9007199254740993n),
                });
                expect(history._cok_).toEqual(sfs.long(9007199254740993n));
                expect(history.ranklist).toEqual(sfs.array([]));
            }
            finally
            {
                if (expeditionFeature)
                {
                    runtimeRules.features.set("17_wk", expeditionFeature);
                }
                else
                {
                    runtimeRules.features.delete("17_wk");
                }
                if (expeditionSwitch)
                {
                    runtimeRules.features.set("wk_switch_new", expeditionSwitch);
                }
                else
                {
                    runtimeRules.features.delete("wk_switch_new");
                }
            }

            for (
                const [command, params] of [
                    ["hero.event.info.get", { activityId: sfs.string("9000000") }],
                    ["hero.event.ranking.get", { actId: sfs.string("missing") }],
                    ["hero.cross.info", {}],
                ] as const
            )
            {
                const heroInfo = await client.command(command, {
                    ...params,
                    _cok_: sfs.long(9007199254740993n),
                });
                expect(heroInfo._cok_).toEqual(sfs.long(9007199254740993n));
                expect(heroInfo.eventList).toBeUndefined();
            }
            for (const command of ["Olympic.question.info", "Olympic.bet.info"])
            {
                const olympicInfo = await client.command(command, {
                    _cok_: sfs.long(9007199254740993n),
                });
                expect(olympicInfo._cok_).toEqual(sfs.long(9007199254740993n));
            }
            for (const command of ["Olympic.result", "Olympic.settle"])
            {
                expect((await client.command(command, {})).errorCode?.value).toBe("102192");
            }
            const comebackInfo = await client.command("comeback.info", {
                _cok_: sfs.string("comeback"),
            });
            expect(comebackInfo.count).toEqual(sfs.int(0));
            expect(comebackInfo._cok_).toEqual(sfs.string("comeback"));
            expect(
                (await client.command("comeback.reward", {
                    type: sfs.string("1"),
                    param: sfs.string(""),
                }))
                    .errorCode?.value,
            ).toBe("E000000");
            const cupInfo = await client.command("euro.cup.info", {
                _cok_: sfs.long(9007199254740993n),
            });
            expect(cupInfo._cok_).toEqual(sfs.long(9007199254740993n));
            expect(cupInfo.matchList).toBeUndefined();
            expect((await client.command("euro.cup.settle", {})).errorCode?.value).toBe("102192");
            const groupInfo = await client.command("groupbuys.info", {
                _cok_: sfs.long(9007199254740993n),
            });
            expect(groupInfo._cok_).toEqual(sfs.long(9007199254740993n));
            expect(groupInfo.totalBuy).toBeUndefined();
            for (
                const command of [
                    "groupbuys.paid",
                    "groupbuys.reserve",
                    "groupbuys.cancel",
                    "groupbuys.close",
                    "groupbuys.settle",
                ]
            )
            {
                expect((await client.command(command, {})).errorCode?.value).toBe("102192");
            }
            const specialInfo = await client.command("special.ui.state", {
                _cok_: sfs.long(9007199254740993n),
            });
            expect(specialInfo._cok_).toEqual(sfs.long(9007199254740993n));
            expect(specialInfo.SpecialEvent_num).toBeUndefined();
            expect((await client.command("special.paid", {})).errorCode?.value).toBe("102192");
            expect((await client.command("trouble.deliver", {})).errorCode?.value).toBe("102192");
            expect(
                fields(fields((await client.command("login.dataconfig")).dataConfig).player_max).k3
                    ?.value,
            ).toBe("30");
            const army = await client.command("login.other", { army: sfs.int(1) });
            expect(army.army?.type).toBe(Type.Array);
            expect(fields((army.army!.value as ReturnType<typeof sfs.object>[])[0]).free?.value)
                .toBe(17);
            expect(fields((army.items!.value as ReturnType<typeof sfs.object>[])[0]).count?.value)
                .toBe(
                    7,
                );
            expect(fields((await client.command("login.other")).lord).medal?.value).toBe(
                "synthetic-medal",
            );
            expect((await client.command("build.info")).building?.type).toBe(Type.Array);
            expect((await client.command("mall.info")).shoppingMall?.type).toBe(Type.Array);
            for (
                const [command, params] of [
                    ["mall.info.type", { type: sfs.string("10") }],
                    ["mall.data", { mallId: sfs.string("10") }],
                ] as const
            )
            {
                const offers = (await client.command(command, params)).shoppingMall!
                    .value as Value[];
                expect(offers.some((offer) => fields(offer).id?.value === "wire-shop")).toBe(true);
            }
            const shopPurchase = {
                id: sfs.string("wire-shop"),
                num: sfs.int(1),
                _cok_: sfs.string("shop-wire"),
                operationId: sfs.string(randomUUID()),
            };
            const bought = await client.command("shoppingMall.buy", shopPurchase);
            shopReplays.set(id, { request: shopPurchase, reply: bought });
            expect(fields(bought.goods).count).toEqual(sfs.int(8));
            expect(fields((await client.command("shoppingMall.buy", shopPurchase)).goods).count)
                .toEqual(
                    sfs.int(8),
                );
            expect(
                (
                    await client.command("shoppingMall.buy", {
                        ...shopPurchase,
                        _cok_: sfs.string("shop-other"),
                        operationId: sfs.string(randomUUID()),
                    })
                ).errorCode,
            ).toBeDefined();
            expect(
                (await client.command("trade.info", { _cok_: sfs.string("trade-offer") })).trade,
            ).toEqual(sfs.string("200001;1|200001;1"));
            const tradeRequest = {
                _cok_: sfs.string("trade-swap"),
                operationId: sfs.string(randomUUID()),
            };
            const traded = await client.command("trade.exchange", tradeRequest);
            tradeReplays.set(id, { request: tradeRequest, reply: traded });
            expect(fields(traded.addItem).count).toEqual(sfs.int(8));
            expect(fields(traded.tradeCaravan).times).toEqual(sfs.int(1));
            expect((await client.command("trade.exchange", tradeRequest)).operationId).toEqual(
                traded.operationId,
            );
            const claimedMail = await client.command("mail.reward", {
                uid: sfs.string("synthetic-mail-reward"),
                _cok_: sfs.string("mail-claim"),
            });
            expect(claimedMail.wood).toEqual(sfs.long(id * 10000 + 5));
            const replayedMail = await client.command("mail.reward", {
                uid: sfs.string("synthetic-mail-reward"),
                _cok_: sfs.string("different-mail-claim"),
            });
            expect(replayedMail.wood).toEqual(sfs.long(id * 10000 + 5));
            expect(
                (
                    await client.command("mail.reward.batch", {
                        uids: sfs.string("synthetic-mail-reward,synthetic-mail-reward"),
                    })
                ).successUids,
            ).toEqual(sfs.string(""));
            expect(
                (await client.command("mail.reward", { uid: sfs.string("foreign-mail") }))
                    .errorCode,
            ).toBeDefined();

            const usedItem = await client.command("item.use", {
                uuid: sfs.string("synthetic-item"),
                num: sfs.int(2),
                _cok_: sfs.string("inventory-use"),
            });
            expect(usedItem.count).toEqual(sfs.int(6));
            expect(usedItem._cok_).toEqual(sfs.string("inventory-use"));
            expect(
                (
                    await client.command("item.use", {
                        uuid: sfs.string("synthetic-item"),
                        num: sfs.int(2),
                        _cok_: sfs.string("inventory-use"),
                    })
                ).operationId,
            ).toEqual(usedItem.operationId);
            expect(
                (
                    await client.command("item.use", {
                        uuid: sfs.string("synthetic-item"),
                        num: sfs.int(3),
                        _cok_: sfs.string("inventory-use"),
                    })
                ).errorCode,
            ).toBeDefined();
            expect(
                (
                    await client.command("inventory.grant", {
                        itemId: sfs.string("200001"),
                        num: sfs.int(100),
                    })
                ).errorCode,
            ).toBeDefined();
            expect(
                (
                    await databases.kingdoms
                        .get(id)!
                        .db.select()
                        .from(user_item)
                        .where(eq(user_item.uuid, "synthetic-item"))
                )[0]?.count,
            ).toBe(6);

            for (const command of ["build.create", "build.upgrade"])
            {
                expect((await client.command(command)).errorCode?.value).toBe("E000000");
            }
            expect((await client.command("combat.attack")).errorCode?.value).toBe("102192");
            const map = await client.command("world.get", {
                x: sfs.int(10),
                y: sfs.int(10),
                type: sfs.int(0),
                timeStamp: sfs.int(42),
            });
            expect(map.serverId?.value).toBe(id);
            expect(map.timeStamp?.value).toBe(42);
            const points = (map.points!.value as ReturnType<typeof sfs.string>[]).flatMap((part) =>
                JSON.parse(String(part.value))
            );
            expect(points.map((p: { o?: string; }) => p.o)).toContain(`Synthetic ${id}`);
            const after = await adapter.getCityByPlayerId(`synthetic-player-${id}`, Date.now());
            const checkpoint = after.resource?.lastUpdateTime;
            if (typeof checkpoint !== "bigint")
            {
                throw new Error("Missing reconnect checkpoint");
            }
            expect(checkpoint).toBeGreaterThan(
                BigInt(String(before.resource?.lastUpdateTime ?? 0)),
            );
            const dailyFlush = BigInt(String(after.lord?.dailyTaskFlushTime ?? 0)),
                allianceFlush = BigInt(String(after.lord?.newDailyTaskFlushTime ?? 0));
            expect(dailyFlush).toBeGreaterThan(
                BigInt(String(before.lord?.dailyTaskFlushTime ?? 0)),
            );
            expect(dailyFlush / 86400000n).toBe(checkpoint / 86400000n);
            expect(allianceFlush + 300000n).toBe(dailyFlush);
            const onlineAt = BigInt(String(after.profile?.lastOnlineTime ?? 0));
            expect(onlineAt).toBeGreaterThan(BigInt(String(before.profile?.lastOnlineTime ?? 0)));
            expect(onlineAt).toBeLessThanOrEqual(checkpoint);
            expect(after.queues).toHaveLength(before.queues.length + 1);
            expect(after).toEqual({
                ...before,
                profile: { ...before.profile, gold: 9007199254740992n, lastOnlineTime: onlineAt },
                lord: {
                    ...before.lord,
                    dailyTaskFlushTime: dailyFlush,
                    newDailyTaskFlushTime: allianceFlush,
                },
                queues: expect.arrayContaining([
                    ...before.queues,
                    {
                        uuid: expect.stringMatching(/^[0-9a-f-]{36}$/),
                        ownerId: `synthetic-player-${id}`,
                        qid: 1,
                        type: 12,
                        itemId: "",
                        startTime: FOREVER,
                        endTime: FOREVER,
                        updateTime: FOREVER,
                        totalTime: 0n,
                        isHelped: 0,
                        para: 0,
                        exchgType: 0,
                    },
                ]),
                items: before.items.map((item) =>
                    item.uuid === "synthetic-item" ? { ...item, count: 6 } : item
                ),
                resource: {
                    ...before.resource,
                    wood: BigInt(id * 10000 + 5),
                    lastUpdateTime: checkpoint,
                },
            });
            expect((await fetch(`http://127.0.0.1:${server.healthPort}/readyz`)).status).toBe(200);
            const operationId = randomUUID();
            const previousCostFeature = runtimeRules.features.get("continued_cost"),
                previousRankFeature = runtimeRules.features.get("new_rank_cost"),
                previousCostItem = runtimeRules.items.get("continued_cost"),
                previousCostPanels = runtimeRules.power.activityPanels,
                previousCostTiers = runtimeRules.advanced.continuedCosts;
            try
            {
                for (const key of ["continued_cost", "new_rank_cost"])
                {
                    runtimeRules.features.set(key, {
                        online: "all",
                        test: "all",
                        version: "1.0.0",
                    });
                }
                runtimeRules.items.set("continued_cost", {
                    id: "continued_cost",
                    k1: "1",
                    k2: "1",
                    k5: "1;100;236039",
                });
                runtimeRules.power.activityPanels = new Map(previousCostPanels ?? []);
                const today = new Date().toISOString().slice(0, 10),
                    tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
                runtimeRules.power.activityPanels.set("57159", {
                    id: "57159",
                    start: today + "-00-00",
                    end: tomorrow + "-00-00",
                });
                runtimeRules.advanced.continuedCosts = new Map([
                    [
                        "synthetic",
                        {
                            id: "synthetic",
                            type: "1",
                            level: "1",
                            point: "100000000",
                            item: "236039",
                        },
                    ],
                ]);
                expect(
                    (
                        await client.command("user.modify.nickName", {
                            nickName: sfs.string(`Renamed ${id}`),
                            operationId: sfs.string(operationId),
                        })
                    ).status,
                ).toEqual(sfs.bool(true));
                expect(
                    (
                        await client.command("user.modify.nickName", {
                            nickName: sfs.string(`Renamed ${id}`),
                            operationId: sfs.string(operationId),
                        })
                    ).status,
                ).toEqual(sfs.bool(true));
                await eventually(async () => {
                    const result = await client.command("continuedcost.ranking", {
                        _cok_: sfs.string("cost-wire"),
                    });
                    return (
                        (result.rankList?.value as
                            | import("@opencok/messages/sfs").Value[]
                            | undefined)?.some(
                                (entry) => str(fields(entry), "uid") === `synthetic-player-${id}`,
                            ) ?? false
                    );
                });
                const costBoard = await client.command("continuedcost.ranking", {
                    _cok_: sfs.string("cost-wire"),
                });
                const costMember =
                    (costBoard.rankList!.value as import("@opencok/messages/sfs").Value[])
                        .map(fields)
                        .find((row) => str(row, "uid") === `synthetic-player-${id}`)!;
                expect(costBoard._cok_).toEqual(sfs.string("cost-wire"));
                expect(costMember.val).toEqual(sfs.int(100));
                expect(costBoard.myRank).toEqual(sfs.int(id));
            }
            finally
            {
                for (
                    const [key, previous] of [
                        ["continued_cost", previousCostFeature],
                        ["new_rank_cost", previousRankFeature],
                    ] as const
                )
                {
                    if (previous)
                    {
                        runtimeRules.features.set(key, previous);
                    }
                    else
                    {
                        runtimeRules.features.delete(key);
                    }
                }
                if (previousCostItem)
                {
                    runtimeRules.items.set("continued_cost", previousCostItem);
                }
                else
                {
                    runtimeRules.items.delete("continued_cost");
                }
                runtimeRules.power.activityPanels = previousCostPanels;
                runtimeRules.advanced.continuedCosts = previousCostTiers;
            }
            expect((await client.command("equip.show", { show: sfs.int(1) })).show).toEqual(
                sfs.int(1),
            );
            await eventually(async () => {
                const rows = await databases!
                    .getKingdom(id)
                    .pool.query(
                        "select \"pendingEffects\" from opencok_kingdom.nickname_change where \"operationId\"=$1",
                        [operationId],
                    );
                return rows.rows[0]?.pendingEffects === 0;
            });
            const saved = await adapter.getProfileById(`synthetic-player-${id}`);
            expect(saved).toMatchObject({ name: `Renamed ${id}`, gold: 9007199254740892n });
            const replacement = new Client(server.port, id);
            clients.push(replacement);
            await replacement.handshake();
            expect((await replacement.login("wrong", `synthetic-player-${id}`)).ec?.value).toBe(3);
            expect((await client.command("cmd.ping")).serverNowTime?.type).toBe(Type.Long);
            expect((await replacement.login(base.loginSecret, `synthetic-player-${id}`)).id?.type)
                .toBe(
                    Type.Int,
                );
            const replacedInit = fields(fields((await replacement.next()).p).p);
            expect(fields(replacedInit.user).name?.value).toBe(`Renamed ${id}`);
            expect(fields(replacedInit.user).gold?.value).toBe(9007199254740892n);

            expect((await replacement.command("cmd.ping")).serverNowTime?.type).toBe(Type.Long);
            const paidAt = BigInt(Date.now()),
                paidYear = new Date(Number(paidAt)).getUTCFullYear(),
                paidOwner = `synthetic-player-${id}`,
                paidOrder = `synthetic-paid-${id}`;
            const payControl = (runtimeRules.configuration.payControl ??= new Map());
            for (const key of ["69022", "69023", "69025"])
            {
                payControl.set(key, {
                    id: key,
                    k1: "1.0.0",
                    k2: "all",
                    k4: "1",
                    k5: key === "69023" ? "0" : `${paidYear}-01-01-00-00`,
                    k6: `${paidYear + 1}-01-01-00-00`,
                    k7: `${paidYear}-01-01-00-00`,
                    k8: `${paidYear + 1}-01-01-00-00`,
                });
            }
            const catalog = (runtimeRules.advanced.castleExchanges ??= new Map());
            catalog.set("synthetic-delivery", {
                id: "synthetic-delivery",
                product_id: "gold_1",
                dollar: "4.99",
                gold_doller: "1700",
            });
            runtimeRules.reconnect.rewards!.set("990000001", { id: "990000001", gold: "7" });
            for (const template of ["12000", "11809"])
            {
                runtimeRules.mail.set(template, exchangeCatalog.mail.get(template)!);
            }
            runtimeRules.advanced.normalRechargeThresholds = new Map([
                ["normal", { id: "normal", type: "1", Node: "500", level: "1", Gift: "990000001" }],
            ]);
            runtimeRules.advanced.rechargeThresholds = new Map([
                ["9912999", { id: "9912999", pay_node: "500", pay_reward: "990000001" }],
            ]);
            runtimeRules.advanced.rechargeFeedback = new Map([
                ["feedback", {
                    id: "feedback",
                    product_id: "gold_1",
                    number: "1",
                    reward: "990000001",
                }],
            ]);
            const playerDb = databases.getKingdom(id);
            await playerDb.db
                .insert(server_info)
                .values({ uid: "server", payTotalTime: 1n })
                .onConflictDoUpdate({ target: server_info.uid, set: { payTotalTime: 1n } });
            await playerDb.db.insert(paylog).values({
                uid: paidOwner,
                orderId: paidOrder,
                pf: "synthetic",
                productId: "gold_1",
                spend: 4.99,
                time: paidAt,
                status: 2,
                payLevel: 1,
            });
            deliveredOrders.set(paidOrder, {
                owner: paidOwner,
                kingdomId: id,
                orderId: paidOrder,
                platform: "synthetic",
                exchangeId: "synthetic-delivery",
                productId: "gold_1",
                priceCents: 499,
                occurredAt: paidAt,
            });
            const paidCampaigns = runtimeRules.advanced.campaignRules;
            runtimeRules.advanced.campaignRules = [];
            try
            {
                await Promise.all([
                    server.paidGifts!.consume(paidOwner, paidOrder, "synthetic"),
                    server.paidGifts!.consume(paidOwner, paidOrder, "synthetic"),
                ]);
            }
            finally
            {
                runtimeRules.advanced.campaignRules = paidCampaigns;
            }
            const observation = await playerDb.pool.query(
                "select p.gold::text as normal,l.\"newSerCumRechargeTotal\"::text as newcomer,(select count(*)::int from opencok_kingdom.recharge_feedback_claim f where f.uid=p.uid) as feedback from opencok_kingdom.pay_total p join opencok_kingdom.user_lord l on l.uid=p.uid where p.uid=$1 and p.type=1",
                [paidOwner],
            );
            expect(observation.rows).toEqual([{ normal: "1700", newcomer: "1700", feedback: 1 }]);
            const paidLogin = new Client(server.port, id);
            clients.push(paidLogin);
            await paidLogin.handshake();
            expect((await paidLogin.login(base.loginSecret, paidOwner)).id?.type).toBe(Type.Int);
            const paidInit = fields(fields((await paidLogin.next()).p).p);
            expect(fields(paidInit.repayinfo).payPoint).toEqual(sfs.long(1700));
            expect(paidInit.newSerCumRechargeTotal).toEqual(sfs.long(1700));
            expect(fields(paidInit.user).gold).toEqual(sfs.long(9007199254740892n));
            configureGoldEggs(runtimeRules);
            runtimeRules.power.activityPanels!.set("57175", {
                ...runtimeRules.power.activityPanels!.get("57175")!,
                start: "2020-01-01-00-00",
                end: "2099-01-01-00-00",
            });
            const eggs = await paidLogin.command("goldeggs.info", {});
            expect(eggs.freetimes).toEqual(sfs.int(2));
            expect((eggs.list!.value as Value[]).map(fields)).toHaveLength(3);
            const egg = await paidLogin.command("goldeggs.smashing", { pos: sfs.int(0) });
            expect(egg.freetimes).toEqual(sfs.int(1));
            expect(egg.allscore).toEqual(sfs.long(2));
            expect(egg.reward!.value as Value[]).toHaveLength(1);
            const eggRank = await paidLogin.command("goldeggs.rank", {});
            expect(eggRank.selfRanking).toEqual(sfs.int(1));
            const eggGlobal = await paidLogin.command("goldeggs.rankAll", {});
            expect((eggGlobal.allRank!.value as Value[]).length).toBeGreaterThan(0);
            const privateAward = await paidLogin.command("goldeggs.award.deliver", {
                start: sfs.long(1),
                end: sfs.long(2),
                global: sfs.bool(false),
            });
            expect(privateAward.errorCode).toEqual(sfs.string("102192"));
            expect((await paidLogin.command("egg.act.info", {})).opened).toEqual(sfs.bool(false));
            configureEggActivity(runtimeRules);
            const eggControl = runtimeRules.configuration.payControl!.get("69007")!;
            runtimeRules.configuration.payControl!.set("69007", {
                ...eggControl,
                k8: "2020-01-01-00-00",
                k9: "2099-01-01-00-00",
                k7: "999999",
            });
            for (const [key, rule] of runtimeRules.advanced.eggs!)
            {
                runtimeRules.advanced.eggs!.set(key, { ...rule, time: "30" });
            }
            for (const key of ["990011", "990015"])
            {
                runtimeRules.reconnect.rewards!.set(key, {
                    ...runtimeRules.reconnect.rewards!.get(key)!,
                    gold: "1",
                });
            }
            const legacyEgg = await paidLogin.command("egg.act.info", {});
            expect(legacyEgg.opened).toEqual(sfs.bool(true));
            expect(fields(legacyEgg.eggAct).eggCd).toEqual(sfs.long(-1));
            const legacyOpened = await paidLogin.command("egg.act.open", {
                eggId: fields(legacyEgg.eggAct).curEgg!,
            });
            expect(fields(legacyOpened.eggAct).eggCd?.type).toBe(Type.Long);
            const legacyClear = await paidLogin.command("egg.act.cd", {});
            expect(legacyClear.gold).toEqual(sfs.long(9007199254740891n));
            const legacyReward = await paidLogin.command("egg.act.reward", {});
            expect(fields(legacyReward.eggAct).exp).toEqual(sfs.int(3));
            expect(legacyReward.reward?.type).toBe(Type.Array);
            expect((await adapter.getProfileById(paidOwner))!.gold).toBe(9007199254740892n);
            expect((await paidLogin.command("egg.activity.init", {})).errorCode).toEqual(
                sfs.string("102192"),
            );
        }
        const otherCache = new Cache({ ...base, kingdomId: 2 });
        expect(await cache.claim("synthetic-shared-uid", "synthetic-token-1")).toBe(true);
        expect(await otherCache.claim("synthetic-shared-uid", "synthetic-token-2")).toBe(true);
        await cache.release("synthetic-shared-uid", "synthetic-token-1");
        expect(await otherCache.refresh("synthetic-shared-uid", "synthetic-token-2")).toBe(true);
        await otherCache.release("synthetic-shared-uid", "synthetic-token-2");

        await databases
            .getKingdom(1)
            .pool.query(
                "update opencok_kingdom.nickname_change set \"pendingEffects\"=2 where \"ownerUid\"=$1",
                ["synthetic-player-1"],
            );
        clients[0]!.close();
        await servers[0]!.close();
        servers.shift();
        const restartRules = await loadRules(resources, base.kingdomId);
        (restartRules.power.newGeneralBases ??= new Map()).set("53500", { id: "53500" });
        (restartRules.power.newGeneralSkills ??= new Map()).set("53900", {
            id: "53900",
            type: "0",
        });
        const restarted = await startServer(base, restartRules);
        servers.push(restarted);
        await eventually(
            async () =>
                (
                    await databases!
                        .getKingdom(1)
                        .pool.query(
                            "select \"pendingEffects\" from opencok_kingdom.nickname_change where \"ownerUid\"=$1",
                            ["synthetic-player-1"],
                        )
                ).rows[0]?.pendingEffects === 0,
        );
        const reconnected = new Client(restarted.port);
        clients.push(reconnected);
        await reconnected.handshake();
        expect((await reconnected.login(base.loginSecret, "synthetic-player-1")).id?.type).toBe(
            Type.Int,
        );
        const restartInit = fields(fields((await reconnected.next()).p).p);
        const restartedHero = (restartInit.generallist!.value as Value[]).map(fields)[0]!;
        expect(restartedHero.exp).toEqual(sfs.int(123));
        expect(restartedHero.talent).toEqual(
            sfs.array([sfs.object({ id: sfs.int(53900), level: sfs.int(1) })]),
        );
        expect(fields(restartInit.user).name?.value).toBe("Renamed 1");
        expect(
            (
                await databases
                    .getKingdom(1)
                    .pool.query(
                        "select \"showEquip\" from opencok_kingdom.user_mixed_info where uid=$1",
                        [
                            "synthetic-player-1",
                        ],
                    )
            ).rows[0].showEquip,
        ).toBe(1);
        expect(fields((await reconnected.command("build.info")).resource).wood?.value).toBe(10005n);
        for (
            const [command, saved] of [
                ["shoppingMall.buy", shopReplays.get(1)!],
                ["trade.exchange", tradeReplays.get(1)!],
            ] as const
        )
        {
            const replayed = await reconnected.command(command, {
                ...saved.request,
                _cok_: sfs.string("after-restart"),
            });
            expect(replayed.operationId).toEqual(saved.reply.operationId);
            expect(replayed._cok_).toEqual(sfs.string("after-restart"));
            if (command === "shoppingMall.buy")
            {
                expect(replayed.goods).toEqual(saved.reply.goods);
            }
            else
            {
                expect(replayed.addItem).toEqual(saved.reply.addItem);
            }
        }
        await pg.docker(["pause", redis]);
        await eventually(
            async () =>
                (await fetch(`http://127.0.0.1:${restarted.healthPort}/readyz`)).status === 503,
        );
        await pg.docker(["unpause", redis]);
        await eventually(
            async () =>
                (await fetch(`http://127.0.0.1:${restarted.healthPort}/readyz`)).status === 200,
        );
        const accounting = await databases
            .getKingdom(1)
            .pool.query(
                `select count(*)::int as count from opencok_kingdom.resource_settlement s join opencok_kingdom.command_receipt r on r."ownerUid"=s.uid and r."requestId"='settlement:' || s."fromTime" || ':' || s."toTime" join opencok_kingdom.economy_posting p on p."ownerUid"=r."ownerUid" and p."requestId"=r."requestId" where p.asset='resource.food' and p."before"=s."foodBefore" and p."after"=s."foodAfter"`,
            );
        expect(accounting.rows[0].count).toBeGreaterThan(0);
        await acquireRealmAuthority(databases.getKingdom(1).db, 1, () => true);
        expect((await reconnected.command("equip.show", { show: sfs.int(0) })).errorCode)
            .toBeDefined();
        expect(
            (
                await databases
                    .getKingdom(1)
                    .pool.query(
                        "select \"showEquip\" from opencok_kingdom.user_mixed_info where uid=$1",
                        [
                            "synthetic-player-1",
                        ],
                    )
            ).rows[0].showEquip,
        ).toBe(1);
    }
    finally
    {
        clients.forEach((client) => client.close());
        await Promise.allSettled(servers.map((server) => server.close()));
        await Promise.allSettled(adapters.map((adapter) => adapter.close()));
        if (chat)
        {
            await new Promise<void>((resolve) => chat!.server.close(() => resolve()));
        }
        await chatRepository?.close();
        await databases?.close();
        for (const name of containers)
        {
            await pg.docker(["rm", "--force", "--volumes", name]);
        }
        await pg.stop();
        await rm(resources, { recursive: true, force: true });
    }
}, 180000);
