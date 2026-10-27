import { catalog as campaignRulesCatalog } from "../../../packages/resources/src/catalogs/data/trigger-activity";
import { flower_info } from "@opencok/drizzle/schema/opencok_kingdom/flower_info";
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
import { fields, sfs, str, Type } from "@opencok/messages/sfs";
import { FOREVER } from "@opencok/mappings/city";
import { Client } from "./client.ts";
import { dataConfigItems } from "../test/fixtures/data-config.ts";
import { loadRules } from "@opencok/resources/rules";

async function eventually(check: () => Promise<boolean>, timeout = 15000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (await check().catch(() => false)) return;
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
  try {
    const admin = await pg.start();
    try {
      for (const name of [topology.globalDatabase, ...topology.kingdoms.map((k) => k.database)])
        await admin.query(`CREATE DATABASE "${name}"`);
    } finally {
      await admin.end();
    }
    databases = createDatabases(pg.options, topology);
    await migrate(databases.global.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/global", import.meta.url)
        .pathname,
    });
    for (const kingdom of databases.kingdoms.values())
      await migrate(kingdom.db, {
        migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
          .pathname,
      });
    for (const id of [1, 2]) {
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
      await db.insert(mail).values({
        uid: "synthetic-mail-reward",
        toUser: uid,
        type: 2,
        rewardId: "wood,0,5",
        contents: Buffer.from("synthetic"),
        createTime: 1000n,
      });
      await db.insert(user_mixed_info).values({ uid, mdata: "{}" });
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
      await db.insert(user_world).values({ uid, pointId: 12011, worldId: 0, lastCityDefTime: 0n });
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
          `<ItemSpec ${Object.entries(record)
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ")}/>`,
      )
      .join("");
    const xml: Record<string, string> = {
      treasure: '<ItemSpec id="1" lv="1" exp="100" helper="1"/>',
      quest: "",
      building:
        '<ItemSpec id="400001" level="1" time="30"/><ItemSpec id="400002" level="2" time="40"/>',
      role: '<ItemSpec id="100101" player_exp="100000"/><ItemSpec id="100102" player_exp="200000"/>',
      position: '<ItemSpec id="9900" position="0"/><ItemSpec id="9906" position="6"/>',
      item: `<Group id="data_config">${configRecords}</Group>`,
      arms: '<ItemSpec id="100001" attack="12" attack_add="3" defence="10" defence_add="2" upkeep="24" power="0.5"/><ItemSpec id="100002"/>',
      goods:
        '<ItemSpec id="200001" type="21" useall="1" para1="50"/><ItemSpec id="200002" para1="60"/><ItemSpec id="200021" type="17" price="100"/>',
    };
    for (const [name, records] of Object.entries(xml))
      await Bun.write(join(resources, `${name}.xml`), `<database>${records}</database>`);
    for (const [name, image, port] of [
      [redis, "redis:6.2.24-bookworm", 6379],
      [zk, "zookeeper:3.4.14", 2181],
    ] as const) {
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
    const base: Config = {
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
    await cache.command("HSET", "opencok:kingdom:3:world-effects", "487", '{"value":"0.1"}');
    expect(await cache.worldEffects(3)).toEqual(new Map([["487", '{"value":"0.1"}']]));
    await eventually(async () => {
      const coordination = new Coordination({
        ...base,
        zkPath: `/opencok-experiment/probe_${suffix}`,
      });
      try {
        await coordination.start();
        return coordination.ready;
      } finally {
        coordination.close();
      }
    });
    for (const id of [1, 2]) {
      const settings = {
        ...base,
        kingdomId: id,
        kingdomDatabase: topology.kingdoms[id - 1]!.database,
        zkPath: `/opencok-experiment/COK${id}`,
      };
      const runtimeRules = await loadRules(resources, id);
      runtimeRules.advanced.campaignRules = campaignRulesCatalog.rules;
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
        value1: "0",
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
        (await client.login(base.loginSecret, `synthetic-player-${id}`, "wrong-device")).ec?.value,
      ).toBe(3);
      expect((await client.login(base.loginSecret, `synthetic-player-${3 - id}`)).ec?.value).toBe(
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
      expect(
        (await client.command("cmd.finishinit", { _cok_: sfs.string("synthetic-init") }))._cok_
          ?.value,
      ).toBe("synthetic-init");
      expect((await client.command("cmd.ping")).serverNowTime?.type).toBe(Type.Long);
      await eventually(async () =>
        client.received.some((packet) => str(fields(packet.p), "c", "") === "push.common.notice"),
      );
      const campaignLoginNotice = fields(
        fields(
          client.received.find((packet) => str(fields(packet.p), "c", "") === "push.common.notice")!
            .p,
        ).p,
      );
      expect(campaignLoginNotice.msgId).toEqual(sfs.string("9440790"));
      expect(campaignLoginNotice.para).toEqual(
        sfs.array([sfs.string(""), sfs.string(`Synthetic ${id}`)]),
      );
      expect((await client.command("get.trouble.list")).array).toEqual(sfs.array([]));
      const costInfo = await client.command("continuedcost.info", {
        _cok_: sfs.long(9007199254740993n),
      });
      expect(costInfo._cok_).toEqual(sfs.long(9007199254740993n));
      expect(costInfo.costPoint).toBeUndefined();
      const previousVariables = runtimeRules.advanced.campaignVariables;
      try {
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
      } finally {
        runtimeRules.advanced.campaignVariables = previousVariables;
      }
      expect((await client.command("continuedcost.apply", {})).errorCode?.value).toBe("102192");
      expect((await client.command("hero.target.deliver", {})).errorCode?.value).toBe("102192");
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
      try {
        runtimeRules.features.set("17_wk", { version: "12.06.0", online: "all", test: "all" });
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
      } finally {
        if (expeditionFeature) runtimeRules.features.set("17_wk", expeditionFeature);
        else runtimeRules.features.delete("17_wk");
        if (expeditionSwitch) runtimeRules.features.set("wk_switch_new", expeditionSwitch);
        else runtimeRules.features.delete("wk_switch_new");
      }

      for (const [command, params] of [
        ["hero.event.info.get", { activityId: sfs.string("9000000") }],
        ["hero.event.ranking.get", { actId: sfs.string("missing") }],
        ["hero.cross.info", {}],
      ] as const) {
        const heroInfo = await client.command(command, {
          ...params,
          _cok_: sfs.long(9007199254740993n),
        });
        expect(heroInfo._cok_).toEqual(sfs.long(9007199254740993n));
        expect(heroInfo.eventList).toBeUndefined();
      }
      for (const command of ["Olympic.question.info", "Olympic.bet.info"]) {
        const olympicInfo = await client.command(command, { _cok_: sfs.long(9007199254740993n) });
        expect(olympicInfo._cok_).toEqual(sfs.long(9007199254740993n));
      }
      for (const command of ["Olympic.result", "Olympic.settle"])
        expect((await client.command(command, {})).errorCode?.value).toBe("102192");
      const cupInfo = await client.command("euro.cup.info", { _cok_: sfs.long(9007199254740993n) });
      expect(cupInfo._cok_).toEqual(sfs.long(9007199254740993n));
      expect(cupInfo.matchList).toBeUndefined();
      expect((await client.command("euro.cup.settle", {})).errorCode?.value).toBe("102192");
      const groupInfo = await client.command("groupbuys.info", {
        _cok_: sfs.long(9007199254740993n),
      });
      expect(groupInfo._cok_).toEqual(sfs.long(9007199254740993n));
      expect(groupInfo.totalBuy).toBeUndefined();
      for (const command of [
        "groupbuys.paid",
        "groupbuys.reserve",
        "groupbuys.cancel",
        "groupbuys.close",
        "groupbuys.settle",
      ])
        expect((await client.command(command, {})).errorCode?.value).toBe("102192");
      const specialInfo = await client.command("special.ui.state", {
        _cok_: sfs.long(9007199254740993n),
      });
      expect(specialInfo._cok_).toEqual(sfs.long(9007199254740993n));
      expect(specialInfo.SpecialEvent_num).toBeUndefined();
      expect((await client.command("special.paid", {})).errorCode?.value).toBe("102192");
      expect((await client.command("trouble.deliver", {})).errorCode?.value).toBe("102192");
      expect(
        fields(fields((await client.command("login.dataconfig")).dataConfig).player_max).k3?.value,
      ).toBe("30");
      const army = await client.command("login.other", { army: sfs.int(1) });
      expect(army.army?.type).toBe(Type.Array);
      expect(fields((army.army!.value as ReturnType<typeof sfs.object>[])[0]).free?.value).toBe(17);
      expect(fields((army.items!.value as ReturnType<typeof sfs.object>[])[0]).count?.value).toBe(
        7,
      );
      expect(fields((await client.command("login.other")).lord).medal?.value).toBe(
        "synthetic-medal",
      );
      expect((await client.command("build.info")).building?.type).toBe(Type.Array);
      expect((await client.command("mall.info")).shoppingMall?.type).toBe(Type.Array);
      const shopPurchase = {
        id: sfs.string("wire-shop"),
        num: sfs.int(1),
        _cok_: sfs.string("shop-wire"),
      };
      const bought = await client.command("shoppingMall.buy", shopPurchase);
      expect(fields(bought.goods).count).toEqual(sfs.int(8));
      expect(fields((await client.command("shoppingMall.buy", shopPurchase)).goods).count).toEqual(
        sfs.int(8),
      );
      expect(
        (
          await client.command("shoppingMall.buy", {
            ...shopPurchase,
            _cok_: sfs.string("shop-other"),
          })
        ).errorCode,
      ).toBeDefined();
      expect(
        (await client.command("trade.info", { _cok_: sfs.string("trade-offer") })).trade,
      ).toEqual(sfs.string("200001;1|200001;1"));
      const traded = await client.command("trade.exchange", { _cok_: sfs.string("trade-swap") });
      expect(fields(traded.addItem).count).toEqual(sfs.int(8));
      expect(fields(traded.tradeCaravan).times).toEqual(sfs.int(1));
      expect(
        (await client.command("trade.exchange", { _cok_: sfs.string("trade-swap") })).operationId,
      ).toEqual(traded.operationId);
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
        (await client.command("mail.reward", { uid: sfs.string("foreign-mail") })).errorCode,
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
        expect((await client.command(command)).errorCode?.value).toBe("E000000");
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
        JSON.parse(String(part.value)),
      );
      expect(points.map((p: string) => JSON.parse(p).o)).toContain(`Synthetic ${id}`);
      const after = await adapter.getCityByPlayerId(`synthetic-player-${id}`, Date.now());
      const checkpoint = after.resource?.lastUpdateTime;
      if (typeof checkpoint !== "bigint") throw new Error("Missing reconnect checkpoint");
      expect(checkpoint).toBeGreaterThan(BigInt(String(before.resource?.lastUpdateTime ?? 0)));
      const dailyFlush = BigInt(String(after.lord?.dailyTaskFlushTime ?? 0)),
        allianceFlush = BigInt(String(after.lord?.newDailyTaskFlushTime ?? 0));
      expect(dailyFlush).toBeGreaterThan(BigInt(String(before.lord?.dailyTaskFlushTime ?? 0)));
      expect(dailyFlush / 86400000n).toBe(checkpoint / 86400000n);
      expect(allianceFlush + 300000n).toBe(dailyFlush);
      expect(after.queues).toHaveLength(before.queues.length + 1);
      expect(after).toEqual({
        ...before,
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
          item.uuid === "synthetic-item" ? { ...item, count: 6 } : item,
        ),
        resource: { ...before.resource, wood: BigInt(id * 10000 + 5), lastUpdateTime: checkpoint },
      });
      expect((await fetch(`http://127.0.0.1:${server.healthPort}/readyz`)).status).toBe(200);
      const operationId = randomUUID();
      const previousCostFeature = runtimeRules.features.get("continued_cost"),
        previousRankFeature = runtimeRules.features.get("new_rank_cost"),
        previousCostItem = runtimeRules.items.get("continued_cost"),
        previousCostPanels = runtimeRules.power.activityPanels,
        previousCostTiers = runtimeRules.advanced.continuedCosts;
      try {
        for (const key of ["continued_cost", "new_rank_cost"])
          runtimeRules.features.set(key, { online: "all", test: "all", version: "1.0.0" });
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
            { id: "synthetic", type: "1", level: "1", point: "100000000", item: "236039" },
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
            (result.rankList?.value as import("@opencok/messages/sfs").Value[] | undefined)?.some(
              (entry) => str(fields(entry), "uid") === `synthetic-player-${id}`,
            ) ?? false
          );
        });
        const costBoard = await client.command("continuedcost.ranking", {
          _cok_: sfs.string("cost-wire"),
        });
        const costMember = (costBoard.rankList!.value as import("@opencok/messages/sfs").Value[])
          .map(fields)
          .find((row) => str(row, "uid") === `synthetic-player-${id}`)!;
        expect(costBoard._cok_).toEqual(sfs.string("cost-wire"));
        expect(costMember.val).toEqual(sfs.int(100));
        expect(costBoard.myRank).toEqual(sfs.int(id));
      } finally {
        for (const [key, previous] of [
          ["continued_cost", previousCostFeature],
          ["new_rank_cost", previousRankFeature],
        ] as const) {
          if (previous) runtimeRules.features.set(key, previous);
          else runtimeRules.features.delete(key);
        }
        if (previousCostItem) runtimeRules.items.set("continued_cost", previousCostItem);
        else runtimeRules.items.delete("continued_cost");
        runtimeRules.power.activityPanels = previousCostPanels;
        runtimeRules.advanced.continuedCosts = previousCostTiers;
      }
      expect((await client.command("equip.show", { show: sfs.int(1) })).show).toEqual(sfs.int(1));
      await eventually(async () => {
        const rows = await databases!
          .getKingdom(id)
          .pool.query(
            'select "pendingEffects" from opencok_kingdom.nickname_change where "operationId"=$1',
            [operationId],
          );
        return rows.rows[0]?.pendingEffects === 0;
      });
      const saved = await adapter.getProfileById(`synthetic-player-${id}`);
      expect(saved).toMatchObject({ name: `Renamed ${id}`, gold: 9007199254740893n });
      const replacement = new Client(server.port, id);
      clients.push(replacement);
      await replacement.handshake();
      expect((await replacement.login("wrong", `synthetic-player-${id}`)).ec?.value).toBe(3);
      expect((await client.command("cmd.ping")).serverNowTime?.type).toBe(Type.Long);
      expect((await replacement.login(base.loginSecret, `synthetic-player-${id}`)).id?.type).toBe(
        Type.Int,
      );
      const replacedInit = fields(fields((await replacement.next()).p).p);
      expect(fields(replacedInit.user).name?.value).toBe(`Renamed ${id}`);
      expect(fields(replacedInit.user).gold?.value).toBe(9007199254740893n);

      expect((await replacement.command("cmd.ping")).serverNowTime?.type).toBe(Type.Long);
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
        'update opencok_kingdom.nickname_change set "pendingEffects"=2 where "ownerUid"=$1',
        ["synthetic-player-1"],
      );
    clients[0]!.close();
    await servers[0]!.close();
    servers.shift();
    const restarted = await startServer(base, await loadRules(resources, base.kingdomId));
    servers.push(restarted);
    await eventually(
      async () =>
        (
          await databases!
            .getKingdom(1)
            .pool.query(
              'select "pendingEffects" from opencok_kingdom.nickname_change where "ownerUid"=$1',
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
    expect(fields(restartInit.user).name?.value).toBe("Renamed 1");
    expect(
      (
        await databases
          .getKingdom(1)
          .pool.query('select "showEquip" from opencok_kingdom.user_mixed_info where uid=$1', [
            "synthetic-player-1",
          ])
      ).rows[0].showEquip,
    ).toBe(1);
    expect(fields((await reconnected.command("build.info")).resource).wood?.value).toBe(10005n);
    await pg.docker(["pause", redis]);
    await eventually(
      async () => (await fetch(`http://127.0.0.1:${restarted.healthPort}/readyz`)).status === 503,
    );
    await pg.docker(["unpause", redis]);
    await eventually(
      async () => (await fetch(`http://127.0.0.1:${restarted.healthPort}/readyz`)).status === 200,
    );
    const accounting = await databases
      .getKingdom(1)
      .pool.query(
        `select count(*)::int as count from opencok_kingdom.resource_settlement s join opencok_kingdom.command_receipt r on r."ownerUid"=s.uid and r."requestId"='settlement:' || s."fromTime" || ':' || s."toTime" join opencok_kingdom.economy_posting p on p."ownerUid"=r."ownerUid" and p."requestId"=r."requestId" where p.asset='resource.food' and p."before"=s."foodBefore" and p."after"=s."foodAfter"`,
      );
    expect(accounting.rows[0].count).toBeGreaterThan(0);
    await acquireRealmAuthority(databases.getKingdom(1).db, 1, () => true);
    expect((await reconnected.command("equip.show", { show: sfs.int(0) })).errorCode).toBeDefined();
    expect(
      (
        await databases
          .getKingdom(1)
          .pool.query('select "showEquip" from opencok_kingdom.user_mixed_info where uid=$1', [
            "synthetic-player-1",
          ])
      ).rows[0].showEquip,
    ).toBe(1);
  } finally {
    clients.forEach((client) => client.close());
    await Promise.allSettled(servers.map((server) => server.close()));
    await Promise.allSettled(adapters.map((adapter) => adapter.close()));
    if (chat) await new Promise<void>((resolve) => chat!.server.close(() => resolve()));
    await chatRepository?.close();
    await databases?.close();
    for (const name of containers) await pg.docker(["rm", "--force", "--volumes", name]);
    await pg.stop();
    await rm(resources, { recursive: true, force: true });
  }
}, 180000);
