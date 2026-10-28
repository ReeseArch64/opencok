import { afterAll, beforeAll, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { drizzle } from "drizzle-orm/node-postgres";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";
import { DisposableRedis } from "./support/redis.ts";
import { Cache } from "../../../packages/storage/src/session.ts";
import {
    createRealmWorldPointDetailStore as createWorldPointDetailStore,
    checkRealmWorldPointDetailStore as checkWorldPointDetailStore,
} from "../src/composition/world-detail";
import { createRealmWorldPointDetailService } from "../src/composition/world-detail";
import { decodeWorldResourceArmy } from "../../../packages/messages/src/world-resource-army.ts";
import { Rules } from "../../../packages/rules/src/game.ts";
import { sfs, Type, encode, decode, type Fields } from "../../../packages/messages/src/sfs.ts";
import * as schema from "../../../packages/drizzle/src/schema/kingdom.ts";
import vectors from "../test/fixtures/world-resource-army-vectors.json";

const postgres = new DisposablePostgres();
const redis = new DisposableRedis();
const pools: Awaited<ReturnType<DisposablePostgres["start"]>>[] = [];
let cache: Cache;
let store: ReturnType<typeof createWorldPointDetailStore>;
let databases: Parameters<typeof createWorldPointDetailStore>[0];
const rules = new Rules(new Map(), new Map(), new Map());
const army = Buffer.from(vectors.arrayList, "base64");
const owner = decodeWorldResourceArmy(army)!.owner;
const services = {
    worldPowerEffects: async () => new Map<string, string>(),
    worldTurretKills: (realm: number, id: string) => cache.worldTurretKills(realm, id),
};
const query = async (point: number, realm = 1) =>
    decode(
        encode(
            await createRealmWorldPointDetailService(rules, services).read(
                store,
                "self",
                { point: sfs.int(point), serverId: sfs.int(realm) },
                1,
                5000,
            ),
        ),
    );
const fields = (body: Fields, key = "territory") => body[key]!.value as Fields;

beforeAll(async () => {
    pools.push(await postgres.start());
    await pools[0]!.query("create database remote");
    pools.push(await postgres.connect("remote"));
    for (const [index, pool] of pools.entries())
    {
        for (const migration of ["0000_initial.sql", "0001_opencok_namespaces.sql"])
        {
            await pool.query(
                await readFile(
                    new URL(
                        `../../../packages/drizzle/migrations/kingdom/${migration}`,
                        import.meta.url,
                    ),
                    "utf8",
                ),
            );
        }
        await pool.query(
            `insert into opencok_kingdom.userprofile (uid,name,level,exp,country,"serverId","allianceId") values ('self','Self',1,0,'US',$1,'A'),('member','Member',1,0,'US',$1,'A')`,
            [index + 1],
        );
        await pool.query(
            `insert into opencok_kingdom.userprofile (uid,name,level,exp,country,"serverId","allianceId") values ($1,'Owner',1,0,'US',$2,'A')`,
            [owner, index + 1],
        );
        await pool.query(`update opencok_kingdom.userprofile set pic='g101'`);
        await pool.query(
            `insert into opencok_kingdom.user_world (uid,"pointId","worldId","lastCityDefTime") values ('self',1,9,0)`,
        );
        await pool.query(
            `insert into opencok_kingdom.alliance (uid,createtime,"bannerStyle") values ('A',0,'A-banner')`,
        );
        for (const type of [3, 14, 18, 20, 21, 23, 37, 46, 47, 49, 50])
        {
            const world = index === 0 ? 9 : 0;
            await pool.query(
                `insert into opencok_kingdom.worldpoint (id,"worldId",x,y,"areaId","gridType","grid2Type","pointType","resLevel","resInitValue","resCostValue",reserve) values ($1,$2,1,1,0,0,0,$3,1,100,10,1048576)`,
                [700 + type, world, type],
            );
            if ([14, 18, 20, 21, 23, 46, 47].includes(type))
            {
                await pool.query(
                    `insert into opencok_kingdom.alliance_territory (uid,"pointId","atWorldId",type,"allianceId","allianceName",active,stat,"curDef","maxDef","buildingSpd","updateTime") values ($1,$2,$3,$4,'A','Alliance',1,3,20,100,0.25,9007199254740993)`,
                    [`t${type}`, 700 + type, world, type],
                );
            }
        }
        await pool.query(
            `insert into opencok_kingdom.user_territory_resource (uid,"allianceId",wood,food) values ('member','A',-10,9007199254740993),('orphan','A',100,100),('foreign','B',200,200)`,
        );
        await pool.query(
            `insert into opencok_kingdom.t_worldboss (id,bossid,type,status,hp,maxhp,point,reward,killuser) values (1,8,1,2,0,100,749,1,'self')`,
        );
    }
    const kingdoms = new Map(pools.map((pool, i) => [i + 1, { db: drizzle(pool, { schema }) }]));
    databases = {
        kingdoms,
        getKingdom: (id: number) => {
            const db = kingdoms.get(id);
            if (!db)
            {
                throw new Error("Unconfigured realm");
            }
            return db;
        },
    } as unknown as typeof databases;
    store = createWorldPointDetailStore(databases, 1);
    cache = new Cache({ redisUrl: await redis.start(), timeoutMs: 2000, kingdomId: 1 });
    await cache.command(
        "HSET",
        "opencok:kingdom:1:turret:t21",
        "member",
        "{\"troop\":3,\"deadPower\":8}",
    );
    await cache.command("HSET", "opencok:kingdom:2:turret:t21", "remote", "{\"troop\":9}");
}, 120000);
afterAll(async () => {
    for (const pool of pools)
    {
        await pool.end();
    }
    await postgres.stop();
    await redis.stop();
});

test("real realm snapshots project all territories and scoped turret archives without persisted changes", async () => {
    await checkWorldPointDetailStore(databases.getKingdom(1).db);
    const before = await pools[0]!.query(
        `select jsonb_agg(to_jsonb(t)) as data from opencok_kingdom.alliance_territory t`,
    );
    for (const type of [14, 18, 20, 21, 23, 46, 47])
    {
        const local = await query(700 + type);
        const remote = await query(700 + type, 2);
        expect(fields(local).type).toEqual(sfs.int(type));
        expect(fields(remote).updateTime).toEqual(sfs.long(9007199254740993n));
        expect(remote.speed).toBeUndefined();
    }
    const warehouse = fields(await query(723)).resourceList!.value as { value: Fields; }[];
    expect(warehouse).toHaveLength(1);
    expect(warehouse[0]!.value.wood).toEqual(sfs.long(0n));
    expect(warehouse[0]!.value.food).toEqual(sfs.long(9007199254740993n));
    const kills = fields(await query(721)).kill!.value as { value: Fields; }[];
    expect(kills[0]!.value.uid).toEqual(sfs.string("member"));
    const remoteKills = fields(await query(721, 2)).kill!.value as { value: Fields; }[];
    expect(remoteKills[0]!.value.uid).toEqual(sfs.string("remote"));
    expect(
        await pools[0]!.query(
            `select jsonb_agg(to_jsonb(t)) as data from opencok_kingdom.alliance_territory t`,
        ),
    ).toMatchObject({ rows: before.rows });
});

test("boss reward eligibility stays a read and remote world bosses omit local handler fields", async () => {
    expect(fields(await query(749), "data").reward).toEqual(sfs.int(1));
    expect((await query(749, 2)).data).toBeUndefined();
    expect(
        (await pools[0]!.query("select reward from opencok_kingdom.t_worldboss")).rows[0].reward,
    ).toBe(1);
});

test("occupied resource snapshots compose saved army and shared collection without repairing stale pointers", async () => {
    const pool = pools[0]!;
    for (const type of [3, 37])
    {
        await pool.query(
            `update opencok_kingdom.worldpoint set "ownerId"=$1,"ownerName"='Owner',"ownerMarchUUid"=$2,"pointItem"='resource' where id=$3`,
            [owner, `m${type}`, 700 + type],
        );
        await pool.query(
            `insert into opencok_kingdom.world_march (uuid,"ownerUid","ownerId",type,"targetId","marchStartTime","worldId",state,"armyInfo","collectSpd","marchArrivalTime","arrivalTime") values ($1,$2,1,0,$3,0,9,1,$4,2,1000,1000)`,
            [`m${type}`, owner, 700 + type, army],
        );
        const body = await query(700 + type);
        expect(body.spd).toEqual({ type: Type.Float, value: 2 });
        expect(body.sdt).toEqual(type === 37 ? sfs.double(5000) : sfs.long(1000n));
        expect(body.tq).toEqual(sfs.int(type === 37 ? 82 : 90));
    }
    await pool.query(`delete from opencok_kingdom.world_march where uuid='m3'`);
    expect((await query(703)).q).toBeUndefined();
    expect(
        (await pool.query(`select "ownerMarchUUid" from opencok_kingdom.worldpoint where id=703`))
            .rows[0].ownerMarchUUid,
    ).toBe("m3");
    const before = await query(737);
    store = createWorldPointDetailStore(databases, 1);
    expect(await query(737)).toEqual(before);
});

test("persisted territory defenses expose counts and capacity without troop or team mutations", async () => {
    const pool = pools[0]!;
    rules.items.set("building_base", { k5: "100" });
    await pool.query(
        `update opencok_kingdom.worldpoint set "ownerId"=$1,"ownerName"='Owner',"ownerMarchUUid"='defense',"allianceId"='A' where id=714`,
        [owner],
    );
    await pool.query(
        `insert into opencok_kingdom.world_march (uuid,"ownerUid","ownerId",type,"targetId","marchStartTime","worldId",state,"armyInfo") values ('defense',$1,1,0,714,0,9,1,$2)`,
        [owner, army],
    );
    const before = (
        await pool.query(
            `select encode("armyInfo",'hex') as army,state from opencok_kingdom.world_march where uuid='defense'`,
        )
    ).rows;
    const body = await query(714);
    const soldiers = decodeWorldResourceArmy(army)!.soldiers!.reduce(
        (sum, row) => (sum + ((row.total - row.dead) | 0)) | 0,
        0,
    );
    expect(body.alreadySoldier).toEqual(sfs.int(soldiers));
    expect(body.maxSoldier).toEqual(sfs.int(100));
    expect(body.ownerMarchUuid).toEqual(sfs.string("defense"));
    expect(fields(body).owner).toBeDefined();
    expect(
        (
            await pool.query(
                `select encode("armyInfo",'hex') as army,state from opencok_kingdom.world_march where uuid='defense'`,
            )
        ).rows,
    ).toEqual(before);
    await pool.query(`update opencok_kingdom.world_march set "armyInfo"=$1 where uuid='defense'`, [
        Buffer.from([1, 2, 3]),
    ]);
    await expect(query(714)).rejects.toThrow();
    expect(
        (await pool.query(`select state from opencok_kingdom.world_march where uuid='defense'`))
            .rows[0]
            .state,
    ).toBe(1);
});

test("authorization and missing dependencies fail before exposing target state", async () => {
    await pools[0]!.query(`update opencok_kingdom.userprofile set "banFlag"=1 where uid='self'`);
    await expect(query(723, 2)).rejects.toThrow();
    await pools[0]!.query(`update opencok_kingdom.userprofile set "banFlag"=0 where uid='self'`);
    await expect(query(723, 3)).rejects.toThrow();
    await cache.command("SET", "opencok:kingdom:1:turret:t21", "invalid");
    await expect(query(721)).rejects.toThrow("world point detail unavailable");
    expect((await query(723)).point).toEqual(sfs.int(723));
});

test("local observer rejection precedes an unavailable remote point table", async () => {
    await pools[1]!.query(
        `alter table opencok_kingdom.worldpoint rename to worldpoint_unavailable`,
    );

    try
    {
        await pools[0]!.query(
            `update opencok_kingdom.userprofile set "banFlag"=1 where uid='self'`,
        );

        await expect(query(723, 2)).rejects.toMatchObject({ code: "E000000" });

        await pools[0]!.query(
            `update opencok_kingdom.userprofile set "banFlag"=0 where uid='self'`,
        );

        await expect(query(723, 2)).rejects.toThrow("world point detail unavailable");
    }
    finally
    {
        await pools[1]!.query(
            `alter table opencok_kingdom.worldpoint_unavailable rename to worldpoint`,
        );
        await pools[0]!.query(
            `update opencok_kingdom.userprofile set "banFlag"=0 where uid='self'`,
        );
    }

    expect((await query(723, 2)).point).toEqual(sfs.int(723));
});
