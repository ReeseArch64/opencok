import { createChatNoticeCostReader } from "@opencok/repositories/chat-notice-cost";
import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { post_mail } from "@opencok/drizzle/schema/opencok_kingdom/post_mail";
import { post_box } from "@opencok/drizzle/schema/opencok_kingdom/post_box";
import { user_auth } from "@opencok/drizzle/schema/opencok_kingdom/user_auth";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { PostboxService } from "@opencok/services/postbox";
import { ChatNoticeService } from "@opencok/services/chat-notice";
import { createPostboxExecutor } from "@opencok/repositories/postbox";
import { createInventoryExecutor } from "@opencok/repositories/inventory";
import { cleanupSocialRealm } from "@opencok/repositories/social-cleanup";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { sfs, str, fields, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

test(
    "postbox and notices charge once, preserve recipients, cap rewards and redact expired receipts",
    async () => {
        const h = await cityHarness();
        try
        {
            const now = () => h.clock.now;
            const settings = h.rules.configuration.payControl!.get("69017")!;
            Object.assign(settings, {
                k1: "1970-01-01",
                k2: "2099-01-01",
                k7: "100",
                k8: "1",
                k10: "1",
            });
            for (const owner of ["owner", "other"])
            {
                await h.db.db
                    .insert(user_item)
                    .values({
                        uuid: `post-${owner}`,
                        ownerId: owner,
                        itemId: "209932",
                        count: 5,
                        value: 0,
                    });
            }
            await h.db.db
                .insert(user_item)
                .values({
                    uuid: "notice-owner",
                    ownerId: "owner",
                    itemId: "200011",
                    count: 1,
                    value: 0,
                });
            const postbox = new PostboxService(
                createPostboxExecutor(h.db.db, h.authority, now),
                h.rules,
                h.effects,
                now,
            );
            const notices = new ChatNoticeService(
                createInventoryExecutor(h.db.db, h.authority, now),
                h.rules,
                h.effects,
                now,
                undefined,
                createChatNoticeCostReader(h.db.db, 1),
            );
            const command = (owner: string, name: string, params: Fields, key = randomUUID()) =>
                postbox.command(owner, name, { operationId: sfs.string(key), ...params });
            const key = randomUUID(),
                params = {
                    contents: sfs.string("A letter"),
                    public: sfs.string("1"),
                    sealId: sfs.string("1"),
                };
            const first = await command("owner", "post.box.put", params, key);
            expect(await command("owner", "post.box.put", params, key)).toEqual(first);
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "post-owner")))[0]
                    ?.count,
            ).toBe(4);
            expect(await h.db.db.select().from(post_box)).toHaveLength(1);
            const drawn = await command("other", "post.box.get", {});
            const message = fields(drawn.body.message),
                id = str(message, "uid"),
                chatId = str(fields(drawn.body.chat), "chatId");
            expect(message.fromUser).toBeUndefined();
            expect(message.toUser).toBeUndefined();
            expect(fields(drawn.body.chat).players).toBeUndefined();
            const storedMail = (await h.db.db.select().from(post_mail))[0]!;
            expect(storedMail.fromUser).toBe("owner");
            expect(storedMail.toUser).toBe("other");
            await command("owner", "post.box.read", { uid: sfs.string(id) });
            expect(await h.db.db.select().from(post_mail)).toHaveLength(1);
            const readKey = randomUUID();
            const read = await command("other", "post.box.read", { uid: sfs.string(id) }, readKey);
            const seal =
                (await h.db.db.select().from(user_auth).where(eq(user_auth.uid, "other")))[0]!;
            h.clock.now += 1000;
            expect(await command("other", "post.box.read", { uid: sfs.string(id) }, readKey))
                .toEqual(read);
            expect(
                (await h.db.db.select().from(user_auth).where(eq(user_auth.uid, "other")))[0]?.seal,
            ).toBe(seal.seal);
            expect(await h.db.db.select().from(post_mail)).toHaveLength(0);
            await command("other", "post.box.chat", {
                chatId: sfs.string(chatId),
                contents: sfs.string("A reply"),
                public: sfs.string("0"),
            });
            expect((await h.db.db.select().from(post_mail))[0]?.toUser).toBe("owner");
            await command("owner", "post.box.put", params);
            await expect(command("other", "post.box.get", {})).rejects.toThrow();
            expect(await h.db.db.select().from(post_box)).toHaveLength(1);
            const noticeKey = randomUUID(),
                noticeParams = {
                    operationId: sfs.string(noticeKey),
                    itemId: sfs.string("200011"),
                    msg: sfs.string("Paid notice"),
                    usePoint: sfs.int(1),
                };
            const balance = (
                await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner"))
            )[0]!.gold;
            const sent = await notices.command("owner", "chat.notice", noticeParams);
            expect(await notices.command("owner", "chat.notice", noticeParams)).toEqual(sent);
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "notice-owner")))[
                    0
                ]?.count,
            ).toBe(0);
            expect(
                (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]
                    ?.gold,
            ).toBe(balance);
            expect(
                (await h.db.db.select().from(mutation_outbox)).filter(
                    (event) => event.eventType === "social.notice",
                ),
            ).toHaveLength(1);
            await expect(
                notices.command("owner", "chat.notice", {
                    ...noticeParams,
                    operationId: sfs.string(randomUUID()),
                    usePoint: sfs.int(0),
                }),
            ).rejects.toThrow();
            const price = BigInt(h.rules.goods.get("200011")!.price!);
            const originalPools = {
                gold: price / 2n,
                paidSpecialGold: price / 4n,
                paidGold: price * 2n,
            };
            await h.db.db.update(userprofile).set(originalPools).where(
                eq(userprofile.uid, "owner"),
            );
            const goldKey = randomUUID();
            await notices.command("owner", "chat.notice", {
                ...noticeParams,
                operationId: sfs.string(goldKey),
            });
            h.clock.now += 31 * 86_400_000;
            const goldRefund = await notices.refund("owner", goldKey);
            expect(await notices.refund("owner", goldKey)).toEqual(goldRefund);
            const restored = (
                await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner"))
            )[0]!;
            expect({
                gold: restored.gold,
                paidGold: restored.paidGold,
                paidSpecialGold: restored.paidSpecialGold,
            }).toEqual(originalPools);
            const refunded = await notices.refund("owner", noticeKey);
            expect(await notices.refund("owner", noticeKey)).toEqual(refunded);
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "notice-owner")))[
                    0
                ]?.count,
            ).toBe(1);
            await h.db.db
                .update(mutation_outbox)
                .set({ publishedAt: BigInt(now()) })
                .where(eq(mutation_outbox.eventType, "social.notice"));
            await cleanupSocialRealm(h.db.db, h.authority, h.clock.now);
            expect(await h.db.db.select().from(post_mail)).toHaveLength(0);
            expect(await h.db.db.select().from(post_box)).toHaveLength(0);
            expect(
                (await h.db.db.select().from(command_receipt))
                    .filter((row) => row.command !== "chat.notice.refund")
                    .every((row) => row.request.length === 0 && row.response.length === 0),
            ).toBe(true);
            await expect(command("owner", "post.box.put", params, key)).rejects.toThrow("expired");
            await acquireRealmAuthority(h.db.db, 1, () => true);
            await expect(command("owner", "post.box.put", params)).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120_000,
);
