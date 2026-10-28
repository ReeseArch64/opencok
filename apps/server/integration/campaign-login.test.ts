import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { anniversaryDomain } from "@opencok/services/anniversary";
import { publishCampaignNotice } from "@opencok/services/campaign-notice";
import { createCampaignAudience } from "@opencok/repositories/campaign-notice";
import { relayMutationEvent } from "@opencok/repositories/mutation";
import { readCampaignNotice } from "@opencok/mappings/campaign-notice";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { flower_info } from "@opencok/drizzle/schema/opencok_kingdom/flower_info";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    const h = await cityHarness([anniversaryDomain]);
    h.clock.now = Date.UTC(2030, 0, 1, 12);
    await h.db.db
        .insert(alliance)
        .values({
            uid: "guild",
            alliancename: "Keepers",
            createtime: 1n,
            bannerStyle: "synthetic",
        });
    await h.db.db
        .update(userprofile)
        .set({ allianceId: "guild", name: "Leader" })
        .where(eq(userprofile.uid, "owner"));
    await h.db.db
        .update(userprofile)
        .set({ allianceId: "guild", name: "Member" })
        .where(eq(userprofile.uid, "other"));
    await h.db.db.insert(alliance_member).values([
        { uid: "owner", allianceId: "guild", rank: 5 },
        { uid: "other", allianceId: "guild", rank: 1 },
    ]);
    await h.db.db.insert(flower_info).values({ uid: "owner", lastflowerRanking: 1 });
    return {
        ...h,
        login: (id = randomUUID()) => h.command("campaign.init", { operationId: sfs.string(id) }),
        notices: async () =>
            (await h.db.db.select().from(mutation_outbox)).filter(
                (row) => row.eventType === "campaign.notice",
            ),
    };
}
test(
    "maintained login campaigns preserve personal daily quotas and distinct native realm and alliance notices",
    async () => {
        const h = await fixture();
        try
        {
            expect(h.rules.advanced.campaignRules).toHaveLength(272);
            const id = randomUUID();
            await h.login(id);
            await h.login(id);
            await h.login();
            const notices = await h.notices();
            expect(notices).toHaveLength(2);
            const data = notices.map((row) => readCampaignNotice(row.payload, "owner"));
            expect(data.find((row) => row.scope === 1)?.message).toEqual({
                msgId: "9440792",
                para: ["Leader"],
            });
            expect(data.find((row) => row.scope === 2)?.message).toEqual({
                msgId: "9440790",
                para: ["Keepers", "Leader"],
            });
            expect(
                (await h.db.db.select().from(trigger_var))
                    .filter((row) =>
                        ["long_union_marquees", "long_flower_rank_times"].includes(row.key)
                    )
                    .map((row) => row.value),
            ).toEqual(["1", "1"]);
            h.clock.now += 86400000;
            await h.login();
            expect(await h.notices()).toHaveLength(4);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "campaign notices reach only current eligible online home profiles and matching alliance members",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(userprofile).values(
                [
                    { uid: "foreign", serverId: 2, allianceId: "guild" },
                    { uid: "visiting", serverId: 1, allianceId: "guild", crossFightSrcServerId: 2 },
                    { uid: "banned", serverId: 1, allianceId: "guild", banFlag: 1 },
                    { uid: "stranger", serverId: 1 },
                    { uid: "mismatch", serverId: 1, allianceId: "guild" },
                ].map((row) => ({ ...row, name: "Synthetic", country: "BR", level: 1, exp: 0 })),
            );
            await h.db.db.insert(alliance_member).values([
                { uid: "foreign", allianceId: "guild", rank: 1 },
                { uid: "visiting", allianceId: "guild", rank: 1 },
                { uid: "banned", allianceId: "guild", rank: 1 },
                { uid: "mismatch", allianceId: "other-guild", rank: 1 },
            ]);
            await h.login();
            const online = [
                    "owner",
                    "other",
                    "foreign",
                    "visiting",
                    "banned",
                    "stranger",
                    "mismatch",
                ],
                audience = createCampaignAudience(h.db.db, h.authority);
            for (const event of await h.notices())
            {
                const delivered: { uid: string; command: string; body: Fields; }[] = [];
                await publishCampaignNotice(
                    event.payload,
                    "owner",
                    online,
                    audience,
                    async (uid, command, body) => {
                        delivered.push({ uid, command, body });
                    },
                    h.clock.now,
                );
                const notice = readCampaignNotice(event.payload, "owner");
                expect(delivered.map((row) => row.uid).toSorted()).toEqual(
                    notice.scope === 1
                        ? ["other", "owner"]
                        : ["mismatch", "other", "owner", "stranger"],
                );
                expect(
                    delivered.every(
                        (row) =>
                            row.command === "push.common.notice"
                            && row.body.msgId?.value === notice.message.msgId,
                    ),
                ).toBe(true);
                expect(delivered[0]?.body.para).toEqual(
                    sfs.array(notice.message.para.map((value) => sfs.string(value))),
                );
            }
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "failed notice admission rolls back both daily counters and its outbox before retry",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.pool.query(
                `create function reject_campaign_notice() returns trigger language plpgsql as $$ begin if new."eventType"='campaign.notice' then raise exception 'synthetic notice failure'; end if; return new; end $$`,
            );
            await h.db.pool.query(
                `create trigger reject_campaign_notice before insert on opencok_kingdom.mutation_outbox for each row execute function reject_campaign_notice()`,
            );
            const id = randomUUID();
            await expect(h.login(id)).rejects.toThrow();
            expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
            expect(await h.notices()).toHaveLength(0);
            await h.db.pool.query(
                `drop trigger reject_campaign_notice on opencok_kingdom.mutation_outbox`,
            );
            await h.login(id);
            expect(await h.notices()).toHaveLength(2);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "missing ranking eligibility or stale membership cannot manufacture a login announcement",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.update(flower_info).set({ lastflowerRanking: 2 });
            await h.db.db.update(alliance_member).set({ rank: 4 }).where(
                eq(alliance_member.uid, "owner"),
            );
            await h.login();
            expect(await h.notices()).toHaveLength(0);
            await h.db.db.update(flower_info).set({ lastflowerRanking: 1 });
            await h.db.db.update(alliance_member).set({ rank: 5 }).where(
                eq(alliance_member.uid, "owner"),
            );
            await h.db.db
                .update(userprofile)
                .set({ allianceId: "missing" })
                .where(eq(userprofile.uid, "owner"));
            await h.login();
            const data = (await h.notices()).map((row) => readCampaignNotice(row.payload, "owner"));
            expect(data.map((row) => row.scope)).toEqual([2]);
            expect(data[0]?.message.para).toEqual(["", "Leader"]);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "maintained kingwar login gifts require the saved castle and period, stop at the declared cap and replay safely",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.advanced.campaignRules = h.rules.advanced.campaignRules!.filter(
                (rule) => rule.id === 2500,
            );
            h.clock.now = Date.UTC(2024, 10, 8, 12);
            await h.login();
            expect(await h.db.db.select().from(user_item)).toHaveLength(0);
            await h.db.db
                .update(user_building)
                .set({ level: 20 })
                .where(and(eq(user_building.uid, "owner"), eq(user_building.itemId, 400000)));
            const id = randomUUID();
            await h.login(id);
            const first = await h.db.db.select().from(user_item);
            expect(first.length).toBeGreaterThan(0);
            await h.login(id);
            expect(await h.db.db.select().from(user_item)).toEqual(first);
            await h.login();
            const second = await h.db.db.select().from(user_item);
            await h.login();
            expect(await h.db.db.select().from(user_item)).toEqual(second);
            expect(
                (
                    await h.db.db
                        .select()
                        .from(trigger_var)
                        .where(eq(trigger_var.key, "long_kingwar_testitem_sent_2"))
                )[0]?.value,
            ).toBe("2");
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "a login notice waits for its actor session and its durable relay resumes without publishing an expired login",
    async () => {
        const h = await fixture();
        try
        {
            await h.login();
            const audience = createCampaignAudience(h.db.db, h.authority),
                sent: string[] = [];
            await expect(
                relayMutationEvent(
                    h.db.db,
                    h.authority,
                    (event) =>
                        publishCampaignNotice(
                            event.payload,
                            event.owner,
                            [],
                            audience,
                            async (uid) => {
                                sent.push(uid);
                            },
                            h.clock.now,
                        ),
                    () => h.clock.now,
                    "campaign.notice",
                    1000,
                ),
            ).rejects.toThrow();
            expect(sent).toEqual([]);
            expect((await h.notices()).filter((row) => row.publishedAt > 0n)).toHaveLength(0);
            h.clock.now += 1000;
            await relayMutationEvent(
                h.db.db,
                h.authority,
                (event) =>
                    publishCampaignNotice(
                        event.payload,
                        event.owner,
                        ["owner", "other"],
                        audience,
                        async (uid) => {
                            sent.push(uid);
                        },
                        h.clock.now,
                    ),
                () => h.clock.now,
                "campaign.notice",
                1000,
            );
            expect(sent.length).toBeGreaterThan(0);
            const before = [...sent];
            h.clock.now += 300000;
            await relayMutationEvent(
                h.db.db,
                h.authority,
                (event) =>
                    publishCampaignNotice(
                        event.payload,
                        event.owner,
                        ["owner", "other"],
                        audience,
                        async (uid) => {
                            sent.push(uid);
                        },
                        h.clock.now,
                    ),
                () => h.clock.now,
                "campaign.notice",
                1000,
            );
            expect(sent).toEqual(before);
            expect((await h.notices()).every((row) => row.publishedAt > 0n)).toBe(true);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "the maintained later cake campaign consumes its owned item and applies its own status window",
    async () => {
        const h = await fixture();
        try
        {
            h.clock.now = Date.UTC(2024, 8, 15, 12);
            await h.db.db.insert(user_item).values({
                uuid: "later-cake",
                ownerId: "owner",
                itemId: "212024",
                count: 2,
                value: 0,
                vanishTime: 0n,
            });
            const id = randomUUID(),
                params = {
                    type: sfs.int(45),
                    uid: sfs.string("owner"),
                    operationId: sfs.string(id),
                };
            expect((await h.command("trigger.activity", params)).body.type).toEqual(sfs.int(45));
            await h.command("trigger.activity", params);
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "later-cake")))[0]
                    ?.count,
            ).toBe(1);
            expect(
                (await h.db.db.select().from(user_state).where(eq(user_state.stateId, 509877)))[0],
            ).toMatchObject({ uid: "owner", count: 1 });
            expect(
                (await h.db.db.select().from(trigger_var)).find(
                    (row) => row.key === "long_3th_anniversary_use_cake_total_count",
                ),
            ).toBeUndefined();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
