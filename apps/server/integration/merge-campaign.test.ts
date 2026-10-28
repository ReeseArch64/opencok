import { expect, test } from "bun:test";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { createMergeCampaignStore, mergeCampaignActor } from "@opencok/repositories/merge-campaign";
import { createCampaignAudience } from "@opencok/repositories/campaign-notice";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { relayMutationEvent } from "@opencok/repositories/mutation";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { trigger_timmer } from "@opencok/drizzle/schema/opencok_kingdom/trigger_timmer";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_14day_login } from "@opencok/drizzle/schema/opencok_kingdom/user_14day_login";
import { publishMergeEffectBoard } from "@opencok/services/merge-campaign";
import { questsDomain } from "@opencok/services/quests";
import { decodeWorldPowerEffects } from "@opencok/services/power";
import { worldPowerEffects } from "@opencok/rules/power-world";
import { mergeEffectBoard } from "@opencok/mappings/merge-campaign";
import { encode, decode, fields, int, sfs, type Fields, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

const hour = 3600000;
const mergeAt = Date.UTC(2030, 0, 1);
test(
    "merge timers persist exact cadence, serialize concurrent ticks, retain TTL tails, and fence replacement owners",
    async () => {
        const h = await cityHarness();
        try
        {
            const rules = h.rules.advanced.campaignRules ?? [];
            const store = createMergeCampaignStore(h.db.db, h.authority, rules);
            expect(await store.refresh(mergeAt)).toBe(false);
            for (const fact of [0n, BigInt(mergeAt + 1)])
            {
                await h.db.db
                    .insert(server_info)
                    .values({ uid: "server", lastMergeMillis: fact })
                    .onConflictDoUpdate({
                        target: server_info.uid,
                        set: { lastMergeMillis: fact },
                    });
                expect(await store.refresh(mergeAt)).toBe(false);
            }
            expect(await h.db.db.select().from(trigger_timmer)).toHaveLength(0);
            await h.db.db.update(server_info).set({ lastMergeMillis: BigInt(mergeAt) });
            const now = mergeAt + 24 * hour;
            const ticks = await Promise.all(Array.from({ length: 6 }, () => store.refresh(now)));
            expect(ticks.filter(Boolean)).toHaveLength(1);
            const timers = await h.db.db.select().from(trigger_timmer);
            expect(timers.map((row) => row.timmer_name).sort()).toEqual(
                rules
                    .filter((rule) => ["656", "748", "749"].includes(String(rule.id)))
                    .map((rule) => rule.name!)
                    .sort(),
            );
            expect(timers.every((row) => row.count === 1 && row.last_exec_millis === BigInt(now)))
                .toBe(
                    true,
                );
            expect(await h.db.db.select().from(command_receipt)).toHaveLength(1);
            expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(1);
            expect(await h.db.db.select().from(economy_posting)).toHaveLength(0);
            expect((await store.current(now)).map((effect) => effect.id)).toEqual([
                307,
                308,
                309,
                310,
            ]);
            expect(await store.refresh(now + 599999)).toBe(false);
            const overlay = await store.overlay(
                new Map([
                    ["305", "{\"value\":\"7\"}"],
                    ["310", "{\"value\":\"999\"}"],
                ]),
                now,
            );
            expect(overlay.get("305")).toBe("{\"value\":\"7\"}");
            expect(decodeWorldPowerEffects(overlay).find((effect) => effect.id === 310)?.value)
                .toBe("100");
            const replacement = await acquireRealmAuthority(h.db.db, 1, () => true);
            await expect(store.refresh(now + 600000)).rejects.toThrow();
            await expect(store.current(now)).rejects.toThrow();
            const recovered = createMergeCampaignStore(h.db.db, replacement, rules);
            expect(await recovered.current(now)).toHaveLength(4);
            expect(await recovered.refresh(now + 600000)).toBe(true);
            expect((await h.db.db.select().from(trigger_timmer)).every((row) => row.count === 2))
                .toBe(
                    true,
                );
            const end120 = mergeAt + 120 * hour;
            await recovered.refresh(end120);
            expect((await recovered.current(end120 + 599999)).map((effect) => effect.id)).toEqual([
                307,
                308,
                309,
                310,
            ]);
            await recovered.refresh(end120 + 600000);
            expect((await recovered.current(end120 + 600000)).map((effect) => effect.id)).toEqual([
                310,
            ]);
            const end168 = mergeAt + 168 * hour;
            await recovered.refresh(end168);
            expect((await recovered.current(end168 + 599999)).map((effect) => effect.id)).toEqual([
                310,
            ]);
            expect(await recovered.current(end168 + 600000)).toEqual([]);
            expect(await recovered.refresh(end168 + 600000)).toBe(true);
            expect(await recovered.refresh(end168 + 600001)).toBe(false);
            expect((await recovered.overlay(overlay, end168 + 600000)).has("310")).toBe(false);
            await h.db.db.update(server_info).set({ lastMergeMillis: BigInt(end168 + 1) });
            expect(await recovered.current(end168 + 2)).toEqual([]);
            expect((await h.db.db.select().from(trigger_var))[0]?.key).toBe("realm.merge.effects");
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test("outbox failure rolls back timer progress, snapshots and receipts together", async () => {
    const h = await cityHarness();
    try
    {
        await h.db.db.insert(server_info).values({
            uid: "server",
            lastMergeMillis: BigInt(mergeAt),
        });
        const store = createMergeCampaignStore(
            h.db.db,
            h.authority,
            h.rules.advanced.campaignRules ?? [],
        );
        await h.db.pool.query(
            "create function reject_merge_board() returns trigger language plpgsql as $$ begin raise exception 'synthetic board failure'; end $$",
        );
        await h.db.pool.query(
            "create trigger reject_merge_board before insert on opencok_kingdom.mutation_outbox for each row execute function reject_merge_board()",
        );
        await expect(store.refresh(mergeAt + 24 * hour)).rejects.toThrow();
        expect(await h.db.db.select().from(trigger_timmer)).toHaveLength(0);
        expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
        expect(await h.db.db.select().from(command_receipt)).toHaveLength(0);
        await h.db.pool.query("drop trigger reject_merge_board on opencok_kingdom.mutation_outbox");
        await store.refresh(mergeAt + 24 * hour);
        const current = () => store.current(mergeAt + 169 * hour).then(mergeEffectBoard);
        const sent: { owner: string; body: Fields; }[] = [];
        await h.db.db.update(userprofile).set({ banFlag: 1 }).where(eq(userprofile.uid, "other"));
        expect(
            await relayMutationEvent(
                h.db.db,
                h.authority,
                async () => {
                    await publishMergeEffectBoard(
                        ["owner", "other", "missing"],
                        createCampaignAudience(h.db.db, h.authority),
                        current,
                        async (owner, command, body) => {
                            expect(command).toBe("world.effect.push");
                            sent.push({ owner, body });
                        },
                        () => mergeAt + 169 * hour,
                    );
                },
                () => mergeAt + 169 * hour,
                "merge.campaign.board",
                1000,
                mergeCampaignActor,
            ),
        ).toBe(true);
        expect(sent.map((entry) => entry.owner)).toEqual(["owner"]);
        expect(decode(encode(sent[0]!.body))).toEqual(mergeEffectBoard([]));
        expect((await h.db.db.select().from(mutation_outbox))[0]?.publishedAt).toBe(
            BigInt(mergeAt + 169 * hour),
        );
        await h.db.db.update(trigger_var).set({
            value: JSON.stringify({
                version: 1,
                effects: Array(5).fill({ id: 310 }),
                notified: [],
            }),
        });
        await expect(store.current(mergeAt + 24 * hour)).rejects.toThrow();
        await expect(store.refresh(mergeAt + 24 * hour)).rejects.toThrow();
    }
    finally
    {
        await h.close();
    }
}, 120000);

test(
    "sign-in grants use the live authoritative boost once and preserve direct resource rewards",
    async () => {
        const h = await cityHarness([questsDomain]);
        try
        {
            h.clock.now = mergeAt + 24 * hour;
            await h.db.db.insert(server_info).values({
                uid: "server",
                lastMergeMillis: BigInt(mergeAt),
            });
            const store = createMergeCampaignStore(
                h.db.db,
                h.authority,
                h.rules.advanced.campaignRules ?? [],
            );
            await store.refresh(h.clock.now);
            h.rules.features.set("server_buff", {
                id: "server_buff",
                version: "1.0.0",
                online: "all",
                test: "all",
            });
            h.effects.world = async () =>
                new Map(
                    worldPowerEffects(
                        decodeWorldPowerEffects(await store.overlay(new Map(), h.clock.now)),
                        h.rules,
                        { kingdomId: 1, version: "12.06.0", now: h.clock.now },
                    ),
                );
            h.rules.reconnect.rewards!.set("synthetic", {
                id: "synthetic",
                item: "200001",
                num: "3",
                rate: "100",
                circle: "1",
                wood: "7",
            });
            await h.db.db.insert(user_14day_login).values(
                ["owner", "other"].map((uid) => ({
                    uid,
                    type: 1,
                    day: 1,
                    lastRewardTime: BigInt(h.clock.now - 86400000),
                    reward: Array(7).fill("1|synthetic|synthetic").join(";"),
                })),
            );
            const before = (
                await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
            )[0]!.wood!;
            const request = { operationId: sfs.string(randomUUID()) };
            const claimed = await h.command("signIn.reward", request);
            await h.command("signIn.reward", request);
            expect(
                (
                    await h.db.db
                        .select()
                        .from(user_item)
                        .where(and(eq(user_item.ownerId, "owner"), eq(user_item.itemId, "200001")))
                )[0]?.count,
            ).toBe(6);
            expect(
                (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[
                    0
                ]!.wood!
                    - before,
            ).toBe(7n);
            const reward = claimed.body.reward!;
            expect(reward.type).toBe(sfs.array().type);
            expect(int(fields(fields((reward.value as Value[])[1]).value), "num")).toBe(6);
            const postings = await h.db.db
                .select()
                .from(economy_posting)
                .where(eq(economy_posting.ownerUid, "owner"));
            expect(
                postings
                    .filter((posting) => posting.asset.startsWith("item."))
                    .map((posting) => posting.delta),
            ).toEqual([6n]);
            h.clock.now = mergeAt + 169 * hour;
            await h.db.db
                .update(user_14day_login)
                .set({ lastRewardTime: BigInt(h.clock.now - 86400000) })
                .where(eq(user_14day_login.uid, "other"));
            await h.command("signIn.reward", {}, "other");
            expect(
                (
                    await h.db.db
                        .select()
                        .from(user_item)
                        .where(and(eq(user_item.ownerId, "other"), eq(user_item.itemId, "200001")))
                )[0]?.count,
            ).toBe(3);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "imported exact-name timer progress suppresses early execution and resumes at actual successful time",
    async () => {
        const h = await cityHarness();
        try
        {
            const now = mergeAt + 24 * hour;
            await h.db.db.insert(server_info).values({
                uid: "server",
                lastMergeMillis: BigInt(mergeAt),
            });
            const rules = h.rules.advanced.campaignRules ?? [];
            const harvest = rules.find((rule) => String(rule.id) === "656")!;
            await h.db.db
                .insert(trigger_timmer)
                .values({
                    timmer_name: harvest.name!,
                    count: 11,
                    last_exec_millis: BigInt(now - 300000),
                });
            const store = createMergeCampaignStore(h.db.db, h.authority, rules);
            await store.refresh(now);
            expect((await store.current(now)).map((effect) => effect.id)).toEqual([309, 310]);
            expect(
                (
                    await h.db.db
                        .select()
                        .from(trigger_timmer)
                        .where(eq(trigger_timmer.timmer_name, harvest.name!))
                )[0]?.count,
            ).toBe(11);
            await store.refresh(now + 300000);
            expect(
                (
                    await h.db.db
                        .select()
                        .from(trigger_timmer)
                        .where(eq(trigger_timmer.timmer_name, harvest.name!))
                )[0],
            ).toMatchObject({ count: 12, last_exec_millis: BigInt(now + 300000) });
            const effects = await h.db.db.transaction((tx) => store.current(now + 300000, tx));
            expect(effects.find((effect) => effect.id === 307)?.start).toBe(now + 300000);
            expect(effects.find((effect) => effect.id === 307)?.end).toBe(now + 900000);
            let enter!: () => void, release!: () => void;
            const entered = new Promise<void>((resolve) => {
                enter = resolve;
            });
            const released = new Promise<void>((resolve) => {
                release = resolve;
            });
            const reading = h.db.db.transaction(async (tx) => {
                expect(await store.current(now + 300000, tx)).toHaveLength(4);
                enter();
                await released;
            });
            await entered;
            let changed = false;
            const changing = h.db.db
                .update(server_info)
                .set({ lastMergeMillis: BigInt(now + 300000) })
                .then(() => {
                    changed = true;
                });
            await Bun.sleep(20);
            expect(changed).toBe(false);
            release();
            await Promise.all([reading, changing]);
            expect(await store.current(now + 300000)).toEqual([]);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
