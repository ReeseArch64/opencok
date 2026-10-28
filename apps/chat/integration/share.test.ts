import { expect, test } from "bun:test";
import {
    chat_feed,
    chat_feed_notice,
    chat_operation,
    chat_event,
} from "@opencok/drizzle/schema/opencok_chat/chat_social";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { eq, and, count } from "drizzle-orm";
import { withShareDatabase } from "./support/share";
import { startChatProcess } from "./support/process";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { WebSocket } from "ws";

const lifetime = 30 * 86_400_000;

test(
    "shared feeds retain receipt hashes, concurrent replay, notices and current realm membership",
    async () => {
        await withShareDatabase(async (context) => {
            const { command, databases } = context;
            const db = databases.global.db;
            await command("blocked", "chat.lock", { uid: "alice" });
            const params = {
                msg: "Battle Ω",
                type: 7,
                data: "{\"battle\":\"synthetic\"}",
                auth: "alliance",
                notices: "bob,bob,blocked,stale,outsider,remote,absent",
                localid: "local-1",
            };
            const responses = await Promise.all([
                command("alice", "chat.feed.send", params, "feed-receipt"),
                command("alice", "chat.feed.send", params, "feed-receipt"),
            ]);
            expect(responses[0]).toEqual(responses[1]);
            const id = String(responses[0]!.id);
            expect(responses[0]).toEqual({ id, localid: "local-1" });
            const rows = await db.select().from(chat_feed);
            expect(rows).toHaveLength(1);
            expect(rows[0]).toMatchObject({
                id,
                owner: "alice",
                realm: 1,
                alliance: "guild",
                parent: null,
                type: 7,
                createdAt: BigInt(context.now()),
                expiresAt: BigInt(context.now() + lifetime),
                deletedAt: null,
            });
            const body = {
                id,
                time: context.now(),
                type: 7,
                msg: "Battle Ω",
                data: params.data,
                sender: "alice",
                fid: "",
                status: 1,
                authority: { alliance: "guild" },
            };
            expect(rows[0]!.body).toEqual(body);
            expect(
                (await db.select().from(chat_operation).where(
                    eq(chat_operation.operationId, "feed-receipt"),
                ))[0]?.hash,
            ).toBe("a979e0118ebe4961591d7371c0ce095fb1dd1cf842f2f6bc2fad2065941a0072");
            expect(
                (await db.select().from(chat_feed_notice).orderBy(chat_feed_notice.owner)).map((
                    notice,
                ) => notice.owner),
            ).toEqual(["bob", "remote"]);
            const events = await db.select().from(chat_event).where(eq(chat_event.owner, "alice"))
                .orderBy(chat_event.sequence);
            expect(
                events.map((event) => ({
                    owner: event.owner,
                    target: event.target,
                    room: event.room,
                    data: event.data,
                })),
            ).toEqual(
                ["bob", "remote"].map((target) => ({
                    owner: "alice",
                    target,
                    room: "",
                    data: { cmd: "push.chat.feed.notice", data: { id } },
                })),
            );
            await expect(
                command("alice", "chat.feed.send", { ...params, msg: "different" }, "feed-receipt"),
            ).rejects.toThrow("conflicting_request");
            await context.reconnect();
            expect(await command("alice", "chat.feed.send", params, "feed-receipt")).toEqual(
                responses[0],
            );
            expect(await command("bob", "chat.feed.get", {})).toEqual({ feed: [body] });
            for (const owner of ["remote", "stale", "outsider", "blocked"])
            {
                expect(await command(owner, "chat.feed.get", {})).toEqual({ feed: [] });
            }
            await databases.getKingdom(1).db.update(alliance_member).set({ allianceId: "changed" })
                .where(eq(alliance_member.uid, "bob"));
            expect(await command("bob", "chat.feed.get", {})).toEqual({ feed: [] });
            await command("bob", "chat.feed.notice.del", { ids: id });
            expect((await db.select().from(chat_feed_notice)).map((notice) => notice.owner))
                .toEqual(["remote"]);
            await command("remote", "chat.feed.notice.del", { ids: "" });
            expect(await db.select().from(chat_feed_notice)).toHaveLength(1);
            await databases.getKingdom(1).db.update(alliance_member).set({ allianceId: "changed" })
                .where(eq(alliance_member.uid, "alice"));
            expect(await command("alice", "chat.feed.get", {})).toEqual({ feed: [body] });
            await expect(
                command("alice", "chat.feed.send", { msg: "stale membership", auth: "alliance" }),
            ).rejects.toThrow("invalid_room");
            expect(await db.select().from(chat_feed)).toHaveLength(1);
        });
    },
    120000,
);

test(
    "feed roots, truthy GM authorization and soft deletion retain persisted children and notices",
    async () => {
        await withShareDatabase(async ({ command, databases, now }) => {
            const db = databases.global.db;
            const root = String(
                (await command("alice", "chat.feed.send", {
                    msg: "root",
                    auth: "alliance",
                    notices: "bob",
                })).id,
            );
            const liked = String(
                (await command("bob", "chat.feed.send", { type: 101, fid: root, auth: "alliance" }))
                    .id,
            );
            const reply = String(
                (await command("bob", "chat.feed.send", {
                    type: 102,
                    fid: root,
                    msg: "reply",
                    auth: "alliance",
                })).id,
            );
            expect(
                (await db.select().from(chat_feed).where(eq(chat_feed.parent, root))).map((row) =>
                    row.id
                ).sort(),
            ).toEqual([liked, reply].sort());
            await expect(command("bob", "chat.feed.send", { type: 102, fid: root })).rejects
                .toThrow("invalid_message");
            await expect(command("bob", "chat.feed.send", { type: 101, fid: liked })).rejects
                .toThrow("feed_permission_denied");
            await expect(command("remote", "chat.feed.send", { type: 101, fid: root })).rejects
                .toThrow("feed_permission_denied");
            const privateId = String(
                (await command("alice", "chat.feed.send", { msg: "private" })).id,
            );
            await expect(command("bob", "chat.feed.send", { type: 101, fid: privateId })).rejects
                .toThrow("feed_permission_denied");
            for (const owner of ["bob", "denied"])
            {
                await expect(command(owner, "chat.feed.del", { fid: root })).rejects.toThrow(
                    "feed_permission_denied",
                );
            }
            await command("moderator", "chat.feed.del", { fid: root });
            const deleted = await db.select().from(chat_feed).where(
                eq(chat_feed.deletedAt, BigInt(now())),
            );
            expect(deleted.map((row) => row.id).sort()).toEqual([root, liked, reply].sort());
            expect(deleted.map((row) => row.body)).toEqual([{}, {}, {}]);
            expect(await command("bob", "chat.feed.get", {})).toEqual({ feed: [] });
            expect(await db.select().from(chat_feed_notice)).toHaveLength(1);
            await expect(command("alice", "chat.feed.del", { fid: root })).rejects.toThrow(
                "feed_permission_denied",
            );
            await command("alice", "chat.feed.del", { fid: privateId });
            expect(await command("alice", "chat.feed.get", {})).toEqual({ feed: [] });
            await databases.getKingdom(1).db.update(userprofile).set({
                chatBanTime: BigInt(now() + 10000),
            }).where(eq(userprofile.uid, "alice"));
            await expect(command("alice", "chat.feed.send", { msg: "muted" }, "muted-feed")).rejects
                .toThrow("chat_muted");
            expect(
                await db.select().from(chat_operation).where(
                    eq(chat_operation.operationId, "muted-feed"),
                ),
            ).toEqual([]);
            await databases.getKingdom(1).db.update(userprofile).set({ banFlag: 1 }).where(
                eq(userprofile.uid, "alice"),
            );
            await expect(command("alice", "chat.feed.get", {})).rejects.toThrow("unauthorized");
        });
    },
    120000,
);

test(
    "feed visibility ends exactly at thirty days and cleanup removes at most five hundred feeds and notices",
    async () => {
        await withShareDatabase(async (context) => {
            const { command, databases } = context;
            const db = databases.global.db;
            const id = String(
                (await command("alice", "chat.feed.send", {
                    msg: "expires",
                    auth: "alliance",
                    notices: "bob",
                })).id,
            );
            context.advance(lifetime - 1);
            expect((await command("bob", "chat.feed.get", {})).feed).toHaveLength(1);
            context.advance(1);
            expect(await command("alice", "chat.feed.get", {})).toEqual({ feed: [] });
            await expect(command("bob", "chat.feed.send", { type: 101, fid: id })).rejects.toThrow(
                "feed_permission_denied",
            );
            const values = Array.from(
                { length: 500 },
                (_, index) => ({
                    id: `expired-${index}`,
                    owner: "alice",
                    realm: 1,
                    alliance: "guild",
                    type: 1,
                    body: {},
                    createdAt: BigInt(context.now() - lifetime),
                    expiresAt: BigInt(context.now()),
                }),
            );
            await db.insert(chat_feed).values([...values, {
                ...values[0]!,
                id: "future",
                expiresAt: BigInt(context.now() + 1),
            }]);
            await db.insert(chat_feed_notice).values(
                values.map((row) => ({ owner: "bob", feed: row.id, createdAt: row.createdAt })),
            );
            await context.repository.deleteExpired();
            expect((await db.select({ total: count() }).from(chat_feed))[0]?.total).toBe(2);
            expect((await db.select({ total: count() }).from(chat_feed_notice))[0]?.total).toBe(1);
            await context.repository.deleteExpired();
            expect((await db.select().from(chat_feed)).map((row) => row.id)).toEqual(["future"]);
            expect(await db.select().from(chat_feed_notice)).toEqual([]);
        });
    },
    120000,
);

test(
    "WebSocket feed commands preserve reply envelopes, local IDs, replay and serialized feed bodies",
    async () => {
        await withShareDatabase(async ({ repository, databaseUrl, databases }) => {
            const process = await startChatProcess(71, databaseUrl);
            let socket: WebSocket | undefined;
            try
            {
                const token = Buffer.alloc(32, 71).toString("base64url");
                await repository.sessions.create({
                    tokenHash: createHash("sha256").update(token).digest(),
                    uid: "alice",
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 86400000),
                });
                socket = new WebSocket(`${process.url.replace("http:", "ws:")}/chat/ws`, {
                    headers: { uid: "alice", session: token },
                });
                const frames: {
                    cmd: string;
                    sendTime?: number;
                    result?: Record<string, unknown>;
                    error?: unknown;
                }[] = [];
                socket.on("message", (raw) => {
                    frames.push(JSON.parse(raw.toString()));
                });
                await once(socket, "open");
                const send = async (
                    cmd: string,
                    params: Record<string, unknown>,
                    sendTime: number,
                ) => {
                    const offset = frames.length;
                    socket!.send(JSON.stringify({ cmd, params, sendTime }));
                    for (let attempt = 0; attempt < 300; attempt++)
                    {
                        const reply = frames.slice(offset).find((frame) =>
                            frame.cmd === cmd && frame.sendTime === sendTime
                        );
                        if (reply)
                        {
                            return reply;
                        }
                        await Bun.sleep(10);
                    }
                    throw new Error("Share frame timed out");
                };
                const params = {
                    msg: "native battle",
                    type: 9,
                    data: "{\"report\":1}",
                    localid: "native-local",
                };
                const sent = await send("chat.feed.send", params, 71001);
                expect(sent.error).toBeUndefined();
                expect(sent.result).toEqual({ id: expect.any(String), localid: "native-local" });
                expect(await send("chat.feed.send", params, 71001)).toEqual(sent);
                const read = await send("chat.feed.get", {}, 71002);
                expect(read.error).toBeUndefined();
                expect(read.result?.feed).toEqual([{
                    id: sent.result!.id,
                    time: expect.any(Number),
                    type: 9,
                    msg: "native battle",
                    data: "{\"report\":1}",
                    sender: "alice",
                    fid: "",
                    status: 1,
                    authority: { owner: "alice" },
                }]);
                expect(
                    await databases.global.db.select().from(chat_feed).where(
                        and(eq(chat_feed.owner, "alice"), eq(chat_feed.type, 9)),
                    ),
                ).toHaveLength(1);
            }
            finally
            {
                socket?.terminate();
                await process.close();
            }
        });
    },
    120000,
);
