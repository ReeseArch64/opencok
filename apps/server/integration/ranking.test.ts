import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { readPlayerRanking } from "@opencok/ranking/repositories/ranking";
import { readAllianceRanking } from "@opencok/ranking/repositories/alliance-ranking";
import { readRankingPrivacy } from "@opencok/ranking/repositories/privacy";
import { createRealmRankingService } from "../src/composition/ranking";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs, type Fields, type Value } from "@opencok/messages/sfs";

const postgres = new DisposablePostgres();
const now = 1792756800000;
let pool: Awaited<ReturnType<DisposablePostgres["start"]>>;
let db: ReturnType<typeof drizzle<typeof schema>>;

beforeAll(async () => {
    pool = await postgres.start();

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

    db = drizzle(pool, { schema });
}, 120000);

afterAll(async () => {
    await pool?.end();
    await postgres.stop();
});

beforeEach(async () => {
    await pool.query(`truncate opencok_kingdom.userprofile, opencok_kingdom.playerinfo,
        opencok_kingdom.alliance, opencok_kingdom.alliance_member,
        opencok_kingdom.alliance_science, opencok_kingdom.alliance_vedio,
        opencok_kingdom.user_building, opencok_kingdom.material_cost_ranking,
        opencok_kingdom.user_mixed_info`);
});

async function player(
    uid: string,
    profile: Partial<typeof userprofile.$inferInsert> = {},
    power: Partial<typeof playerinfo.$inferInsert> = {},
)
{
    await db.insert(userprofile).values({
        uid,
        name: uid,
        level: 1,
        exp: 0,
        country: "US",
        serverId: 1,
        ...profile,
    });
    await db.insert(playerinfo).values({ uid, ...power });
}

function fixture(limit = "2")
{
    const rules = new Rules(
        new Map(),
        new Map(),
        new Map(),
        undefined,
        new Map([["ranking", { k1: limit, k2: limit, k4: limit }]]),
        undefined,
        undefined,
        undefined,
        1,
        undefined,
        { serverConfig: new Map([["power_limit", { rankingHideGm: "1" }]]) },
        { allianceSciences: new Map([["1001", { para1: "500", para2: "2.9" }]]) },
    );
    const store = {
        getProfileById: async (uid: string) =>
            (await db.select().from(userprofile).where(eq(userprofile.uid, uid)).limit(1))[0],
        playerRanking: (uid: string, query: Parameters<typeof readPlayerRanking>[2]) =>
            readPlayerRanking(db, uid, query),
        allianceRanking: (uid: string, query: Parameters<typeof readAllianceRanking>[2]) =>
            readAllianceRanking(db, uid, query),
    };

    return {
        rules,
        store,
        service: createRealmRankingService(store, rules, { kingdomId: 1 }, () => now),
    };
}

function board(fields: Fields, key = "serverRanking"): Fields[]
{
    const response = decode(encode(fields));

    return (response[key]!.value as Value[]).map((row) => row.value as Fields);
}

test("power snapshots retain C ties and own prefetched ordinal after visibility filters", async () => {
    await player("permanent", { banTime: 9223372036854775807n }, { power: 9007199254740999n });
    await player("gm", { gmFlag: 1 }, { power: 9007199254740998n });
    await player("cross", { crossFightSrcServerId: 2 }, { power: 9007199254740997n });
    await player("temporary", { banTime: BigInt(now + 1) }, { power: 9007199254740996n });
    await player("a", {}, { power: 9007199254740993n });
    await player("A", {}, { power: 9007199254740993n });
    await player("self", {}, { power: 10n });
    await player("null", {}, { power: null });
    const { service } = fixture();

    const result = await service.ranking("self", "power");

    expect(board(result).map((row) => row.uid)).toEqual([sfs.string("A"), sfs.string("a")]);
    expect(board(result)[0]!.power).toEqual(sfs.long(9007199254740993n));
    expect(result.selfRanking).toEqual(sfs.int(3));
});

test("level snapshots order equal experience by C name and uid", async () => {
    await player("z", { name: "A", level: 9, exp: 10 });
    await player("A", { name: "a", level: 9, exp: 10 });
    await player("a", { name: "a", level: 9, exp: 10 });
    await player("self", { name: "Self", level: 9, exp: 11 });
    await player("cross", { level: 10, crossFightSrcServerId: 2 });
    const { service } = fixture("4");

    const result = await service.ranking("self", "level");

    expect(board(result).map((row) => row.uid)).toEqual([
        sfs.string("self"),
        sfs.string("z"),
        sfs.string("A"),
        sfs.string("a"),
    ]);
    expect(result.selfRanking).toEqual(sfs.int(1));
});

test("castle fallback counts higher levels and orders equal-level peers from persisted timestamps", async () => {
    await player("top");
    await player("A");
    await player("B");
    await player("self");
    await pool.query(`insert into opencok_kingdom.user_building
        (uuid,uid,"itemId",pos,level,star,"updateTime") values
        ('top','top',400000,1,31,0,0), ('A','A',400000,1,30,2,null),
        ('B','B',400000,1,30,1,1), ('self','self',400000,1,30,0,2)`);
    const { service } = fixture("1");

    const result = await service.ranking("self", "building");

    expect(board(result).map((row) => row.uid)).toEqual([sfs.string("top")]);
    expect(result.selfRanking).toEqual(sfs.int(4));
});

test("contribution snapshots consume orphan slots and filter bans after the configured window", async () => {
    await player("temporary", { banTime: BigInt(now + 1) });
    await player("self");
    await pool.query(`insert into opencok_kingdom.material_cost_ranking (uid,"contributeSum")
        values ('temporary',100),('orphan',90),('self',80),('outside',70)`);
    const { service } = fixture("3");

    const result = await service.ranking("self", "contribution");

    expect(board(result).map((row) => row.uid)).toEqual([sfs.string("self")]);
    expect(result.myRanking).toEqual(sfs.int(2));
    expect(board(result)[0]!.contributeSum).toEqual(sfs.int(80));
});

test("alliance snapshots retain duplicate leaders and apply scoped science after deterministic ties", async () => {
    await player("self", { allianceId: "A" }, { power: 100n, armyKill: 100n });
    await player("second", { allianceId: "A" }, { power: 100n, armyKill: 100n });
    await player("b", { allianceId: "B" }, { power: 200n, armyKill: 200n });
    await player("c", { allianceId: "C" }, { power: 200n, armyKill: 200n });
    await pool.query(`insert into opencok_kingdom.alliance
        (uid,alliancename,abbr,createtime,"bannerStyle","curMember","maxMember") values
        ('A','A','A',0,'',2,10), ('B','B','B',0,'',2,10), ('C','C','C',0,'',null,10)`);
    await pool.query(`insert into opencok_kingdom.alliance_member (uid,"allianceId",rank)
        values ('self','A',5),('second','A',5),('b','B',5),('c','C',5)`);
    await pool.query(
        `insert into opencok_kingdom.alliance_science ("allianceId","scienceId",level,power)
        values ('A',1000,1,0),('B',1000,1,0)`,
    );
    const { service } = fixture();

    const result = await service.allianceRanking("self", "power");

    expect(board(result, "allianceRanking").map((row) => row.uid)).toEqual([
        sfs.string("C"),
        sfs.string("A"),
    ]);
    expect(board(result, "allianceRanking")[1]!.maxMember).toEqual(sfs.int(12));
    expect(board(result, "allianceRanking")[1]!.nums).toEqual(sfs.int(2));
    expect(result.selfRanking).toEqual(sfs.int(3));
});

test("ranking snapshots keep one database version when another connection updates a score", async () => {
    await player("self", {}, { power: 10n });
    await player("other", {}, { power: 20n });
    const connection = await pool.connect();
    let updated = false;

    try
    {
        const client = {
            query: async (query: string | { text: string; }, params?: unknown[]) => {
                const result = await connection.query(query, params);
                const text = typeof query === "string" ? query : query.text;

                if (
                    !updated && text.includes("\"banFlag\"")
                    && text.includes("from \"opencok_kingdom\".\"userprofile\"")
                )
                {
                    updated = true;
                    await pool.query(
                        "update opencok_kingdom.playerinfo set power=5 where uid='other'",
                    );
                }

                return result;
            },
        };
        const snapshot = await readPlayerRanking(
            drizzle(client as unknown as NodePgClient, { schema }),
            "self",
            {
                kind: "power",
                limit: 2,
                hideGm: true,
                now,
            },
        );

        expect(updated).toBe(true);
        expect(snapshot.candidates.map((row) => row.uid)).toEqual(["other", "self"]);
        expect(snapshot.candidates[0]!.power).toBe(20n);
        expect(snapshot.fallbackRank).toBe(2n);
        expect((await db.select().from(playerinfo).where(eq(playerinfo.uid, "other")))[0]!.power)
            .toBe(5n);
    }
    finally
    {
        connection.release();
    }
});

test("published consumption preserves the injected board callback and persisted privacy", async () => {
    await player("self", { gold: 9007199254740993n });
    await pool.query(
        `insert into opencok_kingdom.user_mixed_info (uid,mdata,"costHide","payHide") values ('self','{}',1,0)`,
    );
    const { rules, store } = fixture();
    rules.features.set("new_rank_cost", { online: "all", version: "1.0.0" });
    const calls: string[] = [];
    const service = createRealmRankingService(
        {
            ...store,
            rankingPrivacy: async (uid, kind) => {
                calls.push(`privacy:${uid}:${kind}`);
                return readRankingPrivacy(db, uid, kind);
            },
        },
        rules,
        { kingdomId: 1 },
        () => now,
        {
            publishedGlobalRanking: async (kind) => {
                calls.push(`authoritative:${kind}`);
                return ["{\"uid\":\"self\",\"rank\":7,\"score\":9007199254740993}"];
            },
        },
    );

    const result = await service.publishedRanking("self", "consumption");

    expect(calls).toEqual(["privacy:self:consumption", "authoritative:consumption"]);
    expect(result.myHide).toEqual(sfs.int(1));
    expect(result.myRank).toEqual(sfs.int(7));
    expect(board(result, "rankList")[0]!.score).toEqual(sfs.long(9007199254740993n));
    expect((await db.select().from(userprofile).where(eq(userprofile.uid, "self")))[0]!.gold).toBe(
        9007199254740993n,
    );
});
