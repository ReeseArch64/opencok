import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { dragonTowerDomain, publishDragonTowerMutation } from "@opencok/services/dragon-tower";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { dragon_tower_user } from "@opencok/drizzle/schema/opencok_kingdom/dragon_tower_user";
import { dragon_tower_layer } from "@opencok/drizzle/schema/opencok_kingdom/dragon_tower_layer";
import { dragon_tower_buff } from "@opencok/drizzle/schema/opencok_kingdom/dragon_tower_buff";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { sfs, fields, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    const h = await cityHarness([dragonTowerDomain]);
    h.clock.now = Date.UTC(2026, 9, 26, 12);
    for (const key of ["dragon_tower", "dragon_tower_heal"])
    {
        h.rules.features.set(key, { id: key, version: "1.0.0", online: "all", test: "all" });
    }
    await h.db.db
        .update(user_building)
        .set({ level: 10 })
        .where(eq(user_building.uuid, "owner-400000"));
    await h.db.db.insert(user_building).values({
        uuid: "tower",
        uid: "owner",
        itemId: 432000,
        pos: 20,
        level: 1,
        refreshTime: BigInt(h.clock.now),
        opType: 0,
    });
    await h.db.db.insert(user_army).values({
        uid: "owner",
        armyId: "107000",
        level: 1,
        free: 1000,
    });
    const command = (action: string, params: Fields = {}) =>
        h.command("dragontower", { M__REQUEST_ID__H: sfs.string(action), ...params });
    const saved = async () => (await h.db.db.select().from(dragon_tower_user))[0]!;
    return { ...h, towerCommand: command, saved };
}
test(
    "tower entry pins offered monsters and share rewards persist once without signed-counter wraparound",
    async () => {
        const h = await fixture();
        try
        {
            const operationId = sfs.string(randomUUID());
            const entries = await Promise.all(
                Array.from({ length: 4 }, () => h.towerCommand("entertower", { operationId })),
            );
            expect(fields(entries[0]!.body.tower).currentlayer).toEqual(sfs.int(1));
            const initialMonsters = fields(entries[0]!.body.layer).monsters;
            expect(fields((await h.towerCommand("entertower")).body.layer).monsters).toEqual(
                initialMonsters,
            );
            expect((await h.db.db.select().from(dragon_tower_layer)).length).toBe(1);
            const shareId = sfs.string(randomUUID());
            await Promise.all(
                Array.from({ length: 4 }, () => h.towerCommand("share", { operationId: shareId })),
            );
            const itemId = h.rules.items.get("dragon_tower")!.k10!;
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.itemId, itemId)))[0]!
                    .count,
            ).toBe(1);
            await h.db.db.update(dragon_tower_user).set({ sharetimes: 127 });
            await h.towerCommand("share");
            expect((await h.saved()).sharetimes).toBe(127);
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.itemId, itemId)))[0]!
                    .count,
            ).toBe(1);
            const beforeGold = (
                await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner"))
            )[0]!.gold;
            for (const action of ["battle", "quickbattle"])
            {
                await expect(
                    h.towerCommand(action, { layer: sfs.int(84501), difficulty: sfs.int(1) }),
                ).rejects.toThrow();
            }
            expect(
                (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!
                    .gold,
            ).toBe(beforeGold);
            expect((await h.saved()).maxlayer).toBe(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "tower virtual armies enforce owned quantities and consume only saved eligible roster buffs",
    async () => {
        const h = await fixture();
        try
        {
            const roster = {
                armys: sfs.array([sfs.object({ id: sfs.int(107000), num: sfs.int(10) })]),
            };
            await h.towerCommand("setarmy", roster);
            expect((await h.saved()).army).toBe("{\"107000\":10}");
            expect((await h.db.db.select().from(user_army))[0]!.free).toBe(1000);
            await expect(h.towerCommand("addarmy", roster)).rejects.toThrow();
            const rule = [...h.rules.advanced.dragonTowerBuffs!.values()].find((row) =>
                row.type === "3"
            )!;
            await h.db.db.update(dragon_tower_layer).set({ layerstate: 3, buff: rule.id });
            await h.db.db.update(dragon_tower_user).set({ score: 10000 });
            const buy = {
                layer: sfs.int(84501),
                buffid: sfs.int(Number(rule.id)),
                operationId: sfs.string(randomUUID()),
            };
            await Promise.all(Array.from({ length: 4 }, () => h.towerCommand("buybuff", buy)));
            expect((await h.db.db.select().from(dragon_tower_buff)).length).toBe(1);
            await h.towerCommand("setarmy", { ...roster, buffid: sfs.int(Number(rule.id)) });
            expect((await h.db.db.select().from(dragon_tower_buff)).length).toBe(0);
            await expect(
                h.towerCommand("setarmy", { ...roster, buffid: sfs.int(Number(rule.id)) }),
            ).rejects.toThrow();
            await h.towerCommand("nextlayer");
            expect((await h.saved()).currentlayer).toBe(84502);
            await h.towerCommand("reset");
            expect((await h.saved()).currentlayer).toBe(84501);
            expect((await h.saved()).resettimes).toBe(1);
            await h.db.db.update(dragon_tower_user).set({ currentlayer: 84502 });
            await expect(h.towerCommand("reset")).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "tower healing recovers its saved deadline once without changing ordinary troops",
    async () => {
        const h = await fixture();
        try
        {
            await h.towerCommand("entertower");
            await h.db.db
                .update(dragon_tower_user)
                .set({
                    army: "{\"107000\":10}",
                    deadarmy: "{\"107000\":1000}",
                    armyrevivenum: 1000,
                });
            const heal = {
                armys: sfs.array([sfs.object({ id: sfs.int(107000), num: sfs.int(500) })]),
                operationId: sfs.string(randomUUID()),
            };
            await Promise.all(Array.from({ length: 4 }, () => h.towerCommand("healarmy", heal)));
            const pending = await h.saved();
            expect(pending.armyrevivecd!).toBeGreaterThan(BigInt(h.clock.now));
            expect(pending.army).toBe("{\"107000\":10}");
            h.clock.now = Number(pending.armyrevivecd);
            const recover = { operationId: sfs.string(randomUUID()) };
            await Promise.all(
                Array.from({ length: 4 }, () => h.command("dragontower.init", recover)),
            );
            const done = await h.saved();
            expect(done.army).toBe("{\"107000\":510}");
            expect(done.deadarmy).toBe("{\"107000\":500}");
            expect(done.armyrevivecd).toBe(0n);
            expect(done.armyrevivenum).toBe(500);
            await h.command("dragontower.init", {});
            expect((await h.saved()).army).toBe(done.army);
            expect((await h.db.db.select().from(user_army))[0]!.free).toBe(1000);
            const events = await h.db.db
                .select()
                .from(mutation_outbox)
                .where(eq(mutation_outbox.eventType, "dragontower.init"));
            expect(events.length).toBe(1);
            const notifications: string[] = [];
            await publishDragonTowerMutation(events[0]!.payload, async (owner, name) => {
                notifications.push(`${owner}:${name}`);
            });
            expect(notifications).toEqual(["owner:push.dragontower.army"]);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "daily and weekly tower resets preserve lifetime progress and reset reward and healing checkpoints",
    async () => {
        const h = await fixture();
        try
        {
            await h.towerCommand("entertower");
            await h.db.db.update(dragon_tower_user).set({
                weeklymaxlayer: 84508,
                maxlayer: 84509,
                sharetimes: 127,
                score: 50,
                armyrevive: "{\"107000\":2}",
                deadarmy: "{\"107000\":2}",
                armyrevivenum: 2,
                armyrevivecd: BigInt(h.clock.now) + 172800000n,
            });
            h.clock.now += 86400000;
            await h.towerCommand("share");
            const daily = await h.saved();
            expect(daily.weeklymaxlayer).toBe(84508);
            expect(daily.maxlayer).toBe(84509);
            expect(daily.sharetimes).toBe(0);
            expect(daily.armyrevivecd).toBe(0n);
            expect(daily.score).toBe(0);
            await h.towerCommand("share");
            expect((await h.saved()).sharetimes).toBe(1);
            h.clock.now += 6 * 86400000;
            await h.towerCommand("entertower");
            const weekly = await h.saved();
            expect(weekly.weeklymaxlayer).toBe(0);
            expect(weekly.maxlayer).toBe(84509);
            await h.db.db
                .update(user_building)
                .set({ level: 9 })
                .where(eq(user_building.uuid, "owner-400000"));
            await expect(h.towerCommand("entertower")).rejects.toThrow();
            expect((await h.command("dragontower.init", {})).body.dragontowerplay).toEqual(
                sfs.bool(false),
            );
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "tower rankings exclude other realms and stored report projections preserve native long fields",
    async () => {
        const h = await fixture();
        try
        {
            await h.towerCommand("entertower");
            await h.db.db.update(dragon_tower_user).set({ weeklymaxlayer: 84502, maxlayer: 84503 });
            await h.db.db.insert(dragon_tower_user).values({
                uid: "other",
                currentlayer: 84580,
                weeklymaxlayer: 84580,
                maxlayer: 84580,
                weeklyresettime: BigInt(h.clock.now),
                dailyresettime: BigInt(h.clock.now),
            });
            await h.db.db.update(userprofile).set({ serverId: 2 }).where(
                eq(userprofile.uid, "other"),
            );
            const ranking = await h.towerCommand("ranking");
            expect((ranking.body.weeklyranking!.value as unknown[]).length).toBe(1);
            expect((ranking.body.historyranking!.value as unknown[]).length).toBe(1);
            expect((await h.towerCommand("maxlayer")).body.historymaxlayer).toEqual(sfs.int(3));
            const { dragon_tower_fightreport } = await import(
                "@opencok/drizzle/schema/opencok_kingdom/dragon_tower_fightreport"
            );
            await h.db.db.insert(dragon_tower_fightreport).values({
                citylevel: 10,
                layer: 84501,
                uid: "owner",
                fighttime: 9007199254740993n,
                citystar: 0,
                difficulty: 2,
                monsterid: 84140,
                playerdead: 0,
                monsterdead: 10,
                report: "{\"createTime\":9007199254740993,\"victory\":true}",
            });
            const summary = await h.towerCommand("reportsimple", { layer: sfs.int(1) });
            const reportRow = fields(
                (summary.body.reportlist!.value as { type: number; value: Fields; }[])[0],
            );
            expect(reportRow.time).toEqual(sfs.long(9007199254740993n));
            const report = await h.towerCommand("report", {
                layer: sfs.int(1),
                citylevel: sfs.int(10),
            });
            expect(report.body.createTime).toEqual(sfs.long(9007199254740993n));
            expect(report.body.owner).toEqual(sfs.string("owner"));
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
