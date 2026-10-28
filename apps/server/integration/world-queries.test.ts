import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test";
import { createDatabase } from "@opencok/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { and, asc, eq } from "drizzle-orm";
import * as kingdomSchema from "@opencok/drizzle/schema/kingdom";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { world_favorite } from "@opencok/drizzle/schema/opencok_kingdom/world_favorite";
import { server_info } from "@opencok/drizzle/schema/opencok_global/server_info";
import { acquireRealmAuthority, fenceRealmDatabase } from "@opencok/repositories/realm-authority";
import { createWorldFavoriteStore } from "@opencok/world/repositories/world-favorites";
import { createWorldSearchStore } from "@opencok/world/repositories/world-search";
import { Rules } from "@opencok/rules/game";
import type { GameStore } from "@opencok/contracts/game";
import { fields, sfs, type Value } from "@opencok/messages/sfs";
import { createRealmGameService } from "../src/composition/game";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";

const postgres = new DisposablePostgres();
let local: ReturnType<typeof createDatabase<"kingdom">>;
let remote: ReturnType<typeof createDatabase<"kingdom">>;
let global: ReturnType<typeof createDatabase<"global">>;

beforeAll(async () => {
    const admin = await postgres.start();
    await admin.query("create database \"world_one\"");
    await admin.query("create database \"world_two\"");
    await admin.query("create database \"world_global\"");
    await admin.end();
    local = createDatabase("kingdom", { ...postgres.options, database: "world_one", max: 5 });
    remote = createDatabase("kingdom", { ...postgres.options, database: "world_two", max: 5 });
    global = createDatabase("global", { ...postgres.options, database: "world_global", max: 5 });

    await migrate(local.db, {
        migrationsFolder:
            new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url).pathname,
    });
    await migrate(remote.db, {
        migrationsFolder:
            new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url).pathname,
    });
    await migrate(global.db, {
        migrationsFolder:
            new URL("../../../packages/drizzle/migrations/global", import.meta.url).pathname,
    });
}, 120000);

afterAll(async () => {
    await local?.close();
    await remote?.close();
    await global?.close();
    await postgres.stop();
});

beforeEach(async () => {
    await local.pool.query(
        "truncate opencok_kingdom.userprofile, opencok_kingdom.playerinfo, opencok_kingdom.world_favorite",
    );
    await remote.pool.query("truncate opencok_kingdom.userprofile, opencok_kingdom.playerinfo");
    await global.pool.query("truncate opencok_global.server_info");
    await local.db.insert(userprofile).values([
        { uid: "self", name: "Observer", serverId: 1, level: 1, exp: 0, country: "BR" },
        { uid: "other", name: "Other", serverId: 1, level: 1, exp: 0, country: "BR" },
    ]);
    await global.db.insert(server_info).values([{ id: 1, type: 0 }, { id: 2, type: 4 }]);
});

function rules()
{
    return new Rules(
        new Map(),
        new Map(),
        new Map(),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        undefined,
        undefined,
        undefined,
        { servers: new Map([["1", { id: "1" }], ["2", { id: "2" }]]) },
    );
}

async function favorites()
{
    const db = drizzle(local.pool, { schema: kingdomSchema });
    const authority = await acquireRealmAuthority(db, 1, () => true, 1000);
    fenceRealmDatabase(db, authority);
    let now = 1000;
    const service = createRealmGameService(
        {} as GameStore,
        rules(),
        { kingdomId: 1 },
        () => now++,
        {
            worldFavorites: createWorldFavoriteStore(db, global.db, 1),
        },
    );

    return {
        service,
        add: (name: string) =>
            service.execute("self", "world.favo.add", {
                point: sfs.int(10),
                type: sfs.int(2),
                name: sfs.string(name),
            }),
    };
}

test("favorite writes retain separate persisted and reply clocks and delete only selected owner pairs", async () => {
    await local.db.insert(world_favorite).values([
        { uid: "self", point: 10, server: 2, type: 1, name: "cross-one" },
        { uid: "self", point: 20, server: 1, type: 1, name: "cross-two" },
        { uid: "self", point: 20, server: 2, type: 1, name: "selected" },
        { uid: "other", point: 10, server: 1, type: 1, name: "foreign" },
    ]);
    const h = await favorites();

    const first = await h.add("first");

    expect(first.body.createTime).toEqual(sfs.long(1001));
    expect(
        (await local.db.select().from(world_favorite).where(and(
            eq(world_favorite.uid, "self"),
            eq(world_favorite.point, 10),
            eq(world_favorite.server, 1),
        )))[0]!.createTime,
    ).toBe(1000n);

    const replacement = await h.add("replacement");

    expect(replacement.body.createTime).toEqual(sfs.long(1003));
    expect((await local.db.select().from(world_favorite)).length).toBe(5);
    const listing = await h.service.execute("self", "world.favo.get", {});
    const listed = (listing.body.favo!.value as Value[]).map(fields);
    expect(listed.map((row) => [row.point!.value, row.server!.value])).toEqual([[10, 1], [20, 1], [
        10,
        2,
    ], [20, 2]]);
    expect(listed[2]!.serverType).toEqual(sfs.int(2));
    expect(listed[0]!.createTime).toEqual(sfs.long(1002));

    const removed = await h.service.execute("self", "world.favo.delme", {
        point: sfs.array([sfs.int(10), sfs.int(20), sfs.int(10)]),
        server: sfs.array([sfs.int(1), sfs.int(2), sfs.int(1)]),
    });

    expect(removed.body.state).toEqual(sfs.int(1));
    expect(removed.body.pointArray).toEqual(sfs.array([sfs.int(10), sfs.int(20), sfs.int(10)]));
    expect(
        await local.db.select({
            owner: world_favorite.uid,
            point: world_favorite.point,
            server: world_favorite.server,
        })
            .from(world_favorite).orderBy(asc(world_favorite.uid), asc(world_favorite.point)),
    ).toEqual([
        { owner: "other", point: 10, server: 1 },
        { owner: "self", point: 10, server: 2 },
        { owner: "self", point: 20, server: 1 },
    ]);
});

test("realm takeover fences favorite add delete and locked list through the existing database wrapper", async () => {
    const old = await favorites();
    await old.add("original");
    const replacement = await favorites();

    await expect(old.add("stale")).rejects.toThrow();
    await expect(old.service.execute("self", "world.favo.get", {})).rejects.toThrow();
    await expect(old.service.execute("self", "world.favo.delme", {
        point: sfs.array([sfs.int(10)]),
        server: sfs.array([sfs.int(1)]),
    })).rejects.toThrow();
    expect((await local.db.select().from(world_favorite))[0]!.name).toBe("original");

    const updated = await replacement.add("current");

    expect(updated.body.state).toEqual(sfs.int(1));
    expect((await local.db.select().from(world_favorite)).map((row) => row.name)).toEqual([
        "current",
    ]);
});

test("remote world search uses real SQL wildcards after authenticating the local observer", async () => {
    await remote.db.insert(userprofile).values([
        { uid: "a", name: "A_Keep", serverId: 2, level: 1, exp: 0, country: "BR", banTime: 1001n },
        {
            uid: "b",
            name: "A_Keep",
            serverId: 2,
            level: 1,
            exp: 0,
            country: "BR",
            banTime: 9223372036854775807n,
        },
        { uid: "c", name: "A_Keep", serverId: 2, level: 1, exp: 0, country: "BR", banTime: null },
        { uid: "d", name: "AbKeep", serverId: 2, level: 1, exp: 0, country: "BR", banTime: 0n },
    ]);
    await remote.db.insert(playerinfo).values({ uid: "a", power: 9007199254740993n });
    const kingdoms = new Map([[1, local], [2, remote]]);
    const store = createWorldSearchStore({
        kingdoms,
        getKingdom: (id) => {
            const kingdom = kingdoms.get(id);

            if (!kingdom)
            {
                throw new Error("Unconfigured synthetic realm");
            }

            return kingdom;
        },
    }, 1);
    const service = createRealmGameService({} as GameStore, rules(), { kingdomId: 1 }, () => 1000, {
        worldSearch: store,
    });

    const result = await service.execute("self", "world.search.user", {
        name: sfs.string("A_%"),
        serverId: sfs.int(2),
        _cok_: sfs.string("correlation"),
    });

    const rows = (result.body.list!.value as Value[]).map(fields);
    expect(rows.map((row) => row.uid!.value)).toEqual(["a", "d"]);
    expect(rows[0]!.power).toEqual(sfs.long(9007199254740993n));
    expect(result.body._cok_).toEqual(sfs.string("correlation"));
    expect(result.pushes).toEqual([]);

    await local.db.update(userprofile).set({ banFlag: 1 }).where(eq(userprofile.uid, "self"));

    await expect(service.execute("self", "world.search.user", { serverId: sfs.int(2) })).rejects
        .toThrow();
});
