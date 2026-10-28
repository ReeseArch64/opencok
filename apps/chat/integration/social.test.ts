import { nicknameAccountUid } from "@opencok/account/repositories/nickname-identity";
import { chat_shield } from "@opencok/drizzle/schema/opencok_kingdom/chat_shield";
import { verifySocialTransports } from "./support/social";
import { realmChatDeliveries } from "@opencok/services/realm-chat-delivery";
import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { createDatabases } from "@opencok/drizzle";
import { createChatRepository } from "@opencok/repositories/chat";
import { createChatSocialService } from "@opencok/services/chat-social";
import { createChatArchiveStore } from "@opencok/mongoose/chat-archive";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { chat_message } from "@opencok/drizzle/schema/opencok_chat/chat_message";
import { chat_event } from "@opencok/drizzle/schema/opencok_chat/chat_social";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";

test(
    "social transactions survive restart, revoke access and archive verified bodies on original deadlines",
    async () => {
        const pg = new DisposablePostgres();
        const mongo = `opencok-chat-mongo-${randomUUID()}`;
        let mongoStarted = false;
        let databases: ReturnType<typeof createDatabases> | undefined;
        let first: ReturnType<typeof createChatRepository> | undefined;
        let second: ReturnType<typeof createChatRepository> | undefined;
        let archive: ReturnType<typeof createChatArchiveStore> | undefined;
        let time = new Date(Math.floor(Date.now() / 1000) * 1000);
        try
        {
            await pg.docker([
                "run",
                "--detach",
                "--rm",
                "--name",
                mongo,
                "--publish",
                "127.0.0.1::27017",
                "mongo:8.0.34",
            ]);
            mongoStarted = true;
            const port = Buffer.from(await pg.docker(["port", mongo, "27017/tcp"]))
                .toString()
                .trim()
                .split(":")
                .at(-1);
            archive = createChatArchiveStore(
                `mongodb://127.0.0.1:${port}/opencok_chat`,
                () => time.getTime(),
            );
            const admin = await pg.start();
            try
            {
                for (const name of ["opencok_global", "opencok_kingdom_1", "opencok_kingdom_2"])
                {
                    await admin.query(`CREATE DATABASE "${name}"`);
                }
            }
            finally
            {
                await admin.end();
            }
            databases = createDatabases(pg.options);
            await migrate(databases.global.db, {
                migrationsFolder:
                    new URL("../../../packages/drizzle/migrations/global", import.meta.url)
                        .pathname,
            });
            for (const kingdom of databases.kingdoms.values())
            {
                await migrate(kingdom.db, {
                    migrationsFolder:
                        new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
                            .pathname,
                });
            }
            for (
                const [uid, realm, gm] of [
                    ["alice", 1, 0],
                    ["bob", 2, 0],
                    ["carol", 1, 0],
                    ["moderator", 1, 10],
                ] as const
            )
            {
                await databases.global.db.insert(account_new).values({
                    gameUid: uid,
                    server: String(realm),
                    uuid: "synthetic",
                    gameUserLevel: 1,
                    lastTime: 0n,
                });
                await databases.getKingdom(realm).db.insert(userprofile).values({
                    uid,
                    name: uid,
                    country: "BR",
                    level: 1,
                    exp: 0,
                    lang: "pt",
                    serverId: realm,
                    gmFlag: gm,
                });
            }
            const databaseUrl =
                `postgres://postgres:${pg.options.password}@127.0.0.1:${pg.options.port}/opencok_global`;
            const config = {
                databaseUrl,
                now: () => time,
                archive,
                renderRealmEvents: (
                    realm: number,
                    owners: string[],
                    events: import("@opencok/contracts/chat-delivery").ChatDeliveryEvent[],
                ) => realmChatDeliveries(first!, realm, owners, events),
            };
            first = createChatRepository({ ...config, nicknameAccountUid });
            second = createChatRepository({ ...config, nicknameAccountUid });
            const social = createChatSocialService(first.social!);
            const command = (
                owner: string,
                cmd: Parameters<typeof social.execute>[1],
                params: unknown,
                key = randomUUID(),
            ) => social.execute(owner, cmd, params, key);
            const legacyShield = randomUUID();
            await databases
                .getKingdom(1)
                .db.insert(chat_shield)
                .values({
                    uuid: legacyShield,
                    owner: "carol",
                    other: "alice",
                    time: BigInt(time.getTime()),
                });
            expect(await first.access!.canReceive("carol", "alice")).toBe(false);
            await command("carol", "chat.unlock", { uuid: legacyShield });
            expect(await second.access!.canReceive("carol", "alice")).toBe(true);
            const receipt = randomUUID();
            const applied = await Promise.all([
                command("alice", "contact.apply", { friendUid: "bob" }, receipt),
                command("alice", "contact.apply", { friendUid: "bob" }, receipt),
            ]);
            expect(applied[0]).toEqual(applied[1]);
            expect((await command("bob", "contact.audit", {})).contacts).toHaveLength(1);
            await command("bob", "contact.accept", { friendUid: "alice" });
            await command("alice", "contact.favo", { friendUid: "bob" });
            expect((await command("alice", "contact.get", {})).contacts).toMatchObject([
                { friendUid: "bob", stat: 2 },
            ]);
            const dmKey = randomUUID();
            await command("alice", "chat.private", { uid: "bob", msg: "offline message" }, dmKey);
            expect(await second.mailbox!.list("bob", 2, "alice", 3, 100)).toHaveLength(1);
            await command("alice", "chat.private", { uid: "bob", msg: "offline message" }, dmKey);
            expect(await second.mailbox!.list("bob", 2, "alice", 3, 100)).toHaveLength(1);
            await expect(
                command("alice", "chat.private", { uid: "bob", msg: "changed" }, dmKey),
            ).rejects.toThrow("conflicting_request");
            await command("bob", "chat.lock", { uid: "alice" });
            await expect(command("alice", "chat.private", { uid: "bob", msg: "blocked" })).rejects
                .toThrow(
                    "private_message_denied",
                );
            expect(await second.access!.canReceive("bob", "alice")).toBe(false);
            await command("bob", "chat.unlock", { uuid: "alice" });
            const room = await command("alice", "chat.room.mk", {
                name: "Friends",
                members: ["bob", "carol"],
            });
            const roomId = String(room.roomId);
            await command("bob", "chat.room.send", { id: roomId, msg: "hello room" });
            await expect(
                command("bob", "chat.room.member.kick", { id: roomId, members: ["carol"] }),
            ).rejects.toThrow("room_permission_denied");
            await command("alice", "chat.room.member.kick", { id: roomId, members: ["bob"] });
            expect(await second.access!.privateRoom("bob", roomId)).toBe(false);
            await expect(command("bob", "chat.room.msg", { id: roomId })).rejects.toThrow(
                "room_permission_denied",
            );
            await command("alice", "chat.room.member.quit", { id: roomId });
            expect((await command("carol", "chat.room.user.rooms", {})).rooms).toMatchObject([
                { owner: "carol", role: 2 },
            ]);
            await expect(command("alice", "chat.ban", { uid: "bob" })).rejects.toThrow(
                "moderation_denied",
            );
            await command("moderator", "chat.ban", { uid: "bob", time: 60 });
            await expect(command("bob", "chat.private", { uid: "alice", msg: "muted" })).rejects
                .toThrow(
                    "chat_muted",
                );
            time = new Date(time.getTime() + 60_000);
            expect(await second.access!.canSend("bob")).toBe(true);
            await first.delivery!.acquire("first", "first-token");
            await second.delivery!.acquire("second", "second-token");
            await expect(second.delivery!.acquire("first", "stolen-token")).rejects.toThrow(
                "already active",
            );
            const input = {
                roomId: "global_public",
                senderUid: "alice",
                idempotencyKey: "global-1",
                body: "archive me",
                now: time,
            };
            const saved = await first.messages.create(input);
            expect(
                (await second.delivery!.poll("second", "second-token")).events.some(
                    (event) =>
                        event.message?.sequenceId === saved.sequenceId
                        && event.message.body === "archive me",
                ),
            ).toBe(true);
            const event = (await first.delivery!.poll("first", "first-token")).events.at(-1)!;
            await first.delivery!.acknowledge("first", "first-token", event.sequence);
            expect((await first.delivery!.poll("first", "first-token")).events).toHaveLength(0);
            const createdAt = time.getTime();
            time = new Date(createdAt + 86_400_000);
            expect(await second.messages.getAll("global_public")).toHaveLength(0);
            expect(
                (
                    await second.messages.page!({
                        roomId: "global_public",
                        before: 0,
                        limit: 100,
                        archive: true,
                    })
                ).messages,
            ).toHaveLength(1);
            await pg.docker(["pause", mongo]);
            try
            {
                await expect(first.archivePending!()).rejects.toThrow();
                expect(
                    (
                        await databases.global.db
                            .select()
                            .from(chat_message)
                            .where(eq(chat_message.sequence_id, BigInt(saved.sequenceId)))
                    )[0]?.body,
                ).toBe("archive me");
                expect(
                    (
                        await second.messages.page!({
                            roomId: "global_public",
                            before: 0,
                            limit: 100,
                            archive: true,
                        })
                    ).messages,
                ).toHaveLength(1);
            }
            finally
            {
                await pg.docker(["unpause", mongo]);
            }
            for (let attempt = 0;; attempt++)
            {
                try
                {
                    await first.archivePending!();
                    break;
                }
                catch (error)
                {
                    if (attempt >= 4)
                    {
                        throw error;
                    }
                    await Bun.sleep(100);
                }
            }
            const originalArchive = await archive.get(saved.sequenceId);
            expect(
                (
                    await databases.global.db
                        .select()
                        .from(chat_message)
                        .where(eq(chat_message.sequence_id, BigInt(saved.sequenceId)))
                )[0]?.body,
            ).toBeNull();
            expect((await archive.get(saved.sequenceId))?.expiresAt).toBe(
                createdAt + 7 * 86_400_000,
            );
            expect(
                (
                    await second.messages.page!({
                        roomId: "global_public",
                        before: 0,
                        limit: 100,
                        archive: true,
                    })
                ).messages[0]?.body,
            ).toBe("archive me");
            await command("moderator", "chat.message.delete", { seqId: saved.sequenceId });
            await first.archivePending!();
            await archive.put(originalArchive!);
            expect(await archive.get(saved.sequenceId)).toBeNull();
            expect(
                (
                    await second.messages.page!({
                        roomId: "global_public",
                        before: 0,
                        limit: 100,
                        archive: true,
                    })
                ).messages,
            ).toHaveLength(0);
            await expect(first.messages.create(input)).rejects.toThrow("expired");
            const another = await first.messages.create({
                ...input,
                idempotencyKey: "global-2",
                now: time,
            });
            time = new Date(time.getTime() + 7 * 86_400_000);
            expect(
                (
                    await second.messages.page!({
                        roomId: "global_public",
                        before: 0,
                        limit: 100,
                        archive: true,
                    })
                ).messages,
            ).toHaveLength(0);
            await first.archivePending!();
            expect(await archive.get(another.sequenceId)).toBeNull();
            expect(await databases.global.db.select().from(chat_event)).not.toHaveLength(0);
            await first.close();
            first = undefined;
            await second.close();
            second = undefined;
            await databases.close();
            await pg.restart();
            databases = createDatabases(pg.options);
            first = createChatRepository({
                nicknameAccountUid,
                ...config,
                databaseUrl:
                    `postgres://postgres:${pg.options.password}@127.0.0.1:${pg.options.port}/opencok_global`,
            });
            expect(
                (
                    await createChatSocialService(first.social!).execute(
                        "alice",
                        "contact.get",
                        {},
                        randomUUID(),
                    )
                ).contacts,
            ).toMatchObject([{ friendUid: "bob", stat: 2 }]);
            time = new Date();
            second = createChatRepository({
                nicknameAccountUid,
                ...config,
                databaseUrl:
                    `postgres://postgres:${pg.options.password}@127.0.0.1:${pg.options.port}/opencok_global`,
            });
            await verifySocialTransports(
                first,
                `postgres://postgres:${pg.options.password}@127.0.0.1:${pg.options.port}/opencok_global`,
                databases,
            );
        }
        finally
        {
            await first?.close();
            await second?.close();
            await archive?.close();
            await databases?.close();
            await pg.stop();
            if (mongoStarted)
            {
                await pg.docker(["rm", "--force", mongo]);
            }
        }
    },
    120_000,
);
