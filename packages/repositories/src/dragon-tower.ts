import { and, asc, desc, eq, gt, gte, sql } from "drizzle-orm";
import { dragon_tower_user } from "@opencok/drizzle/schema/opencok_kingdom/dragon_tower_user";
import { dragon_tower_layer } from "@opencok/drizzle/schema/opencok_kingdom/dragon_tower_layer";
import { dragon_tower_buff } from "@opencok/drizzle/schema/opencok_kingdom/dragon_tower_buff";
import { dragon_tower_fightreport } from "@opencok/drizzle/schema/opencok_kingdom/dragon_tower_fightreport";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { num, long, text } from "@opencok/contracts/rows";
import type { DragonTowerState, DragonTowerWrite } from "@opencok/contracts/dragon-tower";
import { towerFailure, towerWeekStart } from "@opencok/rules/dragon-tower";
import { cityInteger } from "@opencok/rules/city-progression";
import { decode, str, int } from "@opencok/messages/sfs";
import type { MutationTransaction } from "./mutation";

export async function readDragonTower(
    tx: MutationTransaction,
    owner: string,
    now: bigint,
    realm: number,
    request?: Uint8Array,
): Promise<DragonTowerState>
{
    const [user] = await tx
        .select()
        .from(dragon_tower_user)
        .where(eq(dragon_tower_user.uid, owner))
        .for("update");
    const layers = await tx
        .select()
        .from(dragon_tower_layer)
        .where(eq(dragon_tower_layer.uid, owner))
        .orderBy(asc(dragon_tower_layer.layer))
        .limit(1025)
        .for("update");
    const buffs = await tx
        .select()
        .from(dragon_tower_buff)
        .where(eq(dragon_tower_buff.uid, owner))
        .orderBy(asc(dragon_tower_buff.buffid))
        .limit(129)
        .for("update");

    if (layers.length > 1024 || buffs.length > 128)
    {
        towerFailure();
    }

    const [server] = await tx
        .select({ at: server_info.activityTime })
        .from(server_info)
        .where(eq(server_info.uid, "server"));
    const weekly = gte(dragon_tower_user.weeklyresettime, towerWeekStart(now));
    const [ranks] = await tx
        .select({
            max: sql<number>`coalesce(max(${dragon_tower_user.maxlayer}),0)::int`,
            rankMax: sql<number>`count(*) filter (where ${dragon_tower_user.maxlayer} > ${
                num(user ?? {}, "maxlayer")
            } or (${dragon_tower_user.maxlayer} = ${
                num(user ?? {}, "maxlayer")
            } and ${dragon_tower_user.uid} > ${owner}))::int`,
            rankWeekly: sql<
                number
            >`count(*) filter (where ${weekly} and (${dragon_tower_user.weeklymaxlayer} > ${
                num(user ?? {}, "weeklymaxlayer")
            } or (${dragon_tower_user.weeklymaxlayer} = ${
                num(user ?? {}, "weeklymaxlayer")
            } and ${dragon_tower_user.uid} > ${owner})))::int`,
        })
        .from(dragon_tower_user)
        .innerJoin(userprofile, eq(userprofile.uid, dragon_tower_user.uid))
        .where(eq(userprofile.serverId, realm));
    const result: DragonTowerState = {
        user,
        layers,
        buffs,
        serverOpenedAt: server?.at ?? 0n,
        rankMax: user && (user.maxlayer ?? 0) > 0 ? Number(ranks?.rankMax ?? 0) + 1 : -1,
        rankWeekly: user && (user.weeklymaxlayer ?? 0) > 0
                && long(user, "weeklyresettime") >= towerWeekStart(now)
            ? Number(ranks?.rankWeekly ?? 0) + 1
            : -1,
        historyMax: Number(ranks?.max ?? 0),
    };
    const params = request ? decode(Buffer.from(request)) : {},
        action = str(params, "M__REQUEST_ID__H", "");

    if (action === "ranking")
    {
        const list = (key: "maxlayer" | "weeklymaxlayer") =>
            tx
                .select({
                    uid: userprofile.uid,
                    username: userprofile.name,
                    pic: userprofile.pic,
                    picVer: userprofile.picVer,
                    picfraId: userprofile.picfraId,
                    alliancename: alliance.alliancename,
                    abbr: alliance.abbr,
                    maxlayer: dragon_tower_user[key],
                })
                .from(dragon_tower_user)
                .innerJoin(userprofile, eq(userprofile.uid, dragon_tower_user.uid))
                .leftJoin(alliance, eq(alliance.uid, userprofile.allianceId))
                .where(
                    and(
                        eq(userprofile.serverId, realm),
                        gt(dragon_tower_user[key], 0),
                        ...(key === "weeklymaxlayer" ? [weekly] : []),
                    ),
                )
                .orderBy(desc(dragon_tower_user[key]), desc(dragon_tower_user.uid))
                .limit(1024);
        result.weeklyRanking = await list("weeklymaxlayer");
        result.historyRanking = await list("maxlayer");
    }

    if (["report", "reportsimple"].includes(action))
    {
        const layer = cityInteger(int(params, "layer"), 1, 1024) + 84500;
        result.reports = await tx
            .select()
            .from(dragon_tower_fightreport)
            .where(
                and(
                    eq(dragon_tower_fightreport.layer, layer),
                    ...(action === "report"
                        ? [
                            eq(
                                dragon_tower_fightreport.citylevel,
                                cityInteger(int(params, "citylevel"), 1, 127),
                            ),
                        ]
                        : []),
                ),
            )
            .orderBy(asc(dragon_tower_fightreport.citylevel))
            .limit(128);
    }

    return result;
}

export async function writeDragonTower(
    tx: MutationTransaction,
    owner: string,
    write: DragonTowerWrite,
)
{
    if (write.user)
    {
        const row = write.user;

        if (row.uid !== owner)
        {
            towerFailure();
        }

        const value = {
            uid: owner,
            currentlayer: num(row, "currentlayer"),
            weeklymaxlayer: num(row, "weeklymaxlayer"),
            maxlayer: num(row, "maxlayer"),
            weeklyrevive: num(row, "weeklyrevive"),
            resettimes: num(row, "resettimes"),
            dailyresettime: long(row, "dailyresettime"),
            weeklyresettime: long(row, "weeklyresettime"),
            dragon: text(row, "dragon"),
            army: text(row, "army"),
            deadarmy: text(row, "deadarmy"),
            armyrevivenum: num(row, "armyrevivenum"),
            armyrevive: text(row, "armyrevive"),
            armyrevivecd: long(row, "armyrevivecd"),
            score: num(row, "score"),
            sharetimes: num(row, "sharetimes"),
            generalid: num(row, "generalid"),
        };
        await tx
            .insert(dragon_tower_user)
            .values(value)
            .onConflictDoUpdate({ target: dragon_tower_user.uid, set: value });
    }

    for (const row of write.layers ?? [])
    {
        if (row.uid !== owner)
        {
            towerFailure();
        }

        const value = {
            uid: owner,
            layer: num(row, "layer"),
            difficulty: num(row, "difficulty"),
            monsters: text(row, "monsters"),
            currentmonster: num(row, "currentmonster"),
            buff: text(row, "buff"),
            buybuff: num(row, "buybuff"),
            awards: text(row, "awards"),
            awardstate: num(row, "awardstate"),
            layerstate: num(row, "layerstate"),
            fighttime: long(row, "fighttime"),
        };
        await tx
            .insert(dragon_tower_layer)
            .values(value)
            .onConflictDoUpdate({
                target: [dragon_tower_layer.uid, dragon_tower_layer.layer],
                set: value,
            });
    }

    if (write.buffs)
    {
        await tx.delete(dragon_tower_buff).where(eq(dragon_tower_buff.uid, owner));

        for (const row of write.buffs)
        {
            if (row.uid !== owner)
            {
                towerFailure();
            }

            await tx.insert(dragon_tower_buff).values({
                uid: owner,
                buffid: num(row, "buffid"),
                remainlayers: num(row, "remainlayers"),
                buytime: long(row, "buytime"),
            });
        }
    }
}
