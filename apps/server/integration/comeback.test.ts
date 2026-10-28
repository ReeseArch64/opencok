import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { comebackDomain, planComebackLogin } from "@opencok/services/comeback";
import {
    createComebackSessions,
    readComebackSession,
} from "@opencok/repositories/comeback-session";
import { executeInventoryTransaction } from "@opencok/repositories/inventory";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { readActivityOperators } from "@opencok/repositories/activity-operators";
import { activityOperators } from "@opencok/rules/activity-operators";
import { comebackSessionKey } from "@opencok/rules/comeback";
import { user_comeback_record } from "@opencok/drizzle/schema/opencok_kingdom/user_comeback_record";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { fields, sfs, encode, int, type Value, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
const day = 86400000;
async function fixture()
{
    const h = await cityHarness([comebackDomain]);
    h.clock.now = Date.UTC(2030, 0, 1, 12);
    const sessions = createComebackSessions(
        h.db.db,
        h.authority,
        (tx, owner, now) =>
            executeInventoryTransaction(
                tx,
                owner,
                (state) =>
                    planComebackLogin(
                        state,
                        h.rules,
                        h.effects,
                        now,
                        (economy) =>
                            h.handlers.command(
                                tx,
                                owner,
                                "comeback.init",
                                encode({}),
                                now,
                                economy,
                            ),
                    ),
                "comeback.init",
            ),
    );
    const open = (owner = "owner", id = randomUUID()) => sessions.open(owner, id, h.clock.now);
    const profile = async (owner = "owner") =>
        (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, owner)))[0]!;
    const records = () => h.db.db.select().from(user_comeback_record);
    const claim = (type: number, param = "", extra: Fields = {}, owner = "owner") =>
        h.command(
            "comeback.reward",
            { type: sfs.string(String(type)), param: sfs.string(param), ...extra },
            owner,
        );
    return { ...h, sessions, open, profile, records, claim };
}
test(
    "legacy return enrollment, welcome mail, clocks and native claims are atomic, bounded and replay safe",
    async () => {
        const h = await fixture();
        try
        {
            const before = BigInt(h.clock.now - 8 * day);
            await h.db.db
                .update(userprofile)
                .set({ lastOnlineTime: before, deviceId: "synthetic-device" })
                .where(eq(userprofile.uid, "owner"));
            const id = randomUUID();
            await h.open("owner", id);
            await h.open("owner", id);
            expect(await h.records()).toHaveLength(1);
            expect((await h.records())[0]).toMatchObject({
                uid: "owner",
                configId: "9010001",
                backType: 1,
                backTime: BigInt(h.clock.now),
                backReward: 0,
            });
            expect(await h.db.db.select().from(mail)).toHaveLength(1);
            expect((await h.profile()).lastOnlineTime).toBe(BigInt(h.clock.now));
            expect((await h.profile()).gold).toBe(100000n);
            const saved = await h.db.db.transaction((tx) => readComebackSession(tx, "owner"));
            expect(saved).toMatchObject({
                previousOnlineAt: before,
                devicePreviousOnlineAt: before,
                openedAt: BigInt(h.clock.now),
            });
            expect((await h.command("comeback.init", {})).body.login_popup).toEqual(sfs.int(57083));
            const info = (await h.command("comeback.info", {})).body;
            expect(info.count).toEqual(sfs.int(2));
            expect(fields(info.active1).state).toEqual(sfs.bool(false));
            expect(fields(info.active1).endTime).toEqual(
                sfs.long((BigInt(h.clock.now) + 7n * BigInt(day)) / 1000n),
            );
            const daily = (fields(info.active2).dailies!.value as Value[]).map(fields);
            expect(daily.map((row) => int(row, "state"))).toEqual([1, 0, 0, 0, 0, 0, 0]);
            expect((await h.command("comeback.init", {})).body.login_popup).toBeUndefined();
            await expect(h.claim(2, "2")).rejects.toThrow();
            await expect(h.claim(3, "1", { payTotal: sfs.long(1000000) })).rejects.toThrow();
            await expect(h.claim(2, "0")).rejects.toThrow();
            const operationId = sfs.string(randomUUID());
            const welcome = await h.claim(1, "", { operationId });
            expect(await h.claim(1, "", { operationId })).toEqual(welcome);
            expect(welcome.body.type).toEqual(sfs.string("1"));
            const racing = await Promise.allSettled([h.claim(2, "1"), h.claim(2, "1")]);
            expect(racing.filter((row) => row.status === "fulfilled")).toHaveLength(1);
            expect((await h.records())[0]).toMatchObject({ backReward: 1, dailyReward: "1" });
            expect((await h.profile()).gold).toBe(100200n);
            expect(
                (
                    await h.db.db
                        .select()
                        .from(user_item)
                        .where(and(eq(user_item.ownerId, "owner"), eq(user_item.itemId, "200001")))
                )[0]?.count,
            ).toBe(1);
            const postings = await h.db.db.select().from(economy_posting);
            expect(
                postings.some((row) =>
                    row.asset === "profile.gold" && row.after - row.before === 100n
                ),
            ).toBe(true);
            expect(await h.db.db.select().from(mutation_outbox)).not.toHaveLength(0);
            await expect(h.claim(1)).rejects.toThrow();
            await expect(h.claim(1, "", {}, "other")).rejects.toThrow();
            h.clock.now += day;
            const beforeRecords = await h.records(),
                beforeItems = await h.db.db.select().from(user_item),
                beforeGold = (await h.profile()).gold;
            await h.db.pool.query(
                "create function reject_comeback() returns trigger language plpgsql as $$ begin raise exception 'synthetic rollback'; end $$",
            );
            await h.db.pool.query(
                "create trigger reject_comeback before insert on opencok_kingdom.command_receipt for each row execute function reject_comeback()",
            );
            await expect(h.claim(2, "2")).rejects.toThrow();
            expect(await h.records()).toEqual(beforeRecords);
            expect(await h.db.db.select().from(user_item)).toEqual(beforeItems);
            expect((await h.profile()).gold).toBe(beforeGold);
            await h.db.pool.query(
                "drop trigger reject_comeback on opencok_kingdom.command_receipt",
            );
            await h.claim(2, "2");
            expect((await h.records())[0]?.dailyReward).toBe("1;2");
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "unknown TS history, zero, future and absent device clocks cannot manufacture inactivity",
    async () => {
        const h = await fixture();
        try
        {
            await h.command("comeback.info", {});
            await h.db.db
                .update(userprofile)
                .set({
                    lastOnlineTime: BigInt(h.clock.now - 100 * day),
                    deviceId: "synthetic-device",
                })
                .where(eq(userprofile.uid, "owner"));
            await h.open();
            expect(await h.records()).toHaveLength(0);
            expect(
                (await h.db.db.transaction((tx) => readComebackSession(tx, "owner")))
                    ?.previousOnlineAt,
            ).toBe(BigInt(h.clock.now));
            for (const previous of [0n, BigInt(h.clock.now + day), BigInt(h.clock.now - 100 * day)])
            {
                await h.db.db.delete(trigger_var).where(eq(trigger_var.uid, "other"));
                await h.db.db.delete(command_receipt).where(eq(command_receipt.ownerUid, "other"));
                await h.db.db
                    .update(userprofile)
                    .set({
                        lastOnlineTime: previous,
                        deviceId: previous === BigInt(h.clock.now - 100 * day)
                            ? null
                            : "other-device",
                    })
                    .where(eq(userprofile.uid, "other"));
                await h.open("other");
                expect(await h.records()).toHaveLength(0);
            }
            await h.db.db.insert(userprofile).values(
                Array.from({ length: 256 }, (_, index) => ({
                    uid: `synthetic-peer-${index}`,
                    name: "Synthetic",
                    country: "BR",
                    level: 1,
                    exp: 0,
                    serverId: 1,
                    deviceId: "synthetic-device",
                })),
            );
            const clockBefore = (await h.profile()).lastOnlineTime;
            await expect(h.open()).rejects.toThrow("bound");
            expect((await h.profile()).lastOnlineTime).toBe(clockBefore);
            h.clock.now += 100 * day;
            expect((await h.command("comeback.info", {})).body.count).toEqual(sfs.int(0));
            expect(await h.records()).toHaveLength(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "real session observations and closes capture the next absence, reject stale sockets and fence old realm owners",
    async () => {
        const h = await fixture();
        try
        {
            const old = randomUUID(),
                current = randomUUID();
            await h.open("owner", old);
            h.clock.now += day;
            await h.sessions.observe("owner", old, h.clock.now);
            h.clock.now += day;
            await h.open("owner", current);
            await h.sessions.close("owner", old, h.clock.now + 1000);
            const saved = await h.db.db.transaction((tx) => readComebackSession(tx, "owner"));
            expect(saved?.sessionId).toBe(current);
            expect(saved?.closedAt).toBe(0n);
            h.clock.now += 1000;
            await h.sessions.close("owner", current, h.clock.now);
            expect((await h.profile()).offLineTime).toBe(BigInt(h.clock.now));
            await h.db.db
                .update(userprofile)
                .set({ deviceId: "synthetic-device" })
                .where(eq(userprofile.uid, "owner"));
            h.clock.now += 8 * day;
            await h.open();
            expect((await h.records())[0]?.backType).toBe(1);
            await acquireRealmAuthority(h.db.db, 1, () => true);
            const clockBefore = (await h.profile()).lastOnlineTime;
            await expect(h.sessions.observe("owner", randomUUID(), h.clock.now + 1000)).rejects
                .toThrow();
            expect((await h.profile()).lastOnlineTime).toBe(clockBefore);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "trusted forced enrollment rolls back flags, clocks and welcome mail together and never auto-grants rewards",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.update(userprofile).set({ backFlag_op: 1 }).where(
                eq(userprofile.uid, "owner"),
            );
            await h.db.pool.query(
                "create function reject_comeback() returns trigger language plpgsql as $$ begin raise exception 'synthetic rollback'; end $$",
            );
            await h.db.pool.query(
                "create trigger reject_comeback before insert on opencok_kingdom.command_receipt for each row execute function reject_comeback()",
            );
            const id = randomUUID();
            await expect(h.open("owner", id)).rejects.toThrow();
            expect((await h.profile()).backFlag_op).toBe(1);
            expect((await h.profile()).lastOnlineTime).toBe(0n);
            expect(await h.records()).toHaveLength(0);
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
            expect(
                await h.db.db.select().from(trigger_var).where(
                    eq(trigger_var.key, comebackSessionKey),
                ),
            ).toHaveLength(0);
            await h.db.pool.query(
                "drop trigger reject_comeback on opencok_kingdom.command_receipt",
            );
            await h.open("owner", id);
            expect((await h.records())[0]?.backType).toBe(4);
            expect((await h.profile()).backFlag_op).toBe(0);
            expect((await h.profile()).gold).toBe(100000n);
            expect(await h.db.db.select().from(user_item)).toHaveLength(0);
            expect(await h.db.db.select().from(mail)).toHaveLength(1);
            h.clock.now += 8 * day;
            await h.open();
            expect(await h.records()).toHaveLength(1);
            expect((await h.command("comeback.info", {})).body.count).toEqual(sfs.int(0));
            await expect(h.claim(1)).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "device return inheritance uses each character's prior activity and operator projection reads owned enrollment without mutation",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db
                .update(userprofile)
                .set({
                    lastOnlineTime: BigInt(h.clock.now - 8 * day),
                    deviceId: "synthetic-device",
                });
            await Promise.all([h.open("owner"), h.open("other")]);
            expect((await h.records()).map((row) => row.backType)).toEqual([1, 1]);
            h.rules.advanced.activityPages = new Map([["57083", { id: "57083", Type: "21" }]]);
            h.rules.power.activityPanels!.set("57083", {
                ...h.rules.power.activityPanels!.get("57083")!,
                end: "2030-01-03-00-00",
            });
            const snapshot = await readActivityOperators(h.db.db, "owner", h.clock.now);
            const before = await h.db.db.select().from(command_receipt);
            expect(snapshot.comeback?.uid).toBe("owner");
            expect(Object.keys(snapshot.comeback!).sort()).toEqual(["backTime", "configId", "uid"]);
            expect(
                activityOperators(h.rules, snapshot, {
                    now: h.clock.now,
                    kingdomId: 1,
                    version: "12.06.0",
                }),
            ).toEqual([{ id: 57083, endTime: BigInt(Date.UTC(2030, 0, 3)) / 1000n }]);
            expect(await h.db.db.select().from(command_receipt)).toEqual(before);
            const index = await h.db.pool.query(
                "select indexdef from pg_indexes where schemaname='opencok_kingdom' and indexname='user_comeback_record_device_backtime'",
            );
            expect(index.rows[0].indexdef).toContain("(\"deviceId\", \"backTime\")");
            h.rules.power.activityPanels!.set("57083", { end: "2023-01-01-00-00" });
            expect(
                activityOperators(h.rules, snapshot, {
                    now: h.clock.now,
                    kingdomId: 1,
                    version: "12.06.0",
                }),
            ).toEqual([]);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
